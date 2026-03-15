"use client"
import { UserSummaryContext } from "@/app/context/userSummary"
import { Loader } from "@/app/components/Loader"
import { Rating } from "@smastrom/react-rating"
import Link from "next/link"
import { useContext } from "react"
import { SingleUserVisit } from "@/app/api/client"
import { notFound } from "next/navigation"

interface UserSummaryVisitCardProps {
  visit: SingleUserVisit
}

const UserSummaryVisitCard = ({ visit }: UserSummaryVisitCardProps) => {
  const visitDate = visit.visit_date
    ? new Date(Date.parse(visit.visit_date))
    : undefined
  return (
    <div className="rounded-xl bg-accenthover text-accentfg p-4 flex flex-col gap-2">
      <Link
        href={`/venues/${visit.venue_id}`}
        className="font-bold text-xl hover:underline"
      >
        {visit.venue_name}
      </Link>
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
          <span className="font-bold">Drink:</span> {visit.drink}
        </div>
      )}
      {visit.notes && visit.notes !== "" && (
        <div>&apos;{visit.notes}&apos;</div>
      )}
      <Rating style={{ maxWidth: 100 }} value={visit.rating ?? 0} readOnly />
    </div>
  )
}

const Page = () => {
  const { userSummary, isLoadingUserSummary, isError } =
    useContext(UserSummaryContext)
  return (
    <div className="md:w-1/3 flex flex-col items-center md:mx-auto p-4">
      {isLoadingUserSummary ? (
        <Loader />
      ) : !userSummary || isError ? (
        notFound()
      ) : (
        <div className="w-full flex flex-col gap-4">
          <h2 className="font-bold text-2xl">{userSummary.display_name}</h2>
          <div>
            {userSummary.visits.length}{" "}
            {userSummary.visits.length === 1 ? "venue" : "venues"} visited
          </div>
          <div className="flex flex-col gap-4">
            {userSummary.visits
              .sort((a, b) =>
                a.visit_date == null || b.visit_date == null
                  ? 0
                  : Date.parse(b.visit_date) - Date.parse(a.visit_date),
              )
              .map((visit) => (
                <UserSummaryVisitCard key={visit.visit_id} visit={visit} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
