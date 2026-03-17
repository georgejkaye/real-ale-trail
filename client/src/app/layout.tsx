import type { Metadata } from "next"
import "./globals.css"
import TopBar from "./TopBar"
import { UserProvider } from "./context/user"
import { VenuesProvider } from "./context/venues"
import "maplibre-gl/dist/maplibre-gl.css"
import "@smastrom/react-rating/style.css"
import { ReactQueryClientProvider } from "./api/ReactQueryClientProvider"

export const metadata: Metadata = {
  title: "Real Ale Trail Tracker",
  description: "Track visits to the Black Country Ales Real Ale Trail venues",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-back">
        <ReactQueryClientProvider>
          <UserProvider>
            <VenuesProvider>
              <div className="flex flex-col">
                <TopBar />
                {children}
              </div>
            </VenuesProvider>
          </UserProvider>
        </ReactQueryClientProvider>
      </body>
      <meta name="apple-mobile-web-app-title" content="RealAleTrail" />
    </html>
  )
}
