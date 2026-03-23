"use client"

import Link from "next/link"
import { useContext, useState } from "react"
import { UserContext } from "./context/user"

const TopBar = () => {
  const linkStyle = "hover:underline cursor-pointer"
  const { user, isLoadingUser, setToken } = useContext(UserContext)
  const onClickLogout = () => {
    setToken(undefined)
    localStorage.removeItem("token")
  }
  return (
    <div>
      <div className="flex flex-row p-4 bg-accent text-accentfg w-full items-center h-[60px]">
        <div className="flex-1 text-2xl font-bold">
          <Link className={linkStyle} href="/">
            Real Ale Trail tracker
          </Link>
        </div>
        {!isLoadingUser && (
          <div className="flex flex-row gap-4">
            <div className="hidden md:flex flex-row gap-4">
              <Link className={linkStyle} href="/">
                Map
              </Link>
              <Link className={linkStyle} href="/venues/list">
                Venues
              </Link>
              <Link className={linkStyle} href="/visits">
                Visits
              </Link>
              <Link className={linkStyle} href="/users">
                Users
              </Link>
            </div>
            {user ? (
              <>
                <div className={linkStyle} onClick={onClickLogout}>
                  Logout
                </div>
                <Link
                  className="hidden md:flex font-bold"
                  href={`/users/${user.user_id}`}
                >
                  {user.display_name}
                </Link>
              </>
            ) : (
              <Link className={linkStyle} href="/login">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TopBar
