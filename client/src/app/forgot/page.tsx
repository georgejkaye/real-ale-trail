"use client"
import { useContext, useState } from "react"
import { SubmitButton, TextInput } from "../components/forms"
import Link from "next/link"
import { Loader } from "../components/Loader"
import { ClientContext } from "../api/ReactQueryClientProvider"

const Page = () => {
  const { client } = useContext(ClientContext)
  const [requestEmail, setRequestEmail] = useState("")
  const [emailString, setEmailString] = useState("")
  const [requestMade, setRequestMade] = useState(false)

  const { mutate: postForgotPassword, isPending: isPendingForgot } =
    client.useMutation("post", "/auth/forgot-password")

  const performResetPasswordRequest = async () => {
    postForgotPassword(
      { body: { email: emailString } },
      {
        onSuccess: () => {
          setRequestEmail(emailString)
          setRequestMade(true)
          setEmailString("")
        },
      },
    )
  }
  return (
    <div className="flex flex-col md:w-1/2 lg:w-1/3 md:mx-auto p-4 items-center">
      {isPendingForgot ? (
        <Loader />
      ) : (
        <form
          action={performResetPasswordRequest}
          className="w-full flex flex-col gap-4"
        >
          <>
            <h2 className="text-2xl font-bold">Reset your password</h2>
            {requestMade && (
              <div className="p-4 bg-accent text-accentfg rounded-lg">
                If it is on our systems, an email has been sent to{" "}
                <b>{requestEmail}</b> containing details on how to reset your
                password.
              </div>
            )}
            <label htmlFor="user">Email address</label>
            <TextInput
              name="user"
              type="email"
              value={emailString}
              setValue={setEmailString}
            />
            <SubmitButton
              label="Request password reset"
              disabled={emailString === ""}
            />
            <div className="flex flex-col md:flex-row gap-2">
              <span>Don&apos;t have an account?</span>
              <Link
                href="/register"
                className="font-bold text-blue-500 underline"
              >
                Click here to register.
              </Link>
            </div>
          </>
        </form>
      )}
    </div>
  )
}

export default Page
