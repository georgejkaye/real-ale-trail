import {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react"

interface TextInputProps {
  name?: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
  type: string
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  maxLength?: number
}

export const TextInput = ({
  name,
  value,
  setValue,
  type,
  onKeyDown,
  placeholder = "",
  maxLength,
}: TextInputProps) => {
  const inputStyle =
    "w-full text-lg p-2 rounded border-2 border-gray-400 bg-white"
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  return (
    <input
      name={name ? name : ""}
      type={type}
      className={inputStyle}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  )
}

interface TextAreaInputProps {
  name?: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  maxLength: number
}

export const TextAreaInput = ({
  name,
  value,
  setValue,
  onKeyDown,
  maxLength,
}: TextAreaInputProps) => {
  const inputStyle =
    "w-full text-lg p-2 rounded border-2 border-gray-400 bg-white"
  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }
  return (
    <textarea
      name={name ? name : ""}
      className={inputStyle}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      maxLength={maxLength}
    />
  )
}

const buttonStyle =
  "font-bold text-white p-2 rounded bg-accent cursor-pointer hover:bg-accentlight disabled:bg-accentdisabled disabled:cursor-not-allowed"

interface SubmitButtonProps {
  label: string
  disabled?: boolean
}

export const SubmitButton = ({
  label,
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <button type="submit" className={buttonStyle} disabled={disabled}>
      {label}
    </button>
  )
}

interface LinkButtonProps {
  label: string
  disabled?: boolean
  onClick: (e: React.MouseEvent) => void
}

export const LinkButton = ({
  label,
  onClick,
  disabled = false,
}: LinkButtonProps) => {
  return (
    <button
      type="button"
      className={buttonStyle}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
