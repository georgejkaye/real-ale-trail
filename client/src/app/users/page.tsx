"use client"

import { useContext } from "react"
import { ClientContext } from "../api/ReactQueryClientProvider"
import { Loader } from "../components/Loader"
import { UserCount } from "../api/client"
import { FaStar } from "react-icons/fa"
import Link from "next/link"

interface UserCardProps {
  user: UserCount
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-accent p-4 rounded-xl text-accentfg flex flex-col md:flex-col gap-4">
        <div className="flex flex-row items-center flex-1">
          <Link
            className="text-xl font-bold flex-1 hover:underline"
            href={`/users/${user.user_id}`}
          >
            {user.display_name}
          </Link>
          {user.favourite_venue && (
            <div className="flex flex-row gap-2 items-center">
              <FaStar />
              <Link
                className="hover:underline"
                href={`/venues/${user.favourite_venue_id}`}
              >
                {user.favourite_venue}
              </Link>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-4">
          <div>
            <span className="text-lg font-bold">{user.unique_visit_count}</span>{" "}
            venues
          </div>
          <div>
            <span className="text-lg font-bold">{user.visit_count}</span> visits
          </div>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  const { client } = useContext(ClientContext)
  const { data: users, isLoading: isLoadingUsers } = client.useQuery(
    "get",
    "/users",
  )

  return isLoadingUsers || !users ? (
    <Loader />
  ) : (
    <div className="w-full md:w-2/3 lg:w-1/2 p-4 flex flex-col gap-4 mx-auto">
      <h2 className="text-2xl font-bold">Users</h2>
      {users
        .sort((a, b) => b.unique_visit_count - a.unique_visit_count)
        .map((user) => (
          <UserCard key={user.user_id} user={user} />
        ))}
    </div>
  )
}

export default Page
