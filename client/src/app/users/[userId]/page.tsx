"use client"
import { UserSummaryContext } from "@/app/context/userSummary"
import { Loader } from "@/app/components/Loader"
import { useContext, useMemo, useState } from "react"
import { Venue } from "@/app/api/client"
import { notFound } from "next/navigation"
import { GeoJSON, Feature, GeoJsonProperties, Geometry } from "geojson"
import { VenuesContext } from "@/app/context/venues"
import bbox from "@turf/bbox"
import {
  LngLatBoundsLike,
  Map,
  Marker,
  PaddingOptions,
  PointLike,
  Source,
  ViewState,
} from "@vis.gl/react-maplibre"
import Pin from "@/app/components/Pin"
import VisitCard from "@/app/components/VisitCard"

type InitMapViewProps = Partial<ViewState> & {
  bounds?: LngLatBoundsLike
  fitBoundsOptions?: {
    offset?: PointLike
    minZoom?: number
    maxZoom?: number
    padding?: number | PaddingOptions
  }
}

interface VenueMapProps {
  venues: Venue[]
  userVenueVisitIds: number[]
}

const VenueMap = ({ venues, userVenueVisitIds }: VenueMapProps) => {
  const features: Feature[] = venues.map((venue) => ({
    type: "Feature",
    properties: {
      id: venue.venue_id,
      visited: userVenueVisitIds.includes(venue.venue_id),
    },
    geometry: {
      type: "Point",
      coordinates: [Number(venue.longitude), Number(venue.latitude)],
    },
  }))
  const featureCollection: GeoJSON<Geometry, GeoJsonProperties> = {
    type: "FeatureCollection",
    features,
  }
  const [minLng, minLat, maxLng, maxLat] = bbox(featureCollection)
  const [mapViewState, setMapViewState] = useState<InitMapViewProps>({
    bounds: [minLng, minLat, maxLng, maxLat],
    fitBoundsOptions: { padding: 50 },
  })

  const venuePins = useMemo(
    () =>
      venues.map((venue) => (
        <Marker
          key={venue.venue_id}
          longitude={Number(venue.longitude)}
          latitude={Number(venue.latitude)}
          anchor="bottom"
        >
          <Pin
            colour={
              userVenueVisitIds.includes(venue.venue_id) ? "#00a300" : "#960000"
            }
            size={30}
          />
        </Marker>
      )),
    [venues],
  )

  return (
    <Map
      {...mapViewState}
      style={{ height: "500px" }}
      mapStyle={"https://tiles.openfreemap.org/styles/bright"}
    >
      <Source id="venue" type="geojson" data={featureCollection}>
        {venuePins}
      </Source>
    </Map>
  )
}

const Page = () => {
  const { userSummary, isLoadingUserSummary, isError } =
    useContext(UserSummaryContext)
  const { venues } = useContext(VenuesContext)

  const initialVisitIds: number[] = []
  const userVenueVisitIds = !userSummary
    ? []
    : userSummary.visits.reduce(
        (acc, cur) =>
          !acc.includes(cur.venue_id) ? [...acc, cur.venue_id] : acc,
        initialVisitIds,
      )

  return (
    <div className="md:w-2/3 lg:w-1/2 flex flex-col items-center md:mx-auto p-4">
      {isLoadingUserSummary ? (
        <Loader />
      ) : !userSummary || isError ? (
        notFound()
      ) : (
        <div className="w-full flex flex-col gap-4">
          <h2 className="font-bold text-2xl">{userSummary.display_name}</h2>
          <div>
            {userSummary.visits.length}{" "}
            {userSummary.visits.length === 1 ? "venue" : "venues"} visited
          </div>
          {venues && venues.length > 0 && (
            <VenueMap venues={venues} userVenueVisitIds={userVenueVisitIds} />
          )}
          <div className="flex flex-col gap-4">
            {userSummary.visits
              .sort((a, b) =>
                a.visit_date == null || b.visit_date == null
                  ? 0
                  : Date.parse(b.visit_date) - Date.parse(a.visit_date),
              )
              .map((visit) => (
                <VisitCard
                  key={visit.visit_id}
                  title={visit.venue_name}
                  titleHref={`/venues/${visit.venue_id}`}
                  review={visit}
                  visitUserId={userSummary.user_id}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
