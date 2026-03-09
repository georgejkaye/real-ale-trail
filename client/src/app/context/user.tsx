"use client"

import {
  createContext,
  useState,
  PropsWithChildren,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react"
import client, { fetchClient, User } from "@/app/api/client"
import { type Middleware } from "openapi-fetch"

export const UserContext = createContext({
  token: undefined as string | undefined,
  user: undefined as User | undefined,
  setToken: (() => undefined) as Dispatch<SetStateAction<string | undefined>>,
  fetchUser: () => {},
  isLoadingUser: false,
})

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | undefined>(undefined)

  const authMiddleware: Middleware = {
    onRequest({ request }) {
      if (token) {
        request.headers.set("Authorization", `Bearer ${token}`)
      }
      return request
    },
  }

  fetchClient.use(authMiddleware)

  const {
    data,
    isLoading,
    refetch: fetchUser,
    isRefetching,
  } = client.useQuery("get", "/auth/me")

  useEffect(() => {
    if (!data) {
      localStorage.setItem("token", "")
    }
  }, [data])

  useEffect(() => {
    fetchUser()
  }, [token, fetchUser])

  useEffect(() => {
    setToken(localStorage.getItem("token") ?? undefined)
  }, [])

  return (
    <UserContext.Provider
      value={{
        token,
        user: data,
        fetchUser,
        setToken,
        isLoadingUser: isLoading || isRefetching,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
