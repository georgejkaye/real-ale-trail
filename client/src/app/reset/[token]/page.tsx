"use client"
import client from "@/app/api/client"
import { SubmitButton, TextInput } from "@/app/components/forms"
import { Loader } from "@/app/components/Loader"
import { use, useState, MouseEvent, KeyboardEvent } from "react"

const Page = ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = use(params)

  const [errorString, setErrorString] = useState("")
  const [successString, setSuccessString] = useState("")
  const [newPasswordString, setNewPasswordString] = useState("")
  const [confirmNewPasswordString, setConfirmNewPasswordString] = useState("")

  const { mutate: postResetPassword, isPending: isPendingReset } =
    client.useMutation("post", "/auth/reset-password")

  const performResetPassword = async () => {
    if (newPasswordString !== confirmNewPasswordString) {
      setErrorString("Passwords do not match.")
    } else {
      const resetPasswordResult = await resetPassword(token, newPasswordString)
      if (resetPasswordResult.error) {
        if (resetPasswordResult.error === "RESET_PASSWORD_BAD_TOKEN") {
          setErrorString("Password reset failed: invalid token")
        } else {
          setErrorString(`Password reset failed: ${resetPasswordResult.error}`)
        }
        setSuccessString("")
      } else {
        setSuccessString(
          "Password reset successful! You can now log in with your email and password.",
        )
        setErrorString("")
      }
      setNewPasswordString("")
      setConfirmNewPasswordString("")
    }
    setLoading(false)
  }

  const onClickResetPasswordButton = (e: MouseEvent<HTMLButtonElement>) => {
    performResetPassword()
  }

  const onKeyDownConfirmPasswordInput = (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      performResetPassword()
    }
  }

  return (
    <div className="md:w-1/2 lg:w-1/3 mx-auto flex flex-col items-center p-4">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col gap-4">
          <h2 className="font-bold text-2xl">Reset your password</h2>
          {errorString !== "" && (
            <div className="w-full bg-red-200 p-4 rounded">{errorString}</div>
          )}
          {successString !== "" && (
            <div className="w-full bg-green-200 p-4 rounded">
              {successString}
            </div>
          )}
          {!successString && (
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="password">New password</label>
                <TextInput
                  name="password"
                  type="password"
                  value={newPasswordString}
                  setValue={setNewPasswordString}
                />
              </div>
              <div>
                <label htmlFor="confirm-password">Confirm new password</label>
                <TextInput
                  name="confirm-password"
                  type="password"
                  value={confirmNewPasswordString}
                  setValue={setConfirmNewPasswordString}
                  onKeyDown={onKeyDownConfirmPasswordInput}
                />
              </div>
              <SubmitButton
                onClick={onClickResetPasswordButton}
                label="Reset password"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Page
