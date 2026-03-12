"use client"

import { createContext, PropsWithChildren, useContext } from "react"
import client, { Venue } from "../api/client"
import { ClientContext } from "../api/ReactQueryClientProvider"

export const VenuesContext = createContext({
  venues: [] as Venue[],
  isLoadingVenues: false,
  fetchVenues: () => {},
})

export const VenuesProvider = ({ children }: PropsWithChildren) => {
  const { client } = useContext(ClientContext)
  const {
    data: venues,
    isLoading: isLoadingVenues,
    refetch: fetchVenues,
  } = client.useQuery("get", "/venues")
  return (
    <VenuesContext.Provider
      value={{ venues: venues ?? [], isLoadingVenues, fetchVenues }}
    >
      {children}
    </VenuesContext.Provider>
  )
}
