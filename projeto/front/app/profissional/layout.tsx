import { ProfessionalSidebar } from "@/components/professional-sidebar"

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <ProfessionalSidebar />
      <main className="md:ml-64">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
