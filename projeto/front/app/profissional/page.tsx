import Link from "next/link"
import { CalendarDays, CalendarClock, ClipboardList, User, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Dados do perfil do profissional
const perfilProfissional = {
  nome: "Dr. Rafael Mendes",
  idade: 35,
  sexo: "Masculino",
  especialidade: "Nutricionista",
}

// Consultas de hoje
const consultasHoje = [
  { time: "09:00", patient: "Ana Souza", type: "Primeira consulta", status: "confirmed" },
  { time: "10:00", patient: "Carlos Lima", type: "Retorno", status: "confirmed" },
  { time: "11:00", patient: "Beatriz Ferreira", type: "Avaliação", status: "pending" },
  { time: "14:00", patient: "João Mendes", type: "Retorno", status: "confirmed" },
  { time: "14:30", patient: "Maria Silva", type: "Retorno", status: "pending" },
  { time: "16:00", patient: "Pedro Alves", type: "Primeira consulta", status: "pending" },
]

// Estatísticas
const solicitacoesPendentes = 3
const consultasConfirmadas = 3
const consultasPendentes = 3

export default function AgendaProfissional() {
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header com Perfil */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Agenda
          </h1>
          <p className="mt-1 text-muted-foreground">
            Hoje, 14 de Abril de 2026
          </p>
        </div>
        <Link href="/profissional/perfil">
          <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {perfilProfissional.nome.split(" ").slice(0, 2).map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{perfilProfissional.nome}</p>
              <p className="text-xs text-muted-foreground">
                {perfilProfissional.idade} anos - {perfilProfissional.especialidade}
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/profissional/horarios" className="group">
          <Card className="h-full border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                <CalendarClock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Configurar Horários</h3>
                <p className="text-sm text-muted-foreground">Disponibilidade mensal</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profissional/agendamentos" className="group">
          <Card className="h-full border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Agendamentos</h3>
                <p className="text-sm text-muted-foreground">Atuais e passados</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profissional/solicitacoes" className="group">
          <Card className="h-full border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">Solicitações</h3>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                </div>
                {solicitacoesPendentes > 0 && (
                  <Badge className="bg-red-100 text-red-700">{solicitacoesPendentes}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/profissional/perfil" className="group">
          <Card className="h-full border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Meu Perfil</h3>
                <p className="text-sm text-muted-foreground">Dados pessoais</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Resumo do Dia */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Clock className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{consultasConfirmadas}</p>
              <p className="text-sm text-muted-foreground">Confirmadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{consultasPendentes}</p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{consultasHoje.length}</p>
              <p className="text-sm text-muted-foreground">Total hoje</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultas do Dia */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Consultas de Hoje</CardTitle>
            <CardDescription>Seus atendimentos agendados para hoje</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/profissional/agendamentos">
              Ver todos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {consultasHoje.map((apt) => (
              <div
                key={`${apt.time}-${apt.patient}`}
                className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
              >
                <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-primary/10">
                  <span className="text-sm font-semibold text-primary">{apt.time}</span>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {getInitials(apt.patient)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="font-medium text-foreground">{apt.patient}</span>
                  <span className="text-sm text-muted-foreground">{apt.type}</span>
                </div>
                <Badge className={
                  apt.status === "confirmed"
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                }>
                  {apt.status === "confirmed" ? "Confirmada" : "Pendente"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
