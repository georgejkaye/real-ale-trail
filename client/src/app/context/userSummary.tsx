"use client"

import { createContext, PropsWithChildren, useContext } from "react"
import client, { UserSummary } from "../api/client"
import { ClientContext } from "../api/ReactQueryClientProvider"

export const UserSummaryContext = createContext({
  userSummary: undefined as UserSummary | undefined,
  isLoadingUserSummary: false,
  isError: false,
})

export const UserSummaryProvider = ({
  userId,
  children,
}: PropsWithChildren<{ userId: number }>) => {
  const { client } = useContext(ClientContext)
  const {
    data: userSummary,
    isLoading: isLoadingUserSummary,
    isError,
  } = client.useQuery("get", "/users/{user_id}", {
    params: { path: { user_id: userId } },
  })
  return (
    <UserSummaryContext.Provider
      value={{ userSummary, isLoadingUserSummary, isError }}
    >
      {children}
    </UserSummaryContext.Provider>
  )
}
