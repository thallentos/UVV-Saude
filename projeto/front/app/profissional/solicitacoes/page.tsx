"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Calendar, Clock, Check, X, Search, User, Phone, Mail, FileText } from "lucide-react"

const solicitacoesPendentes = [
  {
    id: 1,
    paciente: "João Silva",
    email: "joao.silva@email.com",
    telefone: "(27) 99888-7766",
    dataDesejada: "16 de Abril, 2026",
    horarioDesejado: "09:00",
    motivo: "Primeira consulta - Avaliação nutricional completa",
    dataSolicitacao: "12 de Abril, 2026",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    paciente: "Ana Beatriz Costa",
    email: "ana.costa@email.com",
    telefone: "(27) 99777-5544",
    dataDesejada: "17 de Abril, 2026",
    horarioDesejado: "14:00",
    motivo: "Retorno - Acompanhamento de dieta",
    dataSolicitacao: "12 de Abril, 2026",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    paciente: "Pedro Henrique Lima",
    email: "pedro.lima@email.com",
    telefone: "(27) 99666-3322",
    dataDesejada: "18 de Abril, 2026",
    horarioDesejado: "10:00",
    motivo: "Reeducação alimentar para ganho de massa muscular",
    dataSolicitacao: "13 de Abril, 2026",
    avatar: "/placeholder-user.jpg",
  },
]

const solicitacoesProcessadas = [
  {
    id: 4,
    paciente: "Carla Mendes",
    dataDesejada: "14 de Abril, 2026",
    horarioDesejado: "11:00",
    status: "aprovada",
    dataProcessamento: "11 de Abril, 2026",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 5,
    paciente: "Roberto Alves",
    dataDesejada: "15 de Abril, 2026",
    horarioDesejado: "16:00",
    status: "recusada",
    dataProcessamento: "10 de Abril, 2026",
    motivo: "Horário indisponível",
    avatar: "/placeholder-user.jpg",
  },
]

