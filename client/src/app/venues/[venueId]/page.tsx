"use client"

import { LinkButton, SubmitButton } from "@/app/components/forms"
import { UserContext } from "@/app/context/user"
import { VenueContext } from "@/app/context/venue"
import Pin from "@/app/components/Pin"
import { Rating } from "@smastrom/react-rating"
import {
  Map,
  MapRef,
  Marker,
  MarkerEvent,
  Source,
} from "@vis.gl/react-maplibre"
import { Feature } from "geojson"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { useContext, useRef } from "react"
import { Loader } from "@/app/components/Loader"
import { VenueVisit } from "@/app/api/client"

interface VenueMapProps {
  venueId: number
  longitude: number
  latitude: number
}

const VenueMap = ({ venueId, longitude, latitude }: VenueMapProps) => {
  const venuePoint: Feature = {
    type: "Feature",
    properties: { id: venueId },
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  }
  const mapRef = useRef<MapRef>(null)
  const onClickMarker = (e: MarkerEvent<globalThis.MouseEvent>) => {
    e.originalEvent.stopPropagation()
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      duration: 2000,
      animate: true,
    })
  }
  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude,
        longitude,
        zoom: 15,
      }}
      style={{ height: "500px" }}
      mapStyle={"https://tiles.openfreemap.org/styles/bright"}
    >
      <Source id="venue" type="geojson" data={venuePoint}>
        <Marker
          key={venueId}
          longitude={longitude}
          latitude={latitude}
          anchor="bottom"
          onClick={onClickMarker}
        >
          <Pin colour="#00a300" size={40} />
        </Marker>
      </Source>
    </Map>
  )
}

interface VenueDetailsProps {
  venueId: number
  venueName: string
  venueAddress: string
  visits: VenueVisit[]
  longitude: number
  latitude: number
}

const VenueDetails = ({
  venueId,
  venueName,
  venueAddress,
  visits,
  longitude,
  latitude,
}: VenueDetailsProps) => {
  const venueVisitCount = visits.length
  const averageVenueRating =
    venueVisitCount === 0
      ? 0
      : visits.reduce((a, b) => a + (b.rating ?? 0), 0) / venueVisitCount
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{venueName}</h2>
      <div>{venueAddress}</div>
      <div className="flex flex-row gap-2">
        <div>
          {venueVisitCount} {venueVisitCount === 1 ? "visit" : "visits"}
        </div>
        <Rating
          style={{ maxWidth: 100 }}
          value={averageVenueRating}
          readOnly={true}
        />
      </div>
      <VenueMap venueId={venueId} latitude={latitude} longitude={longitude} />
    </div>
  )
}

interface VenueVisitProps {
  visit: VenueVisit
}

const VenueVisitCard = ({ visit }: VenueVisitProps) => {
  const { user } = useContext(UserContext)
  const visitDate = visit.visit_date
    ? new Date(Date.parse(visit.visit_date))
    : undefined
  return (
    <div className="rounded p-4 bg-accenthover text-accentfg flex flex-col gap-2">
      <div className="font-bold text-xl">
        <Link href={`/users/${visit.user_id}`}>{visit.user_display_name}</Link>
      </div>
      {visitDate && (
        <div className="">
          {visitDate.toLocaleDateString()}{" "}
          {visitDate.toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
      {visit.drink && visit.drink !== "" && (
        <div>
          <span className="font-bold">Drink: </span>
          {visit.drink}
        </div>
      )}
      {visit.notes && visit.notes !== "" && (
        <div>&apos;{visit.notes}&apos;</div>
      )}
      <Rating
        style={{ maxWidth: 100 }}
        value={visit.rating ?? 0}
        readOnly={true}
      />
      {user && user.user_id === visit.user_id && (
        <Link
          href={`/users/${user?.user_id}/visits/${visit.visit_id}/edit`}
          className="font-bold hover:underline"
        >
          Edit
        </Link>
      )}
    </div>
  )
}

const Page = () => {
  const router = useRouter()
  const { venue, isError } = useContext(VenueContext)
  const { user } = useContext(UserContext)
  const onClickRecordVisit = () => {
    router.push(`/venues/${venue?.venue_id}/visit`)
  }
  return (
    <div className="flex flex-col md:w-2/3 lg:w-1/2 p-4 md:mx-auto">
      {false ? (
        <Loader />
      ) : isError ? (
        notFound()
      ) : (
        venue &&
        venue.venue_id &&
        venue.venue_name &&
        venue.venue_address &&
        venue.latitude &&
        venue.longitude && (
          <div className="flex flex-col gap-4">
            <VenueDetails
              venueId={venue.venue_id}
              venueName={venue.venue_name}
              venueAddress={venue.venue_address}
              visits={venue.visits}
              latitude={Number(venue.latitude)}
              longitude={Number(venue.longitude)}
            />
            {user && (
              <LinkButton label="Record visit" onClick={onClickRecordVisit} />
            )}
            {venue.visits.map((visit) => (
              <VenueVisitCard key={visit.visit_id} visit={visit} />
            ))}
          </div>
        )
      )}
    </div>
  )
}

export default Page
