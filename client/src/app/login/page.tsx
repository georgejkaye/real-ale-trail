"use client"
import { useContext, useEffect, useState } from "react"
import { Loader } from "../components/Loader"
import { UserContext } from "../context/user"
import Link from "next/link"
import { SubmitButton, TextInput } from "../components/forms"
import { useRouter } from "next/navigation"
import { ClientContext } from "../api/ReactQueryClientProvider"

interface LoginBoxProps {
  performLogin: (email: string, password: string) => Promise<void>
}

const LoginBox = ({ performLogin }: LoginBoxProps) => {
  const [emailString, setEmailString] = useState("")
  const [passwordString, setPasswordString] = useState("")
  const submitForm = async () => {
    await performLogin(emailString, passwordString)
    setPasswordString("")
  }
  return (
    <form action={submitForm} className="w-full flex flex-col gap-4">
      <div>
        <div>Email</div>
        <div>
          <TextInput
            name="user"
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
            name="password"
            type="password"
            value={passwordString}
            setValue={setPasswordString}
          />
        </div>
      </div>
      <SubmitButton
        label="Login"
        disabled={emailString === "" || passwordString === ""}
      />
    </form>
  )
}

const Page = () => {
  const { user, isLoadingUser, setToken } = useContext(UserContext)
  const { client } = useContext(ClientContext)
  const router = useRouter()
  const [errorString, setErrorString] = useState("")
  const [successString, setSuccessString] = useState("")
  const [freshLogin, setFreshLogin] = useState(false)

  const { mutate: postLogin, isPending: isPendingPostLogin } =
    client.useMutation("post", "/auth/jwt/login", {
      onSuccess: (response) => {
        setToken(response.access_token)
        setErrorString("")
        setFreshLogin(true)
        setSuccessString(
          "Login successful, redirecting you to the home page...",
        )
        setTimeout(() => router.push("/"), 1000)
      },
      onError: (error) => {
        if (error.detail === "LOGIN_BAD_CREDENTIALS") {
          setErrorString("Could not log in: invalid credentials")
        } else {
          setErrorString(`Could not log in: ${error.detail}`)
        }
      },
    })

  useEffect(() => {
    if (user && !freshLogin) {
      setSuccessString("Already logged in, redirecting you to the home page...")
      setTimeout(() => router.push("/"), 1000)
    }
  }, [user])

  const performLogin = async (email: string, password: string) => {
    const body = {
      grant_type: "password",
      username: email,
      password: password,
      scope: "",
      client_id: "",
      client_secret: "",
    }
    postLogin({
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
  }
  return (
    <div className="flex flex-col md:w-1/2 lg:w-1/3 md:mx-auto p-4 items-center">
      {(successString == "" && user) || isLoadingUser || isPendingPostLogin ? (
        <Loader />
      ) : successString !== "" ? (
        <>
          <div className="w-full p-4 bg-accent text-accentfg rounded">
            {successString}
          </div>
          <Loader />
        </>
      ) : (
        <div className="w-full flex flex-col gap-4">
          <>
            <h2 className="text-2xl font-bold">Login</h2>
            {errorString && (
              <div className="p-4 bg-red-300 rounded-lg">{errorString}</div>
            )}
            <LoginBox performLogin={performLogin} />
            <div className="flex flex-col md:flex-row gap-2">
              <Link
                href="/forgot"
                className="font-bold text-blue-500 underline"
              >
                Forgot your password?
              </Link>
            </div>
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
        </div>
      )}
    </div>
  )
}

export default Page
