"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { CalendarDays, CalendarClock, ClipboardList, User, Clock, ChevronRight, BellRing, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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

// Retorna a chave do sessionStorage exclusiva por profissional e por dia
function getChaveResumo(profissionalId: number): string {
  return `resumo_diario_visto_${profissionalId}`
}

export default function AgendaProfissional() {
  const [perfilProfissional, setPerfilProfissional] = useState<UsuarioMe | null>(null)
  const [consultasHoje, setConsultasHoje] = useState<ConsultaCompleta[]>([])
  const [modalResumoAberto, setModalResumoAberto] = useState(false)
  const [naoMostrarHoje, setNaoMostrarHoje] = useState(false)

  const agora = new Date()
  const hoje = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`

  function fecharModalSemGravar() {
    setModalResumoAberto(false)
    setNaoMostrarHoje(false)
  }

  function confirmarEntendido() {
    if (naoMostrarHoje && perfilProfissional) {
      sessionStorage.setItem(getChaveResumo(perfilProfissional.id), hoje)
    }
    setModalResumoAberto(false)
    setNaoMostrarHoje(false)
  }

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

        const data: UsuarioMe = await response.json()
        setPerfilProfissional(data)

        const responseConsultas = await fetch(`${API_URL}/api/v1/consultas/solicitacoes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (responseConsultas.ok) {
          const todasConsultas: ConsultaCompleta[] = await responseConsultas.json()

          const deHoje = todasConsultas.filter((c) => {
            const dataConsulta = String(c.data_disponivel).split("T")[0]
            const statusAtivo =
              c.status_consulta !== "RECUSADA" && c.status_consulta !== "CANCELADA"
            return dataConsulta === hoje && statusAtivo
          })

          setConsultasHoje(deHoje)

          const pendentes = todasConsultas.filter(c => c.status_consulta === "PENDENTE")
          const confirmadasHoje = deHoje.filter(c => c.status_consulta === "CONFIRMADA")

          if (pendentes.length > 0 || confirmadasHoje.length > 0) {
            // Chave exclusiva por profissional — evita que o "Entendido" de um
            // profissional suprima o modal de outro na mesma aba/navegador
            const chave = getChaveResumo(data.id)
            const valorSalvo = sessionStorage.getItem(chave)
            if (valorSalvo !== hoje) {
              setModalResumoAberto(true)
            }
          }
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

  const todasPendentes = consultasHoje.filter(c => c.status_consulta === "PENDENTE")
  const todasConfirmadasHoje = consultasHoje.filter(c => c.status_consulta === "CONFIRMADA")

  return (
    <div className="flex flex-col gap-8">

      {/* Modal de Resumo Diário */}
      <Dialog open={modalResumoAberto} onOpenChange={(aberto) => { if (!aberto) fecharModalSemGravar() }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <BellRing className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Resumo do dia</DialogTitle>
                <DialogDescription>
                  {new Date().toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">

            {/* Solicitações pendentes */}
            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">
                  {todasPendentes.length === 0
                    ? "Nenhuma solicitação pendente"
                    : `${todasPendentes.length} solicitação${todasPendentes.length > 1 ? "ões" : ""} pendente${todasPendentes.length > 1 ? "s" : ""}`}
                </p>
                <p className="mt-0.5 text-sm text-yellow-700">
                  {todasPendentes.length === 0
                    ? "Você está em dia com as solicitações."
                    : "Acesse Solicitações para aprovar ou recusar."}
                </p>
              </div>
            </div>

            {/* Consultas confirmadas de hoje */}
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">
                  {todasConfirmadasHoje.length === 0
                    ? "Nenhuma consulta confirmada hoje"
                    : `${todasConfirmadasHoje.length} consulta${todasConfirmadasHoje.length > 1 ? "s" : ""} confirmada${todasConfirmadasHoje.length > 1 ? "s" : ""} hoje`}
                </p>
                {todasConfirmadasHoje.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {todasConfirmadasHoje.map(c => (
                      <li key={c.id} className="flex items-center gap-2 text-sm text-green-700">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {c.horario_inicio.slice(0, 5)} — {c.paciente_nome}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>

          {/* Rodapé do modal */}
          <div className="flex flex-col gap-3 pt-1">
            <label className="flex cursor-pointer items-center gap-2 self-start">
              <input
                type="checkbox"
                checked={naoMostrarHoje}
                onChange={(e) => setNaoMostrarHoje(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-primary"
              />
              <span className="text-sm text-muted-foreground">
                Não mostrar mais hoje
              </span>
            </label>

            <div className="flex gap-2">
              {todasPendentes.length > 0 && (
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/profissional/solicitacoes" onClick={fecharModalSemGravar}>
                    Ver solicitações
                  </Link>
                </Button>
              )}
              <Button className="flex-1" onClick={confirmarEntendido}>
                Entendido
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>

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
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Resumo de Hoje</h2>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

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
                      {apt.horario_inicio.slice(0, 5)}
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