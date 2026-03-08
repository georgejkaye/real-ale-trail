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
}

export const TextInput = ({
  name,
  value,
  setValue,
  type,
  onKeyDown,
  placeholder = "",
}: TextInputProps) => {
  const inputStyle = "w-full text-lg p-2 rounded border-2 border-gray-400"
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
    />
  )
}

interface TextAreaInputProps {
  name?: string
  value: string
  setValue: Dispatch<SetStateAction<string>>
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void
}

export const TextAreaInput = ({
  name,
  value,
  setValue,
  onKeyDown,
}: TextAreaInputProps) => {
  const inputStyle = "w-full text-lg p-2 rounded border-2 border-gray-400"
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
    />
  )
}

interface SubmitButtonProps {
  label: string
  onClick: (e: MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

export const SubmitButton = ({
  label,
  onClick,
  disabled = false,
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className="font-bold text-white p-2 rounded bg-[#282e54] cursor-pointer hover:bg-[#404880] disabled:bg-[#8d93b8] disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
