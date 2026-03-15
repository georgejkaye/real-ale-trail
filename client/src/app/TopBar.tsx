"use client"
import Link from "next/link"
import { useContext, useState } from "react"
import { UserContext } from "./context/user"

const TopBar = () => {
  const linkStyle = "hover:underline cursor-pointer"
  const { user, isLoadingUser, setToken } = useContext(UserContext)
  const [isMenuOpen, setMenuOpen] = useState(false)
  const onClickLogout = () => {
    setToken(undefined)
    localStorage.removeItem("token")
    setMenuOpen(false)
  }
  const onClickLink = () => {
    setMenuOpen(false)
  }
  return (
    <div>
      <div className="flex flex-row p-4 bg-accent text-accentfg w-full items-center h-[60px]">
        <div className="flex-1 text-2xl font-bold">
          <Link className={linkStyle} onClick={onClickLink} href="/">
            Real Ale Trail tracker
          </Link>
        </div>
        {!isLoadingUser && (
          <>
            <div className="hidden md:flex flex-row gap-4">
              <Link className={linkStyle} onClick={onClickLink} href="/">
                Map
              </Link>
              <Link
                className={linkStyle}
                onClick={onClickLink}
                href="/venues/list"
              >
                Venues
              </Link>
              {user ? (
                <>
                  <div className={linkStyle} onClick={onClickLogout}>
                    Logout
                  </div>
                  <Link
                    href={`/users/${user.user_id}`}
                    onClick={onClickLink}
                    className="font-bold"
                  >
                    {user.display_name}
                  </Link>
                </>
              ) : (
                <Link className={linkStyle} onClick={onClickLink} href="/login">
                  Login
                </Link>
              )}
            </div>
            <div
              onClick={() => setMenuOpen((isMenuOpen) => !isMenuOpen)}
              className="md:hidden cursor-pointer"
            >
              Menu
            </div>
          </>
        )}
      </div>
      {isMenuOpen && (
        <div className="absolute z-999 text-white top-[60px] left-0 bg-[#282e54] p-4 flex flex-col gap-3 items-end w-full">
          <Link className={linkStyle} onClick={onClickLink} href="/">
            Map
          </Link>
          <Link className={linkStyle} onClick={onClickLink} href="/venues/list">
            Venues
          </Link>
          {user ? (
            <>
              <button className={linkStyle} onClick={onClickLogout}>
                Logout
              </button>
              <Link
                href={`/users/${user.user_id}`}
                className="font-bold"
                onClick={onClickLink}
              >
                {user.display_name}
              </Link>
            </>
          ) : (
            <Link onClick={onClickLink} href="/login">
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default TopBar
