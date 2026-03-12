"use client"
import { useContext, useState } from "react"
import { VenueMap } from "./VenueMap"
import { UserContext } from "./context/user"
import client, { Venue } from "./api/client"
import { Loader } from "./components/Loader"
import { ClientContext } from "./api/ReactQueryClientProvider"

export default function Home() {
  const { user } = useContext(UserContext)
  const { client } = useContext(ClientContext)
  const [currentVenue, setCurrentVenue] = useState<Venue | undefined>(undefined)

  const { data: venues, isLoading: isLoadingVenues } = client.useQuery(
    "get",
    "/venues",
  )

  return isLoadingVenues ? (
    <Loader />
  ) : (
    <div className="flex-grow">
      <VenueMap
        user={user}
        venues={venues ?? []}
        currentVenue={currentVenue}
        setCurrentVenue={setCurrentVenue}
      />
    </div>
  )
}
