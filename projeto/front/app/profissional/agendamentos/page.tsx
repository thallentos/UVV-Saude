"use client"

import { useState } from "react"
import { Calendar, Clock, User, Phone, Mail, FileText, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

// Dados mockados - Agendamentos atuais
const agendamentosAtuais = [
  {
    id: 1,
    paciente: "Maria Oliveira",
    email: "maria@email.com",
    telefone: "(27) 99999-1234",
    idade: 28,
    sexo: "Feminino",
    data: "18 de Abril, 2026",
    horario: "14:00",
    tipo: "Retorno",
    status: "confirmado",
  },
  {
    id: 2,
    paciente: "João Pedro Santos",
    email: "joao@email.com",
    telefone: "(27) 99888-5678",
    idade: 35,
    sexo: "Masculino",
    data: "18 de Abril, 2026",
    horario: "15:00",
    tipo: "Primeira consulta",
    status: "confirmado",
  },
  {
    id: 3,
    paciente: "Ana Clara Lima",
    email: "ana@email.com",
    telefone: "(27) 99777-9012",
    idade: 42,
    sexo: "Feminino",
    data: "22 de Abril, 2026",
    horario: "09:00",
    tipo: "Retorno",
    status: "pendente",
  },
  {
    id: 4,
    paciente: "Carlos Eduardo Souza",
    email: "carlos@email.com",
    telefone: "(27) 99666-3456",
    idade: 31,
    sexo: "Masculino",
    data: "22 de Abril, 2026",
    horario: "10:30",
    tipo: "Primeira consulta",
    status: "confirmado",
  },
]

// Dados mockados - Agendamentos passados
const agendamentosPassados = [
  {
    id: 1,
    paciente: "Maria Oliveira",
    email: "maria@email.com",
    telefone: "(27) 99999-1234",
    idade: 28,
    sexo: "Feminino",
    data: "10 de Março, 2026",
    horario: "14:00",
    tipo: "Retorno",
    status: "realizado",
    observacoes: "Paciente apresentou boa evolução. Ajuste no plano alimentar realizado.",
  },
  {
    id: 2,
    paciente: "Roberto Alves",
    email: "roberto@email.com",
    telefone: "(27) 99555-7890",
    idade: 45,
    sexo: "Masculino",
    data: "08 de Março, 2026",
    horario: "11:00",
    tipo: "Retorno",
    status: "faltou",
    observacoes: null,
  },
  {
    id: 3,
    paciente: "Fernanda Costa",
    email: "fernanda@email.com",
    telefone: "(27) 99444-1234",
    idade: 38,
    sexo: "Feminino",
    data: "05 de Março, 2026",
    horario: "15:30",
    tipo: "Primeira consulta",
    status: "realizado",
    observacoes: "Primeira avaliação. Definidos objetivos e plano inicial.",
  },
  {
    id: 4,
    paciente: "Lucas Mendes",
    email: "lucas@email.com",
    telefone: "(27) 99333-5678",
    idade: 29,
    sexo: "Masculino",
    data: "01 de Março, 2026",
    horario: "09:00",
    tipo: "Retorno",
    status: "cancelado",
    observacoes: "Cancelado pelo paciente.",
  },
]

type Agendamento = typeof agendamentosAtuais[0] | typeof agendamentosPassados[0]

export default function AgendamentosProfissionalPage() {
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmado":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmado</Badge>
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pendente</Badge>
      case "realizado":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Realizado</Badge>
      case "faltou":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Faltou</Badge>
      case "cancelado":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
        <p className="text-muted-foreground">
          Visualize seus agendamentos atuais e passados
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="atuais" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="atuais">Atuais</TabsTrigger>
          <TabsTrigger value="passados">Passados</TabsTrigger>
        </TabsList>

        {/* Atuais */}
        <TabsContent value="atuais" className="space-y-4">
          {agendamentosAtuais.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">
                  Nenhum agendamento
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Você não possui agendamentos futuros
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {agendamentosAtuais.map((agendamento) => (
                <Card 
                  key={agendamento.id} 
                  className="cursor-pointer transition-all hover:border-primary/50"
                  onClick={() => setSelectedAgendamento(agendamento)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(agendamento.paciente)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {agendamento.paciente}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {agendamento.tipo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(agendamento.status)}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {agendamento.data}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {agendamento.horario}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Passados */}
        <TabsContent value="passados" className="space-y-4">
          {agendamentosPassados.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">
                  Nenhum histórico
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Você ainda não realizou nenhum atendimento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {agendamentosPassados.map((agendamento) => (
                <Card 
                  key={agendamento.id} 
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    agendamento.status === "cancelado" || agendamento.status === "faltou" ? "opacity-60" : ""
                  }`}
                  onClick={() => setSelectedAgendamento(agendamento)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(agendamento.paciente)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {agendamento.paciente}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {agendamento.tipo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(agendamento.status)}
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {agendamento.data}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {agendamento.horario}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedAgendamento} onOpenChange={() => setSelectedAgendamento(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              {selectedAgendamento?.data} às {selectedAgendamento?.horario}
            </DialogDescription>
          </DialogHeader>

          {selectedAgendamento && (
            <div className="space-y-6">
              {/* Paciente */}
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(selectedAgendamento.paciente)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {selectedAgendamento.paciente}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAgendamento.idade} anos - {selectedAgendamento.sexo}
                  </p>
                </div>
              </div>

              {/* Status e Tipo */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedAgendamento.status)}
                <Badge variant="outline">{selectedAgendamento.tipo}</Badge>
              </div>

              {/* Contato */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Contato</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {selectedAgendamento.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {selectedAgendamento.telefone}
                  </div>
                </div>
              </div>

              {/* Observações (se houver) */}
              {"observacoes" in selectedAgendamento && selectedAgendamento.observacoes && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Observações</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selectedAgendamento.observacoes}
                  </p>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedAgendamento(null)}>
                  Fechar
                </Button>
                {selectedAgendamento.status === "confirmado" || selectedAgendamento.status === "pendente" ? (
                  <Button className="flex-1">
                    Iniciar Atendimento
                  </Button>
                ) : selectedAgendamento.status === "realizado" ? (
                  <Button className="flex-1">
                    Ver Prontuário
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
