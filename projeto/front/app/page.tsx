import Link from "next/link"
import Image from "next/image"
import { ArrowRight, UserPlus, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <img
              src="/logouvv.png"
              alt="UVV Saúde"
              className="h-auto w-auto max-h-10 max-w-[50px] object-contain"
            />
            <span className="text-lg font-bold text-foreground">UVV Saúde</span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </Button>

            <Button asChild>
              <Link href="/cadastro">
                <UserPlus className="mr-2 h-4 w-4" />
                Cadastrar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
          <Image
            src="/logouvv.png"
            alt="UVV Saúde"
            width={100}
            height={100}
            className="h-auto w-auto max-h-28 max-w-[220px] object-contain"
            priority

            
          />

          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Sua saúde em primeiro lugar
            </h1>

            <p className="mx-auto max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
              Plataforma inteligente para gestão de saúde. Conectando profissionais
              e pacientes de forma simples e eficiente.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2">
              <Link href="/cadastro">
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                Já tenho conta
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="mt-12 grid w-full gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 text-left">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Agendamento Fácil</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Agende consultas com nutricionistas e psicólogos em poucos cliques.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-left">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Gestão de Horários</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Profissionais podem configurar sua disponibilidade mensal.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 text-left">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Histórico Completo</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Acompanhe todo o histórico de suas consultas em um só lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <p className="text-center text-sm text-muted-foreground">
          UVV Saúde &copy; 2026 - Todos os direitos reservados
        </p>
      </footer>
    </main>
  )
}