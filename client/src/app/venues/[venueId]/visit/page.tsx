"use client"

import { useContext, useEffect, useState } from "react"
import { UserContext } from "@/app/context/user"
import { useRouter } from "next/navigation"
import { VenueContext } from "@/app/context/venue"
import { Rating } from "@smastrom/react-rating"

import { SubmitButton, TextAreaInput, TextInput } from "@/app/components/forms"
import { Loader } from "@/app/components/Loader"
import client from "@/app/api/client"
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query"
import { ClientContext } from "@/app/api/ReactQueryClientProvider"

interface RecordVisitFormProps {
  submitVisit: (notes: string, rating: number, drink: string) => Promise<void>
}

const RecordVisitForm = ({ submitVisit }: RecordVisitFormProps) => {
  const [notesText, setNotesText] = useState("")
  const [ratingValue, setRatingValue] = useState(0)
  const [drinkText, setDrinkText] = useState("")
  const performSubmitVisit = () => {
    submitVisit(notesText, ratingValue, drinkText)
  }
  return (
    <form action={performSubmitVisit} className="flex flex-col gap-4">
      <div>
        <div>Notes</div>
        <TextAreaInput
          value={notesText}
          setValue={setNotesText}
          maxLength={250}
        />
      </div>
      <div>
        <div>Rating</div>
        <Rating
          style={{ maxWidth: 250 }}
          value={ratingValue}
          onChange={setRatingValue}
        />
      </div>
      <div>
        <div>Drink</div>
        <TextInput
          value={drinkText}
          setValue={setDrinkText}
          type="text"
          maxLength={50}
        />
      </div>
      <SubmitButton label="Submit" />
    </form>
  )
}

const Page = () => {
  const { client } = useContext(ClientContext)
  const { token, user, isLoadingUser } = useContext(UserContext)
  const { venue, isLoadingVenue } = useContext(VenueContext)
  const router = useRouter()
  const [errorText, setErrorText] = useState("")

  const { mutate: postVisit, isPending: isPendingPostVisit } =
    client.useMutation("post", "/visit", {
      onSuccess: () => {
        router.push("/")
        return client.invalidateQueries("/venues", "/auth/me")
      },
      onError: (error) => {
        setErrorText(`Could not submit visit: ${error.detail}`)
      },
    })

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/")
    }
  }, [isLoadingUser, router, user])

  useEffect(() => {
    if (!isLoadingVenue && !venue) {
      router.push("/")
    }
  }, [isLoadingVenue, router, venue])

  const submitVisit = async (notes: string, rating: number, drink: string) => {
    if (venue && venue.venue_id) {
      const params = {
        query: {
          venue_id: venue.venue_id,
          visit_date: new Date(Date.now()).toISOString(),
          notes,
          rating,
          drink,
        },
      }
      postVisit({ params, headers: { Authorization: `Bearer ${token}` } })
    }
  }

  return !user || !venue ? (
    ""
  ) : (
    <div className="flex flex-col md:w-1/2 lg:w-1/3 md:mx-auto items-center p-4">
      {isPendingPostVisit ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Record a visit</h1>
          {errorText && (
            <div className="bg-red-300 rounded p-4">{errorText}</div>
          )}
          <div className="text-xl">{venue.venue_name}</div>
          <RecordVisitForm submitVisit={submitVisit} />
        </div>
      )}
    </div>
  )
}

export default Page
