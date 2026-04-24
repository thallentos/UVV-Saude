"use client"

import { useState } from "react"
import { Calendar, Clock, MapPin, User, Star, FileText, X, ChevronRight } from "lucide-react"
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

// Dados mockados - Consultas em andamento
const consultasEmAndamento = [
  {
    id: 1,
    profissional: "Dra. Ana Paula Silva",
    especialidade: "Nutricionista",
    data: "18 de Abril, 2026",
    horario: "14:00",
    status: "confirmada",
    local: "Sala 12 - Bloco B",
    foto: null,
  },
  {
    id: 2,
    profissional: "Dr. Carlos Mendes",
    especialidade: "Psicólogo",
    data: "22 de Abril, 2026",
    horario: "10:30",
    status: "pendente",
    local: "Sala 08 - Bloco A",
    foto: null,
  },
]

// Dados mockados - Histórico de consultas
const historicoConsultas = [
  {
    id: 1,
    profissional: "Dra. Ana Paula Silva",
    especialidade: "Nutricionista",
    data: "10 de Março, 2026",
    horario: "14:00",
    status: "realizada",
    avaliacao: 5,
    resumo: "Consulta de acompanhamento nutricional. Ajuste no plano alimentar com foco em redução de carboidratos simples. Recomendado aumentar ingestão de proteínas e fibras.",
    recomendacoes: [
      "Aumentar consumo de vegetais verdes",
      "Reduzir açúcar refinado",
      "Beber 2L de água por dia",
      "Retorno em 30 dias"
    ],
  },
  {
    id: 2,
    profissional: "Dr. Carlos Mendes",
    especialidade: "Psicólogo",
    data: "05 de Março, 2026",
    horario: "10:30",
    status: "realizada",
    avaliacao: 5,
    resumo: "Sessão de terapia cognitivo-comportamental. Trabalhamos técnicas de controle de ansiedade e mindfulness.",
    recomendacoes: [
      "Praticar respiração diafragmática",
      "Exercícios de journaling diários",
      "Meditação guiada 10min/dia"
    ],
  },
  {
    id: 3,
    profissional: "Dra. Ana Paula Silva",
    especialidade: "Nutricionista",
    data: "10 de Fevereiro, 2026",
    horario: "15:00",
    status: "realizada",
    avaliacao: 4,
    resumo: "Primeira consulta nutricional. Avaliação antropométrica completa e definição de metas.",
    recomendacoes: [
      "Iniciar diário alimentar",
      "Reduzir fast food",
      "Incluir frutas no café da manhã"
    ],
  },
  {
    id: 4,
    profissional: "Dr. Carlos Mendes",
    especialidade: "Psicólogo",
    data: "28 de Janeiro, 2026",
    horario: "09:00",
    status: "cancelada",
    avaliacao: null,
    resumo: null,
    recomendacoes: null,
  },
]

type ConsultaHistorico = typeof historicoConsultas[0]

export default function AgendamentosPage() {
  const [selectedConsulta, setSelectedConsulta] = useState<ConsultaHistorico | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmada</Badge>
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pendente</Badge>
      case "realizada":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Realizada</Badge>
      case "cancelada":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
        <p className="text-muted-foreground">
          Acompanhe suas consultas em andamento e histórico
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="andamento" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Em Andamento */}
        <TabsContent value="andamento" className="space-y-4">
          {consultasEmAndamento.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">
                  Nenhuma consulta agendada
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Você não possui consultas em andamento
                </p>
                <Button className="mt-4" asChild>
                  <a href="/cliente/agendar">Agendar Consulta</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {consultasEmAndamento.map((consulta) => (
                <Card key={consulta.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Info Principal */}
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {consulta.profissional}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {consulta.especialidade}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(consulta.status)}
                        </div>

                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {consulta.data}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {consulta.horario}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {consulta.local}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm">
                            Cancelar
                          </Button>
                          {consulta.status === "pendente" && (
                            <Button size="sm">Confirmar</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="historico" className="space-y-4">
          {historicoConsultas.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 font-semibold text-foreground">
                  Nenhum histórico
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Você ainda não realizou nenhuma consulta
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {historicoConsultas.map((consulta) => (
                <Card 
                  key={consulta.id} 
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    consulta.status === "cancelada" ? "opacity-60" : ""
                  }`}
                  onClick={() => consulta.status !== "cancelada" && setSelectedConsulta(consulta)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {consulta.profissional}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {consulta.especialidade}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(consulta.status)}
                        {consulta.status !== "cancelada" && (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {consulta.data}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {consulta.horario}
                      </div>
                      {consulta.avaliacao && (
                        <div className="flex items-center gap-1 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < consulta.avaliacao!
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes da Consulta */}
      <Dialog open={!!selectedConsulta} onOpenChange={() => setSelectedConsulta(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Consulta</DialogTitle>
            <DialogDescription>
              {selectedConsulta?.data} às {selectedConsulta?.horario}
            </DialogDescription>
          </DialogHeader>

          {selectedConsulta && (
            <div className="space-y-6">
              {/* Profissional */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {selectedConsulta.profissional}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConsulta.especialidade}
                  </p>
                </div>
              </div>

              {/* Avaliação */}
              {selectedConsulta.avaliacao && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Avaliação</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < selectedConsulta.avaliacao!
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Resumo */}
              {selectedConsulta.resumo && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Resumo</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {selectedConsulta.resumo}
                  </p>
                </div>
              )}

              {/* Recomendações */}
              {selectedConsulta.recomendacoes && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Recomendações</h4>
                  <ul className="space-y-2">
                    {selectedConsulta.recomendacoes.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedConsulta(null)}>
                  Fechar
                </Button>
                <Button className="flex-1">
                  Agendar Novamente
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
