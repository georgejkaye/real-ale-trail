"use client"
import { KeyboardEvent, useContext, useState } from "react"
import { SubmitButton, TextInput } from "../components/forms"
import { Loader } from "../components/Loader"
import Link from "next/link"
import client from "../api/client"
import { ClientContext } from "../api/ReactQueryClientProvider"

const Page = () => {
  const { client } = useContext(ClientContext)
  const [emailString, setEmailString] = useState("")
  const [displayNameString, setDisplayNameString] = useState("")
  const [passwordString, setPasswordString] = useState("")
  const [confirmPasswordString, setConfirmPasswordString] = useState("")
  const [errorString, setErrorString] = useState("")
  const [successString, setSuccessString] = useState("")

  const { mutate: mutateRequestToken } = client.useMutation(
    "post",
    "/auth/request-verify-token",
  )

  const { mutate: mutateRegister, isPending: isPendingRegister } =
    client.useMutation("post", "/auth/register", {
      onSuccess: (response) => {
        setSuccessString(`Verification email sent to ${response.email}!`)
        setErrorString("")
        setEmailString("")
        setPasswordString("")
        setConfirmPasswordString("")
        setDisplayNameString("")
        mutateRequestToken({ body: { email: response.email } })
      },
      onError: (error) => {
        setSuccessString("")
        setErrorString(`Registration failed: ${error.detail}`)
        setPasswordString("")
        setConfirmPasswordString("")
      },
    })

  const performRegister = async () => {
    if (passwordString !== confirmPasswordString) {
      setErrorString("Passwords do not match")
      setPasswordString("")
      setConfirmPasswordString("")
    } else {
      const body = {
        email: emailString,
        password: passwordString,
        display_name: displayNameString,
        is_active: true,
        is_superuser: false,
        is_verified: false,
      }
      mutateRegister({ body })
    }
  }
  const onSubmit = () => {
    performRegister()
  }
  const onKeyDownDisplayName = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      //performRegister()
    }
  }
  return (
    <div className="flex flex-col gap-4 md:w-1/2 lg:w-1/3 md:mx-auto p-4 items-center">
      {isPendingRegister ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-2xl font-bold">Register</h2>
          {errorString && (
            <div className="p-4 bg-red-300 rounded-lg">{errorString}</div>
          )}
          {successString && (
            <div className="p-4 bg-accent rounded-lg text-accentfg">
              {successString}
            </div>
          )}
          <form action={onSubmit} className="flex flex-col gap-4 w-full">
            <div>
              <div>Email</div>
              <div>
                <TextInput
                  type="email"
                  value={emailString}
                  setValue={setEmailString}
                />
              </div>
            </div>
            <div>
              <div>Password</div>
              <div>
                <TextInput
                  type="password"
                  value={passwordString}
                  setValue={setPasswordString}
                />
              </div>
            </div>
            <div>
              <div>Confirm password</div>
              <div>
                <TextInput
                  type="password"
                  value={confirmPasswordString}
                  setValue={setConfirmPasswordString}
                />
              </div>
            </div>
            <div>
              <div>Display name</div>
              <div>
                <TextInput
                  type="text"
                  value={displayNameString}
                  setValue={setDisplayNameString}
                  onKeyDown={onKeyDownDisplayName}
                />
              </div>
            </div>
            <SubmitButton
              label="Register"
              disabled={
                emailString === "" ||
                passwordString === "" ||
                confirmPasswordString === "" ||
                displayNameString === ""
              }
            />
          </form>
          <div className="flex flex-col lg:flex-row gap-2">
            <span>Already have an account?</span>
            <Link href="/login" className="font-bold text-blue-500 underline">
              Click here to login.
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
