"use client"
import { UserContext } from "@/app/context/user"
import { Loader } from "@/app/components/Loader"
import { useRouter } from "next/navigation"
import { useContext, MouseEvent, useEffect, useState } from "react"

const Page = () => {
  const { user, logOut } = useContext(UserContext)
  const router = useRouter()
  const [isLoggedOut, setLoggedOut] = useState(false)
  const onClickLogout = () => {
    logOut()
    setLoggedOut(true)
    setTimeout(() => router.push("/"), 1000)
  }
  useEffect(() => {
    if (user === undefined) {
      router.push("/")
    }
  }, [])
  return (
    <div className="flex flex-col md:w-1/2 lg:w-1/3 mx-auto p-4 gap-2 items-center">
      {isLoggedOut ? (
        <>
          <div className="w-full bg-accent text-accentfg rounded p-4">
            Successfully logged out, redirecting you to the home page...
          </div>
          <Loader />
        </>
      ) : !user ? (
        ""
      ) : (
        <div className="w-full flex flex-col gap-2">
          <h1 className="font-bold text-2xl">{user.display_name}</h1>
          <div>
            <button
              className="font-bold p-2 rounded bg-accent text-accentfg cursor-pointer hover:bg-accentlight"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
