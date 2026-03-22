import { Rating } from "@smastrom/react-rating"
import Link from "next/link"
import { useContext } from "react"
import { ClientContext } from "../api/ReactQueryClientProvider"
import { UserContext } from "../context/user"
import { Loader } from "./Loader"

interface VisitCardTitleProps {
  text: string
  href?: string
}

const VisitCardTitle = ({ text, href }: VisitCardTitleProps) => {
  return (
    <div className="font-bold text-xl">
      {href ? (
        <Link href={href} className="font-bold text-xl hover:underline">
          {text}
        </Link>
      ) : (
        <div>{text}</div>
      )}
    </div>
  )
}

interface Review {
  visit_id: number
  visit_date: string
  notes: string | null
  rating: number | null
  drink: string | null
}

interface VisitCardCoreProps {
  visitUserId: number
  review: Review
  deleteVisit: () => void
}

const VisitCardCore = ({
  visitUserId,
  review,
  deleteVisit,
}: VisitCardCoreProps) => {
  const { user } = useContext(UserContext)

  const visitDate = new Date(Date.parse(review.visit_date))
  const isCurrentUser = user?.user_id == visitUserId

  return (
    <div className="flex flex-col gap-2">
      {visitDate && (
        <div className="">
          {visitDate.toLocaleDateString()}{" "}
          {visitDate.toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
      {review.drink && review.drink !== "" && (
        <div>
          <span className="font-bold">Drink:</span> {review.drink}
        </div>
      )}
      {review.notes && review.notes !== "" && (
        <div>&apos;{review.notes}&apos;</div>
      )}
      {review.rating !== null && (
        <Rating style={{ maxWidth: 100 }} value={review.rating} readOnly />
      )}
      {isCurrentUser && (
        <div className="flex flex-row gap-4">
          <Link
            href={`/users/${user?.user_id}/visits/${review.visit_id}/edit`}
            className="font-bold hover:underline"
          >
            Edit
          </Link>
          <div
            className="font-bold hover:underline cursor-pointer"
            onClick={deleteVisit}
          >
            Delete
          </div>
        </div>
      )}
    </div>
  )
}

interface VisitCardProps {
  visitUserId: number
  title: string
  titleHref?: string
  review: Review
}

const VisitCard = ({
  review,
  visitUserId,
  title,
  titleHref,
}: VisitCardProps) => {
  const { client } = useContext(ClientContext)
  const { token } = useContext(UserContext)

  const { mutate: deleteVisit, isPending: isPendingDeleteVisit } =
    client.useMutation("delete", "/visit/{visit_id}", {
      onSuccess: () => {
        return client.invalidateQueries(
          "/venues",
          "/visits",
          "/auth/me",
          "/users/{user_id}",
          "/users",
          "/venues/{venue_id}",
        )
      },
    })

  const performDeleteVisit = () => {
    deleteVisit({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        path: {
          visit_id: review.visit_id,
        },
      },
    })
  }

  return isPendingDeleteVisit ? (
    <Loader />
  ) : (
    <div className="rounded-xl bg-accentlight text-accentfg p-4 flex flex-col gap-2">
      <VisitCardTitle text={title} href={titleHref} />
      <VisitCardCore
        visitUserId={visitUserId}
        review={review}
        deleteVisit={performDeleteVisit}
      />
    </div>
  )
}

export default VisitCard
