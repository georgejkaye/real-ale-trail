"use client"

import {
  createContext,
  useState,
  PropsWithChildren,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react"
import client, { User } from "@/app/api/client"

export const UserContext = createContext({
  token: undefined as string | undefined,
  user: undefined as User | undefined,
  isRetrievingFromStorage: false,
  setToken: (() => undefined) as Dispatch<SetStateAction<string | undefined>>,
  logOut: () => {},
  fetchUser: () => {},
  isLoadingUser: false,
})

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | undefined>(undefined)
  const [isRetrievingFromStorage, setRetrievingFromStorage] = useState(true)
  const hasToken = token !== undefined && token !== null && token !== ""

  const {
    data,
    isLoading,
    refetch: fetchUser,
    isRefetching,
  } = client.useQuery(
    "get",
    "/auth/me",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
    { refetchOnMount: false, enabled: hasToken, retry: false },
  )

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token)
    }
  }, [token])

  useEffect(() => {
    setToken(localStorage.getItem("token") ?? undefined)
    setRetrievingFromStorage(false)
  }, [])

  return (
    <UserContext.Provider
      value={{
        token,
        user: token ? data : undefined,
        fetchUser,
        setToken,
        isLoadingUser: isLoading || isRefetching,
        isRetrievingFromStorage,
        logOut: () => setToken(undefined),
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
