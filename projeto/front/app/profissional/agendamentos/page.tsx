"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, FileText, ChevronRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { getToken, logout } from "@/lib/auth"
import { getInitials } from "@/lib/utils"
import { API_URL } from "@/lib/api"

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

export default function AgendamentosProfissionalPage() {
  const [consultas, setConsultas] = useState<ConsultaCompleta[]>([])
  const [selectedConsulta, setSelectedConsulta] = useState<ConsultaCompleta | null>(null)

  useEffect(() => {
    async function carregarConsultas() {
      try {
        const token = getToken()

        if (!token) {
          logout()
          return
        }

        const response = await fetch(`${API_URL}/api/v1/consultas/solicitacoes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          logout()
          return
        }

        if (!response.ok) {
          throw new Error("Erro ao carregar consultas")
        }

        const data: ConsultaCompleta[] = await response.json()
        setConsultas(data)
      } catch (error) {
        console.error("Erro ao buscar consultas:", error)
      }
    }

    carregarConsultas()
  }, [])

  const hoje = new Date().toISOString().split("T")[0]

  const atuais = consultas.filter((c) => {
    const data = String(c.data_disponivel).split("T")[0]
    return data >= hoje && c.status_consulta !== "CANCELADA" && c.status_consulta !== "RECUSADA"
  })

  const passadas = consultas.filter((c) => {
    const data = String(c.data_disponivel).split("T")[0]
    return data < hoje || c.status_consulta === "CANCELADA" || c.status_consulta === "RECUSADA"
  })

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

  const formatarData = (dataRaw: string) => {
    const data = new Date(dataRaw)
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    })
  }

  const renderLista = (lista: ConsultaCompleta[], vazia: { icone: React.ReactNode; titulo: string; descricao: string }) => {
    if (lista.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            {vazia.icone}
            <h3 className="mt-4 font-semibold text-foreground">{vazia.titulo}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{vazia.descricao}</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="grid gap-4">
        {lista.map((consulta) => (
          <Card
            key={consulta.id}
            className={`cursor-pointer transition-all hover:border-primary/50 ${
              consulta.status_consulta === "CANCELADA" || consulta.status_consulta === "RECUSADA"
                ? "opacity-60"
                : ""
            }`}
            onClick={() => setSelectedConsulta(consulta)}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(consulta.paciente_nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {consulta.paciente_nome}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {consulta.especialidade_nome}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(consulta.status_consulta)}
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
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
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
        <p className="text-muted-foreground">
          Visualize seus agendamentos atuais e passados
        </p>
      </div>

      <Tabs defaultValue="atuais" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="atuais">Atuais</TabsTrigger>
          <TabsTrigger value="passados">Passados</TabsTrigger>
        </TabsList>

        <TabsContent value="atuais" className="space-y-4">
          {renderLista(atuais, {
            icone: <Calendar className="h-12 w-12 text-muted-foreground/50" />,
            titulo: "Nenhum agendamento",
            descricao: "Você não possui agendamentos futuros",
          })}
        </TabsContent>

        <TabsContent value="passados" className="space-y-4">
          {renderLista(passadas, {
            icone: <FileText className="h-12 w-12 text-muted-foreground/50" />,
            titulo: "Nenhum histórico",
            descricao: "Você ainda não realizou nenhum atendimento",
          })}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedConsulta} onOpenChange={() => setSelectedConsulta(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              {selectedConsulta && formatarData(selectedConsulta.data_disponivel)} às {selectedConsulta?.horario_inicio}
            </DialogDescription>
          </DialogHeader>

          {selectedConsulta && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(selectedConsulta.paciente_nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {selectedConsulta.paciente_nome}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConsulta.especialidade_nome}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(selectedConsulta.status_consulta)}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Contato</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {selectedConsulta.paciente_email}
                </div>
              </div>

              {selectedConsulta.observacoes && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Observações</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selectedConsulta.observacoes}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedConsulta(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}