export default function Solicitacoes() {
  const [busca, setBusca] = useState("")
  const [solicitacoes, setSolicitacoes] = useState(solicitacoesPendentes)
  const [processadas, setProcessadas] = useState(solicitacoesProcessadas)
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<typeof solicitacoesPendentes[0] | null>(null)
  const [dialogDetalhes, setDialogDetalhes] = useState(false)
  const [dialogAprovar, setDialogAprovar] = useState(false)
  const [dialogRecusar, setDialogRecusar] = useState(false)

  const solicitacoesFiltradas = solicitacoes.filter((s) =>
    s.paciente.toLowerCase().includes(busca.toLowerCase())
  )

  const handleAprovar = () => {
    if (solicitacaoSelecionada) {
      setProcessadas([
        {
          id: solicitacaoSelecionada.id,
          paciente: solicitacaoSelecionada.paciente,
          dataDesejada: solicitacaoSelecionada.dataDesejada,
          horarioDesejado: solicitacaoSelecionada.horarioDesejado,
          status: "aprovada",
          dataProcessamento: "13 de Abril, 2026",
          avatar: solicitacaoSelecionada.avatar,
        },
        ...processadas,
      ])
      setSolicitacoes(solicitacoes.filter((s) => s.id !== solicitacaoSelecionada.id))
    }
    setDialogAprovar(false)
    setDialogDetalhes(false)
    setSolicitacaoSelecionada(null)
  }

  const handleRecusar = () => {
    if (solicitacaoSelecionada) {
      setProcessadas([
        {
          id: solicitacaoSelecionada.id,
          paciente: solicitacaoSelecionada.paciente,
          dataDesejada: solicitacaoSelecionada.dataDesejada,
          horarioDesejado: solicitacaoSelecionada.horarioDesejado,
          status: "recusada",
          dataProcessamento: "13 de Abril, 2026",
          motivo: "Horário indisponível",
          avatar: solicitacaoSelecionada.avatar,
        },
        ...processadas,
      ])
      setSolicitacoes(solicitacoes.filter((s) => s.id !== solicitacaoSelecionada.id))
    }
    setDialogRecusar(false)
    setDialogDetalhes(false)
    setSolicitacaoSelecionada(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Solicitações de Agendamento
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie as solicitações de consulta dos pacientes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{solicitacoes.length}</p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <Check className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {processadas.filter((p) => p.status === "aprovada").length}
              </p>
              <p className="text-sm text-muted-foreground">Aprovadas Hoje</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <X className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {processadas.filter((p) => p.status === "recusada").length}
              </p>
              <p className="text-sm text-muted-foreground">Recusadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendentes" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="pendentes">
              Pendentes ({solicitacoes.length})
            </TabsTrigger>
            <TabsTrigger value="processadas">Processadas</TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar paciente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <TabsContent value="pendentes" className="space-y-4">
          {solicitacoesFiltradas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">Nenhuma solicitação pendente</h3>
                <p className="text-sm text-muted-foreground">
                  Não há solicitações aguardando aprovação no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            solicitacoesFiltradas.map((solicitacao) => (
              <Card key={solicitacao.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={solicitacao.avatar} alt={solicitacao.paciente} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {solicitacao.paciente.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{solicitacao.paciente}</h3>
                          <Badge className="bg-warning/10 text-warning">Pendente</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {solicitacao.motivo}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {solicitacao.dataDesejada}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {solicitacao.horarioDesejado}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSolicitacaoSelecionada(solicitacao)
                          setDialogDetalhes(true)
                        }}
                      >
                        Ver Detalhes
                      </Button>
                      <Button
                        size="sm"
                        className="bg-success text-success-foreground hover:bg-success/90"
                        onClick={() => {
                          setSolicitacaoSelecionada(solicitacao)
                          setDialogAprovar(true)
                        }}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Aprovar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setSolicitacaoSelecionada(solicitacao)
                          setDialogRecusar(true)
                        }}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Recusar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="processadas" className="space-y-4">
          {processadas.map((item) => (
            <Card key={item.id} className={item.status === "recusada" ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={item.avatar} alt={item.paciente} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {item.paciente.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{item.paciente}</h3>
                        {item.status === "aprovada" ? (
                          <Badge className="bg-success/10 text-success">Aprovada</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-muted-foreground">Recusada</Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {item.dataDesejada} às {item.horarioDesejado}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Processado em {item.dataProcessamento}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogDetalhes} onOpenChange={setDialogDetalhes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações completas sobre a solicitação de agendamento.
            </DialogDescription>
          </DialogHeader>
          {solicitacaoSelecionada && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={solicitacaoSelecionada.avatar} alt={solicitacaoSelecionada.paciente} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {solicitacaoSelecionada.paciente.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{solicitacaoSelecionada.paciente}</p>
                  <Badge className="mt-1 bg-warning/10 text-warning">Aguardando Aprovação</Badge>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{solicitacaoSelecionada.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{solicitacaoSelecionada.telefone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{solicitacaoSelecionada.dataDesejada}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{solicitacaoSelecionada.horarioDesejado}</span>
                </div>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-medium text-foreground">Motivo da Consulta</h4>
                <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  {solicitacaoSelecionada.motivo}
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              className="text-destructive hover:bg-destructive/10"
              onClick={() => {
                setDialogDetalhes(false)
                setDialogRecusar(true)
              }}
            >
              <X className="mr-1 h-4 w-4" />
              Recusar
            </Button>
            <Button
              className="bg-success text-success-foreground hover:bg-success/90"
              onClick={() => {
                setDialogDetalhes(false)
                setDialogAprovar(true)
              }}
            >
              <Check className="mr-1 h-4 w-4" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogAprovar} onOpenChange={setDialogAprovar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Aprovação</DialogTitle>
            <DialogDescription>
              Deseja aprovar a solicitação de {solicitacaoSelecionada?.paciente}?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="text-foreground">
              <strong>Data:</strong> {solicitacaoSelecionada?.dataDesejada}
            </p>
            <p className="text-foreground">
              <strong>Horário:</strong> {solicitacaoSelecionada?.horarioDesejado}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAprovar(false)}>
              Cancelar
            </Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={handleAprovar}>
              Confirmar Aprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogRecusar} onOpenChange={setDialogRecusar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recusar Solicitação</DialogTitle>
            <DialogDescription>
              Deseja recusar a solicitação de {solicitacaoSelecionada?.paciente}?
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            O paciente será notificado sobre a recusa e poderá solicitar outro horário.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogRecusar(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRecusar}>
              Confirmar Recusa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
