import { Geist_Mono, Noto_Sans, Public_Sans } from "next/font/google"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NavShell } from "@/components/nav-shell"
import { cn } from "@/lib/utils"

const publicSansHeading = Public_Sans({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "July Anime Corner",
  description: "Personal anime tracking, independent of any third-party service.",
  robots: { index: false, follow: false },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Anime Corner",
  },
}

export const viewport: Viewport = {
  themeColor: "#09090b",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", notoSans.variable, publicSansHeading.variable)}
    >
      <body>
        <ThemeProvider>
          <NavShell>{children}</NavShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
