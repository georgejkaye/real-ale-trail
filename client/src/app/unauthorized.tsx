import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 w-full md:4/5 lg:w-1/2 mx-auto p-4">
      <h2 className="text-3xl font-bold">Unauthorized...</h2>
      <p>
        You're not supposed to be here! If you think you are, try{" "}
        <Link href="/login" className="font-bold text-blue-500 underline">
          logging in
        </Link>
        .
      </p>
      <Link href="/" className="font-bold text-blue-500 underline">
        Home
      </Link>
    </div>
  )
}
