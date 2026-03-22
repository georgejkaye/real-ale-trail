"use client"

import { use, useContext, useEffect, useState } from "react"
import { UserContext } from "@/app/context/user"
import { notFound, unauthorized, useRouter } from "next/navigation"

import { Loader } from "@/app/components/Loader"
import { ClientContext } from "@/app/api/ReactQueryClientProvider"
import { RecordVisitForm } from "@/app/components/RecordVisitForm"

const Page = ({ params }: { params: Promise<{ visitId: string }> }) => {
  const router = useRouter()

  const { visitId } = use(params)

  const { client } = useContext(ClientContext)
  const { token, user, isLoadingUser } = useContext(UserContext)

  const [notesText, setNotesText] = useState("")
  const [ratingValue, setRatingValue] = useState(0)
  const [drinkText, setDrinkText] = useState("")
  const [errorText, setErrorText] = useState("")

  const { data: visit, isLoading: isLoadingVisit } = client.useQuery(
    "get",
    "/visit/{visit_id}",
    {
      params: { path: { visit_id: parseInt(visitId) } },
    },
  )

  const { mutate: patchVisit } = client.useMutation(
    "patch",
    "/visit/{visit_id}",
    {
      onSuccess: () => {
        router.push(!user ? "/" : `/users/${user.user_id}`)
        return client.invalidateQueries(
          "/users/{user_id}",
          "/venues",
          "/venues/{venue_id}",
          "/auth/me",
        )
      },
      onError: (error) => {
        setErrorText(`Could not submit visit: ${error.detail}`)
      },
    },
  )

  const submitVisit = async () => {
    const params = {
      path: {
        visit_id: parseInt(visitId),
      },
      query: {
        notes: notesText,
        rating: ratingValue,
        drink: drinkText,
      },
    }
    patchVisit({ params, headers: { Authorization: `Bearer ${token}` } })
  }

  useEffect(() => {
    setNotesText(visit?.notes ?? "")
    setRatingValue(visit?.rating ?? 0)
    setDrinkText(visit?.drink ?? "")
  }, [visit])

  return (
    <div className="flex flex-col md:w-1/2 lg:w-1/3 md:mx-auto items-center p-4">
      {isLoadingVisit || isLoadingUser ? (
        <Loader />
      ) : !visit ? (
        notFound()
      ) : user?.user_id !== visit.user_id ? (
        unauthorized()
      ) : (
        <div className="w-full flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Edit visit</h1>
          {errorText && (
            <div className="bg-red-300 rounded p-4">{errorText}</div>
          )}
          <div className="text-xl">{visit.venue_name}</div>
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
