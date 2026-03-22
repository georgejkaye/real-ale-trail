"use client"

import { useContext, useState } from "react"
import { UserContext } from "@/app/context/user"
import { notFound, unauthorized, useRouter } from "next/navigation"
import { VenueContext } from "@/app/context/venue"
import { Loader } from "@/app/components/Loader"
import { ClientContext } from "@/app/api/ReactQueryClientProvider"
import RecordVisitForm from "@/app/components/RecordVisitForm"

const Page = () => {
  const { client } = useContext(ClientContext)
  const { token, user, isLoadingUser } = useContext(UserContext)
  const { venue, isLoadingVenue } = useContext(VenueContext)
  const router = useRouter()

  const [notesText, setNotesText] = useState("")
  const [ratingValue, setRatingValue] = useState(0)
  const [drinkText, setDrinkText] = useState("")
  const [errorText, setErrorText] = useState("")

  const { mutate: postVisit, isPending: isPendingPostVisit } =
    client.useMutation("post", "/visit", {
      onSuccess: () => {
        router.push("/")
        return client.invalidateQueries(
          "/auth/me",
          "/users/{user_id}",
          "/venues",
          "/venues/{venue_id}",
          "/visits",
        )
      },
      onError: (error) => {
        setErrorText(`Could not submit visit: ${error.detail}`)
      },
    })

  const submitVisit = async () => {
    if (venue && venue.venue_id) {
      const params = {
        query: {
          venue_id: venue.venue_id,
          visit_date: new Date(Date.now()).toISOString(),
          notes: notesText === "" ? null : notesText,
          rating: ratingValue === 0 ? null : ratingValue,
          drink: drinkText === "" ? null : drinkText,
        },
      }
      postVisit({ params, headers: { Authorization: `Bearer ${token}` } })
    }
  }

  return (
    <div className="flex flex-col md:w-2/3 lg:w-1/3 md:mx-auto items-center p-4">
      {isPendingPostVisit || isLoadingUser || isLoadingVenue ? (
        <Loader />
      ) : !user ? (
        unauthorized()
      ) : !venue ? (
        notFound()
      ) : (
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Record a visit</h1>
          {errorText && (
            <div className="bg-red-300 rounded p-4">{errorText}</div>
          )}
          <div className="text-xl">{venue.venue_name}</div>
          <RecordVisitForm
            notesText={notesText}
            setNotesText={setNotesText}
            ratingValue={ratingValue}
            setRatingValue={setRatingValue}
            drinkText={drinkText}
            setDrinkText={setDrinkText}
            performSubmit={submitVisit}
          />
        </div>
      )}
    </div>
  )
}

export default Page
