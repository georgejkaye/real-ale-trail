"use client"
import client from "@/app/api/client"
import { Loader } from "@/app/components/Loader"
import { use, useEffect, useState } from "react"

const Page = ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = use(params)

  const [errorString, setErrorString] = useState("")
  const [successString, setSuccessString] = useState("")

  const { mutate: postVerify, isPending: isPendingVerify } = client.useMutation(
    "post",
    "/auth/verify",
    {
      onSuccess: () => {
        setSuccessString(
          "Verification successful! You can now log in with your email and password.",
        )
      },
      onError: (error) => {
        setErrorString(`Verification failed: ${error.detail}`)
      },
    },
  )

  useEffect(() => {
    postVerify({ body: { token } })
  }, [postVerify, token])

  return (
    <div className="md:w-1/2 lg:w-1/3 mx-auto flex flex-col items-center p-4">
      {isPendingVerify ? (
        <Loader />
      ) : errorString !== "" ? (
        <div className="w-full bg-red-200 p-4 rounded">{errorString}</div>
      ) : (
        <div className="w-full bg-green-200 p-4 rounded">{successString}</div>
      )}
    </div>
  )
}

export default Page
