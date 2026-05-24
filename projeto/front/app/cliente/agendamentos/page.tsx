"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, User, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getToken, logout } from "@/lib/auth"
import { getInitials } from "@/lib/utils"
import { API_URL } from "@/lib/api"
import Link from "next/link"

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

export default function AgendamentosClientePage() {
  const [consultas, setConsultas] = useState<ConsultaCompleta[]>([])

  useEffect(() => {
    async function carregarConsultas() {
      try {
        const token = getToken()
        if (!token) { logout(); return }

        const response = await fetch(`${API_URL}/api/v1/consultas/minhas`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 401) { logout(); return }
        if (!response.ok) throw new Error("Erro ao carregar consultas")

        const data: ConsultaCompleta[] = await response.json()
        setConsultas(data)
      } catch (error) {
        console.error("Erro ao buscar consultas:", error)
      }
    }

    carregarConsultas()
  }, [])

  async function cancelarConsulta(id: number) {
    try {
      const token = getToken()
      const response = await fetch(`${API_URL}/api/v1/consultas/${id}/cancelar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error()
      setConsultas(prev =>
        prev.map(c => c.id === id ? { ...c, status_consulta: "CANCELADA" as const } : c)
      )
    } catch {
      console.error("Erro ao cancelar consulta")
    }
  }

  const hoje = new Date().toISOString().split("T")[0]

  const emAndamento = consultas.filter((c) => {
    const data = String(c.data_disponivel).split("T")[0]
    return data >= hoje && c.status_consulta === "CONFIRMADA"
  })

  const historico = consultas.filter((c) => {
    const data = String(c.data_disponivel).split("T")[0]
    return (
      data < hoje ||
      c.status_consulta === "CONCLUIDA" ||
      c.status_consulta === "CANCELADA" ||
      c.status_consulta === "RECUSADA"
    )
  })

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
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmada</Badge>
      case "PENDENTE":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pendente</Badge>
      case "CONCLUIDA":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Concluída</Badge>
      case "CANCELADA":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Cancelada</Badge>
      case "RECUSADA":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Recusada</Badge>
    }
  }

  const renderCard = (consulta: ConsultaCompleta) => (
    <Card
      key={consulta.id}
      className={`overflow-hidden ${
        consulta.status_consulta === "CANCELADA" || consulta.status_consulta === "RECUSADA"
          ? "opacity-60"
          : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {consulta.profissional_nome}
              </h3>
              <p className="text-sm text-muted-foreground">
                {consulta.especialidade_nome}
              </p>
            </div>
          </div>
          {getStatusBadge(consulta.status_consulta)}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatarData(consulta.data_disponivel)}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {consulta.horario_inicio}
          </div>
        </div>

        {consulta.observacoes && (
          <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
            {consulta.observacoes}
          </p>
        )}

        {consulta.status_consulta === "CONFIRMADA" && (
          <div className="mt-3 border-t border-border pt-3">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => cancelarConsulta(consulta.id)}
            >
              Cancelar consulta
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe suas consultas confirmadas e seu histórico
        </p>
      </div>

      <Tabs defaultValue="andamento" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="andamento" className="space-y-4">
          {emAndamento.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">
                  Nenhuma consulta confirmada
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Você não possui consultas confirmadas no momento
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/cliente/agendar">Agendar Consulta</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">{emAndamento.map(renderCard)}</div>
          )}
        </TabsContent>

        <TabsContent value="historico" className="space-y-4">
          {historico.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">Nenhum histórico</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Você ainda não possui consultas no histórico
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">{historico.map(renderCard)}</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}