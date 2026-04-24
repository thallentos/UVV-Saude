import { ClientSidebar } from "@/components/client-sidebar"

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <ClientSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-6xl py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
