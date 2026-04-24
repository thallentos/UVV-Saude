import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ArrowRight, CalendarPlus, CalendarCheck, User } from "lucide-react"
import Link from "next/link"

// Dados do perfil do paciente
const perfilPaciente = {
  nome: "Maria Oliveira",
  idade: 28,
  sexo: "Feminino",
}

const proximaConsulta = {
  profissional: "Dra. Ana Costa",
  especialidade: "Nutricionista",
  data: "15 de Abril, 2026",
  horario: "14:00",
  local: "Sala 205 - Bloco B",
  avatar: "/placeholder-user.jpg",
}

const consultasAgendadas = 2
const consultasRealizadas = 8

export default function ClienteDashboard() {
  return (
    <div className="space-y-8">
      {/* Saudação e Perfil */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Olá, {perfilPaciente.nome.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Bem-vinda ao seu portal de saúde.
          </p>
        </div>
        <Link href="/cliente/perfil">
          <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {perfilPaciente.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{perfilPaciente.nome}</p>
              <p className="text-xs text-muted-foreground">
                {perfilPaciente.idade} anos - {perfilPaciente.sexo}
              </p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/cliente/agendar" className="group">
          <Card className="h-full border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                <CalendarPlus className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Criar Consulta</h3>
                <p className="text-sm text-muted-foreground">Agendar novo atendimento</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/cliente/agendamentos" className="group">
          <Card className="h-full border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <CalendarCheck className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Agendamentos</h3>
                <p className="text-sm text-muted-foreground">{consultasAgendadas} em andamento</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/cliente/perfil" className="group">
          <Card className="h-full border-2 border-transparent transition-all hover:border-primary hover:shadow-md">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <User className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Meu Perfil</h3>
                <p className="text-sm text-muted-foreground">Dados pessoais</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Próxima Consulta */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Próxima Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={proximaConsulta.avatar} alt={proximaConsulta.profissional} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">AC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{proximaConsulta.profissional}</h3>
              <p className="text-sm text-muted-foreground">{proximaConsulta.especialidade}</p>
            </div>
            <Badge className="bg-green-100 text-green-700">Confirmada</Badge>
          </div>
          <div className="grid gap-2 rounded-lg bg-muted/50 p-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{proximaConsulta.data}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{proximaConsulta.horario}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{proximaConsulta.local}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/cliente/agendamentos">
              Ver todos os agendamentos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CalendarCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{consultasAgendadas}</p>
              <p className="text-sm text-muted-foreground">Consultas em andamento</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{consultasRealizadas}</p>
              <p className="text-sm text-muted-foreground">Consultas realizadas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
