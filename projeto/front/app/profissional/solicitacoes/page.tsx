"use client"

import { getToken, logout } from "@/lib/auth"
import { getInitials } from "@/lib/utils"
import { API_URL } from "@/lib/api"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Check, X, Search, Mail, Loader2, FileText } from "lucide-react"

interface Consulta {
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
  status_consulta: string
  observacoes: string | null
  created_at: string
  updated_at: string
}

function formatarData(dataStr: string): string {
  const d = dataStr.split("T")[0] ?? dataStr
  const [ano, mes, dia] = d.split("-")
  return `${dia}/${mes}/${ano}`
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDENTE":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pendente</Badge>
    case "CONFIRMADA":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmada</Badge>
    case "RECUSADA":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Recusada</Badge>
    case "CANCELADA":
      return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Cancelada</Badge>
    case "CONCLUIDA":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Concluída</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function SolicitacoesPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [selecionada, setSelecionada] = useState<Consulta | null>(null)
  const [dialogDetalhes, setDialogDetalhes] = useState(false)
  const [dialogAprovar, setDialogAprovar] = useState(false)
  const [dialogRecusar, setDialogRecusar] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState("")

  const carregarSolicitacoes = useCallback(async () => {
    setCarregando(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/consultas/solicitacoes`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error()
      const data: Consulta[] = await res.json()
      setConsultas(data)
    } catch {
      setErro("Não foi possível carregar as solicitações.")
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarSolicitacoes()
  }, [carregarSolicitacoes])

  async function aprovar() {
    if (!selecionada) return
    setProcessando(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/consultas/${selecionada.id}/aprovar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Erro ao aprovar.")
      setConsultas(prev =>
        prev.map(c => c.id === selecionada.id ? { ...c, status_consulta: "CONFIRMADA" } : c)
      )
      setDialogAprovar(false)
      setDialogDetalhes(false)
      setSelecionada(null)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao aprovar consulta.")
      setDialogAprovar(false)
    } finally {
      setProcessando(false)
    }
  }

  async function recusar() {
    if (!selecionada) return
    setProcessando(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/consultas/${selecionada.id}/recusar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Erro ao recusar.")
      setConsultas(prev =>
        prev.map(c => c.id === selecionada.id ? { ...c, status_consulta: "RECUSADA" } : c)
      )
      setDialogRecusar(false)
      setDialogDetalhes(false)
      setSelecionada(null)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao recusar consulta.")
      setDialogRecusar(false)
    } finally {
      setProcessando(false)
    }
  }

  const pendentes = consultas.filter(c =>
    c.status_consulta === "PENDENTE" &&
    c.paciente_nome.toLowerCase().includes(busca.toLowerCase())
  )

  const processadas = consultas.filter(c =>
    c.status_consulta !== "PENDENTE" &&
    c.paciente_nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Solicitações de Agendamento</h1>
        <p className="text-muted-foreground">
          Gerencie as solicitações de consulta dos seus pacientes
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {consultas.filter(c => c.status_consulta === "PENDENTE").length}
              </p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <Check className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {consultas.filter(c => c.status_consulta === "CONFIRMADA").length}
              </p>
              <p className="text-sm text-muted-foreground">Confirmadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <X className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {consultas.filter(c => c.status_consulta === "RECUSADA").length}
              </p>
              <p className="text-sm text-muted-foreground">Recusadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {erro && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {erro}
        </div>
      )}

      {/* Busca e Tabs */}
      <div className="space-y-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar paciente..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="pendentes">
          <TabsList>
            <TabsTrigger value="pendentes">
              Pendentes ({pendentes.length})
            </TabsTrigger>
            <TabsTrigger value="processadas">
              Processadas ({processadas.length})
            </TabsTrigger>
          </TabsList>

          {/* Pendentes */}
          <TabsContent value="pendentes" className="mt-4 space-y-3">
            {carregando ? (
              <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendentes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-3 font-medium text-foreground">Nenhuma solicitação pendente</p>
                  <p className="text-sm text-muted-foreground">Você está em dia!</p>
                </CardContent>
              </Card>
            ) : (
              pendentes.map(consulta => (
                <Card key={consulta.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(consulta.paciente_nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{consulta.paciente_nome}</h3>
                            {getStatusBadge(consulta.status_consulta)}
                          </div>
                          {consulta.observacoes && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                              {consulta.observacoes}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatarData(consulta.data_disponivel)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {consulta.horario_inicio.slice(0, 5)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setSelecionada(consulta); setDialogDetalhes(true) }}
                        >
                          Ver detalhes
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white gap-1"
                          onClick={() => { setSelecionada(consulta); setDialogAprovar(true) }}
                        >
                          <Check className="h-4 w-4" />
                          Aprovar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 gap-1"
                          onClick={() => { setSelecionada(consulta); setDialogRecusar(true) }}
                        >
                          <X className="h-4 w-4" />
                          Recusar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Processadas */}
          <TabsContent value="processadas" className="mt-4 space-y-3">
            {processadas.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-3 font-medium text-foreground">Nenhuma consulta processada ainda</p>
                </CardContent>
              </Card>
            ) : (
              processadas.map(consulta => (
                <Card
                  key={consulta.id}
                  className={
                    consulta.status_consulta === "RECUSADA" ||
                    consulta.status_consulta === "CANCELADA"
                      ? "opacity-60"
                      : ""
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(consulta.paciente_nome)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{consulta.paciente_nome}</h3>
                            {getStatusBadge(consulta.status_consulta)}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatarData(consulta.data_disponivel)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {consulta.horario_inicio.slice(0, 5)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setSelecionada(consulta); setDialogDetalhes(true) }}
                      >
                        Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog Detalhes */}
      <Dialog open={dialogDetalhes} onOpenChange={setDialogDetalhes}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              {selecionada && `${formatarData(selecionada.data_disponivel)} às ${selecionada.horario_inicio.slice(0, 5)}`}
            </DialogDescription>
          </DialogHeader>
          {selecionada && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(selecionada.paciente_nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{selecionada.paciente_nome}</p>
                  {getStatusBadge(selecionada.status_consulta)}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {selecionada.paciente_email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatarData(selecionada.data_disponivel)}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {selecionada.horario_inicio.slice(0, 5)}
                </div>
              </div>
              {selecionada.observacoes && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Observações</p>
                  <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                    {selecionada.observacoes}
                  </p>
                </div>
              )}
              {selecionada.status_consulta === "PENDENTE" && (
                <DialogFooter className="gap-2">
                  <Button
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => { setDialogDetalhes(false); setDialogRecusar(true) }}
                  >
                    <X className="mr-1 h-4 w-4" />
                    Recusar
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => { setDialogDetalhes(false); setDialogAprovar(true) }}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Aprovar
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Aprovar */}
      <Dialog open={dialogAprovar} onOpenChange={setDialogAprovar}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar aprovação</DialogTitle>
            <DialogDescription>
              Deseja aprovar a consulta de {selecionada?.paciente_nome}?
            </DialogDescription>
          </DialogHeader>
          {selecionada && (
            <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1">
              <p><span className="text-muted-foreground">Data:</span> <span className="font-medium">{formatarData(selecionada.data_disponivel)}</span></p>
              <p><span className="text-muted-foreground">Horário:</span> <span className="font-medium">{selecionada.horario_inicio.slice(0, 5)}</span></p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAprovar(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={processando}
              onClick={aprovar}
            >
              {processando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar aprovação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Recusar */}
      <Dialog open={dialogRecusar} onOpenChange={setDialogRecusar}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Recusar solicitação</DialogTitle>
            <DialogDescription>
              Deseja recusar a consulta de {selecionada?.paciente_nome}?
              O horário voltará a ficar disponível.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogRecusar(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              disabled={processando}
              onClick={recusar}
            >
              {processando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar recusa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}