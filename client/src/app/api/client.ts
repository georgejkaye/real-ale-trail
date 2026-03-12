import createFetchClient from "openapi-fetch"

import type { components, paths } from "./api"

export const fetchClient = createFetchClient<paths>({
  baseUrl: "/api",
})

export type User = components["schemas"]["UserPublicDetails"]
export type UserSummary = components["schemas"]["UserSummaryData"]
export type Venue = components["schemas"]["VenueData"]
export type VenueVisit = components["schemas"]["VenueVisitData"]
export type SingleUserVisit = components["schemas"]["SingleUserVisitData"]

export default fetchClient
