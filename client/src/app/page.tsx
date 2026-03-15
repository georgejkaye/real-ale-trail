"use client"
import { useContext, useState } from "react"
import { VenueMap } from "./VenueMap"
import { UserContext } from "./context/user"
import { Venue } from "./api/client"
import { Loader } from "./components/Loader"
import { ClientContext } from "./api/ReactQueryClientProvider"

interface VisitStatsPaneProps {
  currentVenueCount: number
  totalVenueCount: number
}

const VisitStatsPane = ({
  currentVenueCount,
  totalVenueCount,
}: VisitStatsPaneProps) => {
  return (
    <div className="absolute top-0 right-0 m-2 p-2 rounded-lg bg-white border-3 border-gray-200">
      <span className="text-lg font-bold">
        {currentVenueCount}/{totalVenueCount}
      </span>{" "}
      venues visited
    </div>
  )
}

export default function Home() {
  const { user } = useContext(UserContext)
  const { client } = useContext(ClientContext)
  const [currentVenue, setCurrentVenue] = useState<Venue | undefined>(undefined)

  const { data: venues, isLoading: isLoadingVenues } = client.useQuery(
    "get",
    "/venues",
  )

  var initialVenueIdArray: number[] = []
  const userCurrentVenueCount = !user
    ? 0
    : user.visits.reduce(
        (acc, cur) =>
          !acc.includes(cur.venue_id) ? [...acc, cur.venue_id] : acc,
        initialVenueIdArray,
      ).length
  const totalVenuesCount = !venues ? 0 : venues.length

  return isLoadingVenues ? (
    <Loader />
  ) : (
    <div className="flex-grow relative">
      <VenueMap
        user={user}
        venues={venues ?? []}
        currentVenue={currentVenue}
        setCurrentVenue={setCurrentVenue}
      />
      <VisitStatsPane
        currentVenueCount={userCurrentVenueCount}
        totalVenueCount={totalVenuesCount}
      />
    </div>
  )
}
