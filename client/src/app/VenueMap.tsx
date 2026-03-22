"use client"
import {
  FullscreenControl,
  LngLatBoundsLike,
  Map,
  MapRef,
  Marker,
  MarkerEvent,
  NavigationControl,
  PaddingOptions,
  PointLike,
  Popup,
  ScaleControl,
  Source,
  ViewState,
} from "@vis.gl/react-maplibre"
import { GeoJSON, Geometry, GeoJsonProperties, Feature } from "geojson"
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { UserContext } from "./context/user"
import Pin from "./components/Pin"
import { LinkButton } from "./components/forms"
import { useRouter } from "next/navigation"
import { Rating } from "@smastrom/react-rating"
import Link from "next/link"
import { getFirstVisitToVenue } from "./utils"
import bbox from "@turf/bbox"
import { SingleUserVisit, User, Venue, VenueVisit } from "./api/client"

const getVenueFeatureCollection = (
  venues: Venue[],
): GeoJSON<Geometry, GeoJsonProperties> => {
  const features: Feature[] = venues
    .filter((venue) => venue.longitude && venue.latitude)
    .map((venue) => ({
      type: "Feature",
      properties: {
        id: venue.venue_id,
      },
      geometry: {
        type: "Point",
        coordinates: [Number(venue.longitude), Number(venue.latitude)],
      },
    }))
  return {
    type: "FeatureCollection",
    features,
  }
}

interface VenueMarkerProps {
  venue: Venue
  currentVenue: Venue | undefined
  setCurrentVenue: (venue: Venue | undefined) => void
}

const VenueMarker = ({
  venue,
  currentVenue,
  setCurrentVenue,
}: VenueMarkerProps) => {
  const { user } = useContext(UserContext)
  const onClickMarker = (e: MarkerEvent<globalThis.MouseEvent>) => {
    e.originalEvent.stopPropagation()
    if (currentVenue && currentVenue.venue_id === venue.venue_id) {
      setCurrentVenue(undefined)
    } else {
      setCurrentVenue(venue)
    }
  }
  const userHasVisitedVenue = !user
    ? false
    : user.visits.filter(
        (visit: SingleUserVisit) => visit.venue_id === venue.venue_id,
      ).length > 0
  const pinColour = !user || !userHasVisitedVenue ? "#960000" : "#00a300"
  return (
    <Marker
      key={venue.venue_id}
      longitude={Number(venue.longitude)}
      latitude={Number(venue.latitude)}
      anchor="bottom"
      onClick={onClickMarker}
    >
      <Pin
        colour={pinColour}
        size={
          currentVenue && currentVenue.venue_id === venue.venue_id ? 50 : 40
        }
      />
    </Marker>
  )
}

interface CurrentVenueBoxProps {
  user: User | undefined
  venue: Venue
  setCurrentVenue: (venue: Venue | undefined) => void
}

