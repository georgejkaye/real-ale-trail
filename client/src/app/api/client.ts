import createFetchClient from "openapi-fetch"

import type { components, paths } from "./api"

export const fetchClient = createFetchClient<paths>({
  baseUrl: "/api",
})

export type User = components["schemas"]["UserPublicDetails"]
export type UserSummary = components["schemas"]["UserSummaryData"]
export type UserCount = components["schemas"]["UserCountData"]
export type Venue = components["schemas"]["VenueData"]
export type SingleVenue = components["schemas"]["SingleVenueData"]
export type VenueCrawl = components["schemas"]["VenueCrawlData"]
export type VenueVisit = components["schemas"]["VenueVisitData"]
export type SingleUserVisit = components["schemas"]["SingleUserVisitData"]
export type Visit = components["schemas"]["VisitData"]
export type VisitCrawl = components["schemas"]["VisitCrawlData"]

export default fetchClient
