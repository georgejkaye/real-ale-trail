import { Rating } from "@smastrom/react-rating"
import { Dispatch, SetStateAction } from "react"
import { TextAreaInput, TextInput, SubmitButton } from "./forms"

interface RecordVisitFormProps {
  notesText: string
  setNotesText: Dispatch<SetStateAction<string>>
  ratingValue: number
  setRatingValue: Dispatch<SetStateAction<number>>
  drinkText: string
  setDrinkText: Dispatch<SetStateAction<string>>
  performSubmit: () => void
}

export const RecordVisitForm = ({
  notesText,
  setNotesText,
  ratingValue,
  setRatingValue,
  drinkText,
  setDrinkText,
  performSubmit,
}: RecordVisitFormProps) => {
  const performSubmitVisit = () => {
    performSubmit()
  }
  return (
    <form action={performSubmitVisit} className="flex flex-col gap-4">
      <div>
        <div>Notes</div>
        <TextAreaInput
          value={notesText}
          setValue={setNotesText}
          maxLength={250}
        />
      </div>
      <div>
        <div>Rating</div>
        <Rating
          style={{ maxWidth: 250 }}
          value={ratingValue}
          onChange={setRatingValue}
        />
      </div>
      <div>
        <div>Drink</div>
        <TextInput
          value={drinkText}
          setValue={setDrinkText}
          type="text"
          maxLength={50}
        />
      </div>
      <SubmitButton label="Submit" />
    </form>
  )
}

export default RecordVisitForm
