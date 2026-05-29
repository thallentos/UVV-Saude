import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "UVV Saúde - Gestao de Saude Inteligente",
  description:
    "Plataforma completa para profissionais de saude e seus pacientes. Agenda, prontuario, faturamento e muito mais.",
  icons: {
    icon: "/logouvv.png",
    shortcut: "/logouvv.png",
    apple: "/logouvv.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#2a9d8f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}