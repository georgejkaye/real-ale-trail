"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Client, ClientPathsWithMethod } from "openapi-fetch"
import { createContext, useState } from "react"
import fetchClient from "./client"
import createClient, { OpenapiQueryClient } from "openapi-react-query"
import { paths } from "./api"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

const createInvalidateQueries =
  <FetchClient extends Client<any, any>>() =>
  (...queries: ReadonlyArray<ClientPathsWithMethod<FetchClient, "get">>) =>
    Promise.all(
      queries.map((query) =>
        queryClient.invalidateQueries({ queryKey: ["get", query] }),
      ),
    )

const client = {
  ...createClient(fetchClient),
  invalidateQueries: createInvalidateQueries<typeof fetchClient>(),
}

export const ClientContext = createContext({
  client,
})

export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ClientContext.Provider value={{ client }}>
        {children}
      </ClientContext.Provider>
    </QueryClientProvider>
  )
}
