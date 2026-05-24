"use client"

import { getToken } from "@/lib/auth"
import { getInitials } from "@/lib/utils"
import { API_URL } from "@/lib/api"
import { useState, useEffect, useCallback } from "react"
import { Search, Star, MapPin, Loader2, Clock, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const diasSemanaAbrev = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

interface Profissional {
  usuario_id: number
  nome: string
  email: string
  telefone: string | null
  foto_url: string | null
  especialidade_id: number
  especialidade_nome: string
  registro_prof: string
  bio: string | null
}

interface Slot {
  id: number
  profissional_id: number
  data_disponivel: string
  horario_inicio: string
  status_vaga: "LIVRE" | "OCUPADO"
}

function gerarDiasDoMes(ano: number, mes: number): string[] {
  const dias: string[] = []
  const total = new Date(ano, mes + 1, 0).getDate()
  for (let d = 1; d <= total; d++) {
    const mm = String(mes + 1).padStart(2, "0")
    const dd = String(d).padStart(2, "0")
    dias.push(`${ano}-${mm}-${dd}`)
  }
  return dias
}

function primeiroDiaSemana(ano: number, mes: number): number {
  return new Date(ano, mes, 1).getDay()
}

function formatarData(dataStr: string): string {
  const [ano, mes, dia] = dataStr.split("-")
  return `${dia}/${mes}/${ano}`
}

export default function AgendarConsultaPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [carregandoProfs, setCarregandoProfs] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("todas")

  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [carregandoSlots, setCarregandoSlots] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)

  const [mesAtual, setMesAtual] = useState(() => new Date().getMonth())
  const [anoAtual, setAnoAtual] = useState(() => new Date().getFullYear())
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null)
  const [slotSelecionado, setSlotSelecionado] = useState<Slot | null>(null)
  const [observacoes, setObservacoes] = useState("")

  const [confirmandoAberto, setConfirmandoAberto] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState("")

  const carregarProfissionais = useCallback(async () => {
    setCarregandoProfs(true)
    try {
      const params = filtroEspecialidade !== "todas"
        ? `?especialidade_id=${filtroEspecialidade}`
        : ""
      const res = await fetch(`${API_URL}/api/v1/profissionais${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error()
      const data: Profissional[] = await res.json()
      setProfissionais(data)
    } catch {
      setErro("Não foi possível carregar os profissionais.")
    } finally {
      setCarregandoProfs(false)
    }
  }, [filtroEspecialidade])

  useEffect(() => {
    carregarProfissionais()
  }, [carregarProfissionais])

  async function abrirAgenda(profissional: Profissional) {
    setProfissionalSelecionado(profissional)
    setDiaSelecionado(null)
    setSlotSelecionado(null)
    setObservacoes("")
    setSucesso(false)
    setErro("")
    setModalAberto(true)
    setCarregandoSlots(true)
    try {
      const res = await fetch(
        `${API_URL}/api/v1/agenda/profissional/${profissional.usuario_id}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      )
      if (!res.ok) throw new Error()
      const data: Slot[] = await res.json()
      setSlots(data)
    } catch {
      setErro("Não foi possível carregar a agenda do profissional.")
    } finally {
      setCarregandoSlots(false)
    }
  }

  function fecharModal() {
    setModalAberto(false)
    setProfissionalSelecionado(null)
    setSlots([])
    setDiaSelecionado(null)
    setSlotSelecionado(null)
    setObservacoes("")
    setSucesso(false)
    setErro("")
  }

  function slotsDoDia(data: string): Slot[] {
    return slots.filter(s => {
      const d = s.data_disponivel.split("T")[0]
      return d === data
    }).sort((a, b) => a.horario_inicio.localeCompare(b.horario_inicio))
  }

  function diasComSlots(): Set<string> {
    const set = new Set<string>()
    slots.forEach(s => {
      const d = s.data_disponivel.split("T")[0]
      if (d) set.add(d)
    })
    return set
  }

  function selecionarDia(data: string) {
    setDiaSelecionado(data)
    setSlotSelecionado(null)
  }

  function mesAnterior() {
    if (mesAtual === 0) { setMesAtual(11); setAnoAtual(a => a - 1) }
    else setMesAtual(m => m - 1)
  }

  function proximoMes() {
    if (mesAtual === 11) { setMesAtual(0); setAnoAtual(a => a + 1) }
    else setMesAtual(m => m + 1)
  }

  async function confirmarAgendamento() {
    if (!slotSelecionado) return
    setSalvando(true)
    setErro("")
    try {
      const res = await fetch(`${API_URL}/api/v1/consultas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          agenda_id: slotSelecionado.id,
          observacoes: observacoes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Erro ao solicitar agendamento.")
      setSucesso(true)
      setConfirmandoAberto(false)
      setSlots(prev => prev.filter(s => s.id !== slotSelecionado.id))
      setSlotSelecionado(null)
      setDiaSelecionado(null)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao solicitar agendamento.")
      setConfirmandoAberto(false)
    } finally {
      setSalvando(false)
    }
  }

  const profissionaisFiltrados = profissionais.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  const dias = gerarDiasDoMes(anoAtual, mesAtual)
  const offset = primeiroDiaSemana(anoAtual, mesAtual)
  const diasDisponiveis = diasComSlots()
  const slotsDiaSelecionado = diaSelecionado ? slotsDoDia(diaSelecionado) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agendar Consulta</h1>
        <p className="text-muted-foreground">
          Escolha um profissional e selecione um horário disponível
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar profissional..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filtroEspecialidade} onValueChange={setFiltroEspecialidade}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Especialidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as especialidades</SelectItem>
            <SelectItem value="1">Psicologia</SelectItem>
            <SelectItem value="2">Nutrição</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de profissionais */}
      {carregandoProfs ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : profissionaisFiltrados.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Nenhum profissional encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profissionaisFiltrados.map(prof => (
            <Card
              key={prof.usuario_id}
              className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => abrirAgenda(prof)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {getInitials(prof.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{prof.nome}</h3>
                    <p className="text-sm text-muted-foreground">{prof.especialidade_nome}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      {prof.registro_prof}
                    </Badge>
                    {prof.bio && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                        {prof.bio}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                  <Calendar className="h-4 w-4" />
                  Ver horários disponíveis
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de agenda do profissional */}
      <Dialog open={modalAberto} onOpenChange={fecharModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {profissionalSelecionado && (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(profissionalSelecionado.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{profissionalSelecionado.nome}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {profissionalSelecionado.especialidade_nome}
                    </p>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Selecione um dia disponível e escolha um horário
            </DialogDescription>
          </DialogHeader>

          {sucesso ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Solicitação enviada!</h3>
              <p className="text-sm text-muted-foreground">
                Sua solicitação foi enviada e aguarda aprovação do profissional.
                Você receberá uma confirmação em breve.
              </p>
              <Button onClick={fecharModal}>Fechar</Button>
            </div>
          ) : carregandoSlots ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {erro && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {erro}
                </div>
              )}

              {slots.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <Clock className="h-10 w-10 text-muted-foreground/50" />
                  <p className="font-medium text-foreground">Nenhum horário disponível</p>
                  <p className="text-sm text-muted-foreground">
                    Este profissional não possui horários livres no momento.
                  </p>
                </div>
              ) : (
                <>
                  {/* Navegação do mês */}
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="icon" onClick={mesAnterior}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold text-foreground">
                      {meses[mesAtual]} {anoAtual}
                    </span>
                    <Button variant="outline" size="icon" onClick={proximoMes}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Legenda */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                      <span>Horários disponíveis</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full border border-border" />
                      <span>Sem horários</span>
                    </div>
                  </div>

                  {/* Calendário */}
                  <div className="rounded-lg border border-border p-3">
                    <div className="mb-2 grid grid-cols-7 gap-1">
                      {diasSemanaAbrev.map(d => (
                        <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                          {d}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: offset }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {dias.map(data => {
                        const temSlot = diasDisponiveis.has(data)
                        const diaNum = Number(data.split("-")[2])
                        const ehHoje = data === new Date().toISOString().split("T")[0]
                        const selecionado = diaSelecionado === data
                        const passado = new Date(data + "T00:00:00") < new Date(new Date().toDateString())

                        return (
                          <button
                            key={data}
                            disabled={!temSlot || passado}
                            onClick={() => selecionarDia(data)}
                            className={`
                              relative flex flex-col items-center justify-center rounded-lg p-1.5 text-sm
                              transition-all
                              ${passado ? "opacity-30 cursor-not-allowed" : ""}
                              ${!temSlot && !passado ? "text-muted-foreground/40 cursor-not-allowed" : ""}
                              ${temSlot && !passado ? "hover:bg-accent cursor-pointer" : ""}
                              ${ehHoje ? "border-2 border-primary font-bold" : "border border-transparent"}
                              ${selecionado ? "bg-primary text-primary-foreground hover:bg-primary" : ""}
                            `}
                          >
                            <span>{diaNum}</span>
                            {temSlot && !passado && (
                              <div className={`mt-0.5 h-1.5 w-1.5 rounded-full ${selecionado ? "bg-primary-foreground" : "bg-primary"}`} />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Horários do dia selecionado */}
                  {diaSelecionado && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        Horários disponíveis em {formatarData(diaSelecionado)}
                      </p>
                      {slotsDiaSelecionado.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Nenhum horário disponível neste dia.
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {slotsDiaSelecionado.map(slot => (
                            <button
                              key={slot.id}
                              onClick={() => setSlotSelecionado(slot)}
                              className={`
                                flex items-center justify-center gap-1.5 rounded-lg border p-2.5 text-sm
                                transition-all hover:border-primary
                                ${slotSelecionado?.id === slot.id
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border text-foreground"
                                }
                              `}
                            >
                              <Clock className="h-3.5 w-3.5" />
                              {slot.horario_inicio.slice(0, 5)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Botão de confirmar */}
                  {slotSelecionado && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Horário selecionado</p>
                          <p className="text-sm text-muted-foreground">
                            {formatarData(diaSelecionado!)} às {slotSelecionado.horario_inicio.slice(0, 5)}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Disponível</Badge>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm">Observações (opcional)</Label>
                        <Textarea
                          placeholder="Descreva o motivo da consulta ou informações relevantes..."
                          value={observacoes}
                          onChange={e => setObservacoes(e.target.value)}
                          className="min-h-[80px] text-sm resize-none"
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => setConfirmandoAberto(true)}
                      >
                        Solicitar Agendamento
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação */}
      <Dialog open={confirmandoAberto} onOpenChange={setConfirmandoAberto}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar solicitação</DialogTitle>
            <DialogDescription>
              Revise os detalhes antes de confirmar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profissional</span>
                <span className="font-medium text-foreground">{profissionalSelecionado?.nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Especialidade</span>
                <span className="font-medium text-foreground">{profissionalSelecionado?.especialidade_nome}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data</span>
                <span className="font-medium text-foreground">
                  {diaSelecionado && formatarData(diaSelecionado)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Horário</span>
                <span className="font-medium text-foreground">
                  {slotSelecionado?.horario_inicio.slice(0, 5)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Sua solicitação ficará pendente até o profissional aprovar.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirmandoAberto(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              disabled={salvando}
              onClick={confirmarAgendamento}
            >
              {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}