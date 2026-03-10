import { User, Venue } from "./api/client"

export const getFirstVisitToVenue = (user: User, venue: Venue) =>
  user.visits
    .filter((visitVenue) => visitVenue.venue_id === venue.venue_id)
    .sort((a, b) =>
      a.visit_date && b.visit_date
        ? Date.parse(a.visit_date) - Date.parse(b.visit_date)
        : 0,
    )[0]

export const getAverageRating = (venue: Venue) =>
  venue.visits.length === 0
    ? 0
    : venue.visits.reduce((acc, cur) => acc + (cur.rating ?? 0), 0) /
      venue.visits.length

// https://stackoverflow.com/a/18883819

const toRad = (value: number) => {
  return (value * Math.PI) / 180
}

const getDistanceBetweenCoordinates = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 6371 // km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const lat1Rad = toRad(lat1)
  const lat2Rad = toRad(lat2)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return d
}

export const getDistanceToVenue = (
  venue: Venue,
  position: GeolocationPosition,
) => {
  return !venue.latitude || !venue.longitude
    ? undefined
    : getDistanceBetweenCoordinates(
        Number(venue.latitude),
        Number(venue.longitude),
        position.coords.latitude,
        position.coords.longitude,
      )
}
