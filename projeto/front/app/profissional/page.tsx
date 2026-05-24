"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { CalendarDays, CalendarClock, ClipboardList, User, Clock, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { getToken, logout } from "@/lib/auth"
import { getInitials } from "@/lib/utils"
import { API_URL } from "@/lib/api"

interface UsuarioMe {
  id: number
  nome: string
  email: string
  telefone: string | null
  tipo_usuario: string
}

interface ConsultaCompleta {
  id: number
  paciente_nome: string
  horario_inicio: string
  status_consulta: "PENDENTE" | "CONFIRMADA" | "RECUSADA" | "CANCELADA" | "CONCLUIDA"
  data_disponivel: string
}

export default function AgendaProfissional() {
  const [perfilProfissional, setPerfilProfissional] = useState<UsuarioMe | null>(null)
  const [consultasHoje, setConsultasHoje] = useState<ConsultaCompleta[]>([])

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = getToken()

        if (!token) {
          logout()
          return
        }

        const response = await fetch(`${API_URL}/api/v1/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          logout()
          return
        }

        if (!response.ok) {
          throw new Error("Erro ao carregar usuário")
        }

        const data = await response.json()
        setPerfilProfissional(data)

        const responseConsultas = await fetch(`${API_URL}/api/v1/consultas/solicitacoes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (responseConsultas.ok) {
          const todasConsultas: ConsultaCompleta[] = await responseConsultas.json()

          const hoje = new Date().toISOString().split("T")[0]

          const deHoje = todasConsultas.filter((c) => {
            const dataConsulta = String(c.data_disponivel).split("T")[0]
            return dataConsulta === hoje
          })

          setConsultasHoje(deHoje)
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      }
    }

    carregarUsuario()
  }, [])

  const consultasConfirmadas = consultasHoje.filter(c => c.status_consulta === "CONFIRMADA").length
  const consultasPendentes   = consultasHoje.filter(c => c.status_consulta === "PENDENTE").length
  const solicitacoesPendentes = consultasPendentes

  return (
    <div className="flex flex-col gap-8">
      {/* Header com Perfil */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Olá, {perfilProfissional?.nome?.split(" ")[0]}!
          </h1>

          <p className="mt-1 text-muted-foreground">
            Bem-vindo ao seu portal profissional.
          </p>
        </div>

        <Link href="/profissional/perfil">
          <Card className="flex items-center gap-3 p-3 transition-colors hover:bg-accent/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {perfilProfissional?.nome ? getInitials(perfilProfissional.nome) : ""}
              </AvatarFallback>
            </Avatar>

            <div className="text-left">
              <p className="text-sm font-medium text-foreground">
                {perfilProfissional?.nome}
              </p>

              <p className="text-xs text-muted-foreground">
                {perfilProfissional?.email}
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
                <h3 className="font-semibold text-foreground">
                  Configurar Horários
                </h3>

                <p className="text-sm text-muted-foreground">
                  Disponibilidade mensal
                </p>
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
                <h3 className="font-semibold text-foreground">
                  Agendamentos
                </h3>

                <p className="text-sm text-muted-foreground">
                  Atuais e passados
                </p>
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
                  <h3 className="font-semibold text-foreground">
                    Solicitações
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Pendentes
                  </p>
                </div>

                {solicitacoesPendentes > 0 && (
                  <Badge className="bg-red-100 text-red-700">
                    {solicitacoesPendentes}
                  </Badge>
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
                <h3 className="font-semibold text-foreground">
                  Meu Perfil
                </h3>

                <p className="text-sm text-muted-foreground">
                  Dados pessoais
                </p>
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
              <p className="text-2xl font-bold text-foreground">
                {consultasConfirmadas}
              </p>

              <p className="text-sm text-muted-foreground">
                Confirmadas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>

            <div>
              <p className="text-2xl font-bold text-foreground">
                {consultasPendentes}
              </p>

              <p className="text-sm text-muted-foreground">
                Pendentes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CalendarDays className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="text-2xl font-bold text-foreground">
                {consultasHoje.length}
              </p>

              <p className="text-sm text-muted-foreground">
                Total hoje
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consultas do Dia */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Consultas de Hoje</CardTitle>

            <CardDescription>
              Seus atendimentos agendados para hoje
            </CardDescription>
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
            {consultasHoje.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nenhuma consulta para hoje.
              </p>
            ) : (
              consultasHoje.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-sm font-semibold text-primary">
                      {apt.horario_inicio}
                    </span>
                  </div>

                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {getInitials(apt.paciente_nome)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="font-medium text-foreground">
                      {apt.paciente_nome}
                    </span>
                  </div>

                  <Badge
                    className={
                      apt.status_consulta === "CONFIRMADA"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                    }
                  >
                    {apt.status_consulta === "CONFIRMADA" ? "Confirmada" : "Pendente"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}