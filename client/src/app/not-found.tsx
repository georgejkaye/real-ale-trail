import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 w-full md:4/5 lg:w-1/2 mx-auto p-4">
      <h2 className="text-3xl font-bold">Not Found...</h2>
      <p>There's nothing here!</p>
      <Link href="/" className="font-bold text-blue-500 underline">
        Home
      </Link>
    </div>
  )
}
