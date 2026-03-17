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
      <link
        rel="icon"
        type="image/png"
        href="/favicon-96x96.png"
        sizes="96x96"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <meta name="apple-mobile-web-app-title" content="RealAleTrail" />
      <link rel="manifest" href="/site.webmanifest" />
    </html>
  )
}
