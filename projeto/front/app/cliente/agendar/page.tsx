"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Star, Clock, MapPin, CheckCircle2 } from "lucide-react"
import { ptBR } from "date-fns/locale"

const especialidades = [
  "Todas",
  "Nutricionista",
  "Psicólogo",
  "Clínico Geral",
  "Fisioterapeuta",
  "Dermatologista",
]

const profissionais = [
  {
    id: 1,
    nome: "Dra. Ana Costa",
    especialidade: "Nutricionista",
    avaliacao: 4.9,
    totalAvaliacoes: 127,
    temposDisponiveis: ["09:00", "10:00", "14:00", "15:00", "16:00"],
    local: "Sala 205 - Bloco B",
    preco: "R$ 180,00",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    nome: "Dr. Carlos Lima",
    especialidade: "Psicólogo",
    avaliacao: 4.8,
    totalAvaliacoes: 89,
    temposDisponiveis: ["08:00", "09:00", "11:00", "14:00"],
    local: "Sala 310 - Bloco A",
    preco: "R$ 200,00",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    nome: "Dra. Juliana Santos",
    especialidade: "Clínico Geral",
    avaliacao: 4.7,
    totalAvaliacoes: 203,
    temposDisponiveis: ["07:00", "08:00", "09:00", "10:00", "11:00"],
    local: "Sala 102 - Bloco C",
    preco: "R$ 150,00",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 4,
    nome: "Dr. Roberto Mendes",
    especialidade: "Fisioterapeuta",
    avaliacao: 4.9,
    totalAvaliacoes: 156,
    temposDisponiveis: ["10:00", "11:00", "15:00", "16:00", "17:00"],
    local: "Sala 401 - Bloco D",
    preco: "R$ 120,00",
    avatar: "/placeholder-user.jpg",
  },
]

export default function AgendarConsulta() {
  const [busca, setBusca] = useState("")
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState("Todas")
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<typeof profissionais[0] | null>(null)
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>(undefined)
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [confirmado, setConfirmado] = useState(false)

  const profissionaisFiltrados = profissionais.filter((p) => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase())
    const matchEspecialidade = especialidadeFiltro === "Todas" || p.especialidade === especialidadeFiltro
    return matchBusca && matchEspecialidade
  })

  const handleSelecionarProfissional = (profissional: typeof profissionais[0]) => {
    setProfissionalSelecionado(profissional)
    setDataSelecionada(undefined)
    setHorarioSelecionado(null)
  }

  const handleConfirmar = () => {
    setConfirmado(true)
  }

  const handleFecharDialog = () => {
    setDialogAberto(false)
    setConfirmado(false)
    setProfissionalSelecionado(null)
    setDataSelecionada(undefined)
    setHorarioSelecionado(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Agendar Consulta
        </h1>
        <p className="mt-1 text-muted-foreground">
          Encontre o profissional ideal e agende sua consulta em poucos passos.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do profissional..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={especialidadeFiltro} onValueChange={setEspecialidadeFiltro}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Especialidade" />
          </SelectTrigger>
          <SelectContent>
            {especialidades.map((esp) => (
              <SelectItem key={esp} value={esp}>
                {esp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Profissionais Disponíveis</h2>
          <div className="space-y-4">
            {profissionaisFiltrados.map((profissional) => (
              <Card
                key={profissional.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  profissionalSelecionado?.id === profissional.id
                    ? "border-primary ring-1 ring-primary"
                    : ""
                }`}
                onClick={() => handleSelecionarProfissional(profissional)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profissional.avatar} alt={profissional.nome} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {profissional.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{profissional.nome}</h3>
                          <p className="text-sm text-muted-foreground">{profissional.especialidade}</p>
                        </div>
                        <Badge variant="secondary" className="text-primary">
                          {profissional.preco}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-warning text-warning" />
                          <span className="font-medium text-foreground">{profissional.avaliacao}</span>
                          <span className="text-muted-foreground">({profissional.totalAvaliacoes})</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {profissional.local}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {profissionalSelecionado && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">Selecione Data e Horário</CardTitle>
              <CardDescription>
                Escolha o melhor momento para sua consulta com {profissionalSelecionado.nome}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Data</p>
                <Calendar
                  mode="single"
                  selected={dataSelecionada}
                  onSelect={setDataSelecionada}
                  locale={ptBR}
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                  className="rounded-md border"
                />
              </div>

              {dataSelecionada && (
                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Horários Disponíveis</p>
                  <div className="grid grid-cols-3 gap-2">
                    {profissionalSelecionado.temposDisponiveis.map((horario) => (
                      <Button
                        key={horario}
                        variant={horarioSelecionado === horario ? "default" : "outline"}
                        size="sm"
                        className="gap-1"
                        onClick={() => setHorarioSelecionado(horario)}
                      >
                        <Clock className="h-3 w-3" />
                        {horario}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {dataSelecionada && horarioSelecionado && (
                <Button className="w-full" size="lg" onClick={() => setDialogAberto(true)}>
                  Confirmar Agendamento
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          {!confirmado ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirmar Agendamento</DialogTitle>
                <DialogDescription>
                  Revise os detalhes da sua consulta antes de confirmar.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profissionalSelecionado?.avatar} alt={profissionalSelecionado?.nome} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {profissionalSelecionado?.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{profissionalSelecionado?.nome}</p>
                    <p className="text-sm text-muted-foreground">{profissionalSelecionado?.especialidade}</p>
                  </div>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data</span>
                    <span className="font-medium text-foreground">
                      {dataSelecionada?.toLocaleDateString("pt-BR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horário</span>
                    <span className="font-medium text-foreground">{horarioSelecionado}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Local</span>
                    <span className="font-medium text-foreground">{profissionalSelecionado?.local}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <span className="text-muted-foreground">Valor</span>
                    <span className="font-semibold text-primary">{profissionalSelecionado?.preco}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleConfirmar}>
                  Confirmar Agendamento
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <DialogTitle className="mb-2">Agendamento Confirmado!</DialogTitle>
              <DialogDescription className="mb-6">
                Sua consulta foi agendada com sucesso. Você receberá uma confirmação por e-mail.
              </DialogDescription>
              <Button onClick={handleFecharDialog}>
                Voltar para Agendamentos
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
