"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, FileText, ChevronRight, Mail, Check, X } from "lucide-react"
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

// Ordena por data + horário crescente — as mais próximas primeiro (para atuais)
function ordenarPorDataAsc(lista: ConsultaCompleta[]): ConsultaCompleta[] {
  return [...lista].sort((a, b) => {
    const dataA = `${String(a.data_disponivel).split("T")[0]}T${a.horario_inicio}`
    const dataB = `${String(b.data_disponivel).split("T")[0]}T${b.horario_inicio}`
    return dataA.localeCompare(dataB)
  })
}

// Ordena por data + horário decrescente — as mais recentes primeiro (para passados)
function ordenarPorDataDesc(lista: ConsultaCompleta[]): ConsultaCompleta[] {
  return [...lista].sort((a, b) => {
    const dataA = `${String(a.data_disponivel).split("T")[0]}T${a.horario_inicio}`
    const dataB = `${String(b.data_disponivel).split("T")[0]}T${b.horario_inicio}`
    return dataB.localeCompare(dataA)
  })
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

  // Gera "hoje" no fuso local do navegador (evita o deslocamento UTC do toISOString)
  const agora = new Date()
  const hoje = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, "0")}-${String(agora.getDate()).padStart(2, "0")}`

  // --- Atuais: data >= hoje, excluindo canceladas e recusadas ---
  const pendentes = ordenarPorDataAsc(
    consultas.filter((c) => {
      const data = String(c.data_disponivel).split("T")[0]
      return data >= hoje && c.status_consulta === "PENDENTE"
    })
  )

  const confirmadas = ordenarPorDataAsc(
    consultas.filter((c) => {
      const data = String(c.data_disponivel).split("T")[0]
      return data >= hoje && c.status_consulta === "CONFIRMADA"
    })
  )

  const totalAtuais = pendentes.length + confirmadas.length

  // --- Passados: data < hoje OU canceladas/recusadas ---
  const concluidas = ordenarPorDataDesc(
    consultas.filter((c) => c.status_consulta === "CONCLUIDA")
  )

  const canceladas = ordenarPorDataDesc(
    consultas.filter((c) => {
      const data = String(c.data_disponivel).split("T")[0]
      return data < hoje || c.status_consulta === "CANCELADA"
    })
  )

  const recusadas = ordenarPorDataDesc(
    consultas.filter((c) => {
      const data = String(c.data_disponivel).split("T")[0]
      return data < hoje || c.status_consulta === "RECUSADA"
    })
  )

  const totalPassados = concluidas.length + canceladas.length + recusadas.length

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

  // Card reutilizável para todos os grupos
  function CardConsulta({ consulta }: { consulta: ConsultaCompleta }) {
    const opaca =
      consulta.status_consulta === "CANCELADA" || consulta.status_consulta === "RECUSADA"

    return (
      <Card
        className={`cursor-pointer transition-all hover:border-primary/50 ${opaca ? "opacity-60" : ""}`}
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
              {consulta.horario_inicio.slice(0, 5)}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  function SecaoVazia({ icone, titulo, descricao }: { icone: React.ReactNode; titulo: string; descricao: string }) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          {icone}
          <h3 className="mt-4 font-semibold text-foreground">{titulo}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>
        </CardContent>
      </Card>
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
          <TabsTrigger value="atuais">Atuais ({totalAtuais})</TabsTrigger>
          <TabsTrigger value="passados">Passados ({totalPassados})</TabsTrigger>
        </TabsList>

        {/* Atuais: Pendentes e Confirmadas, ordenadas por data crescente */}
        <TabsContent value="atuais" className="space-y-6">
          {totalAtuais === 0 ? (
            <SecaoVazia
              icone={<Calendar className="h-12 w-12 text-muted-foreground/50" />}
              titulo="Nenhum agendamento"
              descricao="Você não possui agendamentos futuros"
            />
          ) : (
            <>
              {pendentes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Pendentes ({pendentes.length})
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {pendentes.map((c) => <CardConsulta key={c.id} consulta={c} />)}
                  </div>
                </div>
              )}

              {confirmadas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Confirmadas ({confirmadas.length})
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {confirmadas.map((c) => <CardConsulta key={c.id} consulta={c} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Passados: Concluídas, Canceladas e Recusadas, ordenadas por data decrescente */}
        <TabsContent value="passados" className="space-y-6">
          {totalPassados === 0 ? (
            <SecaoVazia
              icone={<FileText className="h-12 w-12 text-muted-foreground/50" />}
              titulo="Nenhum histórico"
              descricao="Você ainda não realizou nenhum atendimento"
            />
          ) : (
            <>
              {concluidas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-blue-600" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Concluídas ({concluidas.length})
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {concluidas.map((c) => <CardConsulta key={c.id} consulta={c} />)}
                  </div>
                </div>
              )}

              {canceladas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-gray-500" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Canceladas ({canceladas.length})
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {canceladas.map((c) => <CardConsulta key={c.id} consulta={c} />)}
                  </div>
                </div>
              )}

              {recusadas.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    <h2 className="text-sm font-semibold text-foreground">
                      Recusadas ({recusadas.length})
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {recusadas.map((c) => <CardConsulta key={c.id} consulta={c} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes — sem alteração */}
      <Dialog open={!!selectedConsulta} onOpenChange={() => setSelectedConsulta(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              {selectedConsulta && formatarData(selectedConsulta.data_disponivel)} às {selectedConsulta?.horario_inicio.slice(0, 5)}
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