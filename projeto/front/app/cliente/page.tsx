"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, CalendarPlus, CalendarCheck, User } from "lucide-react"
import Link from "next/link"

import { getToken, logout } from "@/lib/auth"

interface UsuarioMe {
  id: number
  nome: string
  email: string
  telefone: string | null
  tipo_usuario: string
}

interface ConsultaCompleta {
  id: number
  paciente_id: number
  paciente_nome: string
  paciente_email: string
  agenda_id: number
  data_disponivel: string
  horario_inicio: string
  profissional_id: number
  profissional_nome: string
  especialidade_nome: string
  status_consulta: "PENDENTE" | "CONFIRMADA" | "RECUSADA" | "CANCELADA" | "CONCLUIDA"
  observacoes: string | null
  created_at: string
  updated_at: string
}

export default function ClienteDashboard() {
  const [perfilPaciente, setPerfilPaciente] = useState<UsuarioMe | null>(null)
  const [consultas, setConsultas] = useState<ConsultaCompleta[]>([])

  useEffect(() => {
    async function carregarDados() {
      try {
        const token = getToken()

        if (!token) {
          logout()
          return
        }

        // Carrega perfil do paciente
        const responsePerfil = await fetch("http://localhost:3000/api/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (responsePerfil.status === 401) {
          logout()
          return
        }

        if (!responsePerfil.ok) {
          throw new Error("Erro ao carregar usuário")
        }

        const dadosPerfil = await responsePerfil.json()
        setPerfilPaciente(dadosPerfil)

        // Carrega consultas do paciente
        const responseConsultas = await fetch("http://localhost:3000/api/v1/consultas/minhas", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (responseConsultas.ok) {
          const dadosConsultas: ConsultaCompleta[] = await responseConsultas.json()
          setConsultas(dadosConsultas)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }

    carregarDados()
  }, [])

  const hoje = new Date().toISOString().split("T")[0]

  // Próxima consulta: a mais próxima futura com status ativo, ordenada por data asc
  const proximaConsulta = consultas
    .filter((c) => {
      const data = String(c.data_disponivel).split("T")[0]
      return (
        data >= hoje &&
        (c.status_consulta === "PENDENTE" || c.status_consulta === "CONFIRMADA")
      )
    })
    .sort((a, b) => {
      const dataA = String(a.data_disponivel).split("T")[0]
      const dataB = String(b.data_disponivel).split("T")[0]
      if (dataA !== dataB) return dataA.localeCompare(dataB)
      return a.horario_inicio.localeCompare(b.horario_inicio)
    })[0] ?? null

  // Consultas em andamento: futuras com status ativo
  const consultasAgendadas = consultas.filter((c) => {
    const data = String(c.data_disponivel).split("T")[0]
    return (
      data >= hoje &&
      (c.status_consulta === "PENDENTE" || c.status_consulta === "CONFIRMADA")
    )
  }).length

  // Consultas realizadas
  const consultasRealizadas = consultas.filter(
    (c) => c.status_consulta === "CONCLUIDA"
  ).length

  const formatarData = (dataRaw: string) => {
    const data = new Date(dataRaw)
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
  }

  const getStatusBadge = (status: ConsultaCompleta["status_consulta"]) => {
    switch (status) {
      case "CONFIRMADA":
        return <Badge className="bg-green-100 text-green-700">Confirmada</Badge>
      case "PENDENTE":
        return <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Saudação e Perfil */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Olá, {perfilPaciente?.nome?.split(" ")[0]}!
          </h1>

          <p className="mt-1 text-muted-foreground">
            Bem-vindo ao seu portal de saúde.
          </p>
        </div>

        <Link href="/cliente/perfil">
          <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {perfilPaciente?.nome
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="text-left">
              <p className="text-sm font-medium text-foreground">
                {perfilPaciente?.nome}
              </p>

              <p className="text-xs text-muted-foreground">
                {perfilPaciente?.email}
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
                <p className="text-sm text-muted-foreground">
                  {consultasAgendadas} em andamento
                </p>
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
          {proximaConsulta ? (
            <>
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {proximaConsulta.profissional_nome
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {proximaConsulta.profissional_nome}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {proximaConsulta.especialidade_nome}
                  </p>
                </div>

                {getStatusBadge(proximaConsulta.status_consulta)}
              </div>

              <div className="grid gap-2 rounded-lg bg-muted/50 p-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {formatarData(proximaConsulta.data_disponivel)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {proximaConsulta.horario_inicio}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Você não possui consultas agendadas.
            </p>
          )}

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
              <p className="text-2xl font-bold text-foreground">
                {consultasAgendadas}
              </p>
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
              <p className="text-2xl font-bold text-foreground">
                {consultasRealizadas}
              </p>
              <p className="text-sm text-muted-foreground">Consultas realizadas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}