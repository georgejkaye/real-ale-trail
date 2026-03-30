"use client"

import { RiBeerLine } from "react-icons/ri"
import { useContext } from "react"
import { ClientContext } from "../api/ReactQueryClientProvider"
import { Loader } from "../components/Loader"
import { Visit, VisitCrawl } from "../api/client"
import Link from "next/link"
import { VisitCardCore } from "../components/VisitCard"

interface VisitFeedCardCrawlProps {
  crawl: VisitCrawl
}

const VisitFeedCardCrawl = ({ crawl }: VisitFeedCardCrawlProps) => {
  return (
    <div
      className="p-2 rounded-lg border-2"
      style={{
        borderColor: crawl.crawl_bg ?? "#ffffff",
        backgroundColor: crawl.crawl_fg ?? "#000000",
        color: crawl.crawl_bg ?? "#ffffff",
      }}
    >
      <Link className="hover:underline" href={`/crawl/${crawl.crawl_id}`}>
        {crawl.crawl_name}
      </Link>
    </div>
  )
}

interface VisitFeedCardProps {
  visit: Visit
}

const VisitFeedCard = ({ visit }: VisitFeedCardProps) => {
  return (
    <div className="p-4 bg-accent text-accentfg rounded-xl flex flex-col gap-3">
      <div className="flex flex-row items-center gap-2">
        <RiBeerLine size={25} />
        <Link
          className="text-lg hover:underline"
          href={`/users/${visit.user_id}`}
        >
          {visit.user_display_name}
        </Link>
      </div>
      <Link
        className="font-bold text-2xl hover:underline"
        href={`/venues/${visit.venue_id}`}
      >
        {visit.venue_name}
      </Link>
      <div className="flex flex-row flex-wrap gap-2">
        {visit.crawls.map((crawl) => (
          <VisitFeedCardCrawl key={crawl.crawl_id} crawl={crawl} />
        ))}
      </div>
      <VisitCardCore
        visitUserId={visit.user_id}
        review={visit}
        deleteVisit={() => {}}
      />
    </div>
  )
}

const Page = () => {
  const { client } = useContext(ClientContext)
  const { data: visits, isLoading: isLoadingVisits } = client.useQuery(
    "get",
    "/visits",
  )

  return isLoadingVisits ? (
    <Loader />
  ) : (
    <div className="w-full md:w-2/3 lg:w-1/2 mx-auto p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Visits</h2>
      <div className="flex flex-col gap-4">
        {visits
          ?.sort((a, b) => Date.parse(b.visit_date) - Date.parse(a.visit_date))
          .map((visit) => (
            <VisitFeedCard key={visit.visit_id} visit={visit} />
          ))}
      </div>
    </div>
  )
}

export default Page