const CurrentVenueBox = ({
  user,
  venue,
  setCurrentVenue,
}: CurrentVenueBoxProps) => {
  const router = useRouter()
  const venueVisitCount = venue.visits.length
  const averageVenueRating =
    venueVisitCount === 0
      ? 0
      : venue.visits.reduce(
          (a: number, b: VenueVisit) => a + (b.rating ?? 0),
          0,
        ) / venueVisitCount
  const onClickDetails = () => {
    router.push(`/venues/${venue.venue_id}`)
  }
  const onClickRecord = () => {
    router.push(`/venues/${venue.venue_id}/visit`)
  }
  const firstVisitToVenue = !user
    ? undefined
    : getFirstVisitToVenue(user, venue)

  return (
    <Popup
      anchor="bottom"
      longitude={Number(venue.longitude)}
      latitude={Number(venue.latitude)}
      onClose={() => setCurrentVenue(undefined)}
      closeButton={false}
      offset={47}
      maxWidth="60"
      className="w-3/4 md:w-1/2 lg:w-72 bg-back"
    >
      <div className="flex flex-col gap-2">
        <div className="font-bold text-xl">
          <Link href={`/venues/${venue.venue_id}`}>{venue.venue_name}</Link>
        </div>
        <div className="flex flex-row gap-2 h-5">
          <div>
            {venueVisitCount} {venueVisitCount === 1 ? "visit" : "visits"}
          </div>
          <Rating
            style={{ maxWidth: 100 }}
            value={averageVenueRating}
            readOnly={true}
          />
        </div>
        {firstVisitToVenue && firstVisitToVenue.visit_date && (
          <div>
            You visited on{" "}
            {new Date(
              Date.parse(firstVisitToVenue.visit_date),
            ).toLocaleDateString()}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <LinkButton label="More details" onClick={onClickDetails} />
          {user && <LinkButton label="Record visit" onClick={onClickRecord} />}
        </div>
      </div>
    </Popup>
  )
}

interface MapComponentProps {
  user: User | undefined
  venues: Venue[]
  featureCollection: GeoJSON<Geometry, GeoJsonProperties>
  currentVenue: Venue | undefined
  setCurrentVenue: Dispatch<SetStateAction<Venue | undefined>>
  height: number | string
}

const MapComponent = ({
  user,
  venues,
  featureCollection,
  currentVenue,
  setCurrentVenue,
  height,
}: MapComponentProps) => {
  const [minLng, minLat, maxLng, maxLat] = bbox(featureCollection)
  const [mapViewState, setMapViewState] = useState<InitMapViewProps>({
    bounds: [minLng, minLat, maxLng, maxLat],
    fitBoundsOptions: { padding: 50 },
  })
  const venuePins = useMemo(
    () =>
      venues.map((venue) => (
        <VenueMarker
          key={venue.venue_id}
          venue={venue}
          setCurrentVenue={setCurrentVenue}
          currentVenue={currentVenue}
        />
      )),
    [venues, currentVenue, setCurrentVenue],
  )
  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    if (currentVenue) {
      mapRef.current?.flyTo({
        center: [Number(currentVenue.longitude), Number(currentVenue.latitude)],
        duration: 2000,
        animate: true,
      })
    }
  }, [currentVenue])

  return (
    <Map
      {...mapViewState}
      onMove={(evt) => setMapViewState(evt.viewState)}
      ref={mapRef}
      style={{ width: "100%", height }}
      mapStyle={"https://tiles.openfreemap.org/styles/bright"}
    >
      <FullscreenControl position="top-left" />
      <NavigationControl position="top-left" />
      <ScaleControl />
      <Source
        id="venues"
        type="geojson"
        data={featureCollection}
        cluster={true}
        clusterMaxZoom={1}
        clusterRadius={100}
      >
        {venuePins}
        {currentVenue && (
          <CurrentVenueBox
            user={user}
            venue={currentVenue}
            setCurrentVenue={setCurrentVenue}
          />
        )}
      </Source>
    </Map>
  )
}

interface VenueMapProps {
  user: User | undefined
  venues: Venue[]
  currentVenue: Venue | undefined
  setCurrentVenue: Dispatch<SetStateAction<Venue | undefined>>
}

type InitMapViewProps = Partial<ViewState> & {
  bounds?: LngLatBoundsLike
  fitBoundsOptions?: {
    offset?: PointLike
    minZoom?: number
    maxZoom?: number
    padding?: number | PaddingOptions
  }
}

export const VenueMap = ({
  user,
  venues,
  currentVenue,
  setCurrentVenue,
}: VenueMapProps) => {
  const venueFeatureCollection = getVenueFeatureCollection(venues)
  return (
    venues.length > 0 && (
      <div>
        <div className="hidden md:flex">
          <MapComponent
            user={user}
            venues={venues}
            featureCollection={venueFeatureCollection}
            currentVenue={currentVenue}
            setCurrentVenue={setCurrentVenue}
            height={"calc(100vh - 60px)"}
          />
        </div>
        <div className="md:hidden">
          <MapComponent
            user={user}
            venues={venues}
            featureCollection={venueFeatureCollection}
            currentVenue={currentVenue}
            setCurrentVenue={setCurrentVenue}
            height={"calc(100dvh - 120px)"}
          />
        </div>
      </div>
    )
  )
}
