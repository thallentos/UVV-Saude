"use client"

import { getToken } from "@/lib/auth"
import { API_URL } from "@/lib/api"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Plus, Trash2, Pencil, Check, X, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const diasSemanaAbrev = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

const horariosDisponiveis = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00"
]

interface Slot {
  id: number
  profissional_id: number
  data_disponivel: string
  horario_inicio: string
  status_vaga: "LIVRE" | "OCUPADO"
}

interface SlotNovo {
  tempId: string
  horario: string
}

interface DiaInfo {
  data: string
  slots: Slot[]
}

function formatarData(dataStr: string): string {
  const [ano, mes, dia] = dataStr.split("-")
  return `${dia}/${mes}/${ano}`
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

export default function HorariosPage() {
  const [mesAtual, setMesAtual] = useState(() => new Date().getMonth())
  const [anoAtual, setAnoAtual] = useState(() => new Date().getFullYear())
  const [slots, setSlots] = useState<Slot[]>([])
  const [carregando, setCarregando] = useState(true)
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null)
  const [painelAberto, setPainelAberto] = useState(false)
  const [slotsNovos, setSlotsNovos] = useState<SlotNovo[]>([])
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [editandoHorario, setEditandoHorario] = useState<string>("")
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  const carregarSlots = useCallback(async () => {
    setCarregando(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/agenda/minha`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error()
      const data: Slot[] = await res.json()
      setSlots(data)
    } catch {
      setErro("Não foi possível carregar a agenda.")
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarSlots()
  }, [carregarSlots])

  function slotsDoDia(data: string): Slot[] {
    return slots.filter(s => {
      const d = s.data_disponivel.split("T")[0]
      return d === data
    }).sort((a, b) => a.horario_inicio.localeCompare(b.horario_inicio))
  }

  function temSlots(data: string): boolean {
    return slotsDoDia(data).length > 0
  }

  function abrirDia(data: string) {
    setDiaSelecionado(data)
    setSlotsNovos([])
    setEditandoId(null)
    setErro("")
    setSucesso("")
    setPainelAberto(true)
  }

  function fecharPainel() {
    setPainelAberto(false)
    setDiaSelecionado(null)
    setSlotsNovos([])
    setEditandoId(null)
    setErro("")
    setSucesso("")
  }

  function adicionarSlotNovo() {
    setSlotsNovos(prev => [
      ...prev,
      { tempId: crypto.randomUUID(), horario: "09:00" }
    ])
  }

  function atualizarSlotNovo(tempId: string, horario: string) {
    setSlotsNovos(prev =>
      prev.map(s => s.tempId === tempId ? { ...s, horario } : s)
    )
  }

  function removerSlotNovo(tempId: string) {
    setSlotsNovos(prev => prev.filter(s => s.tempId !== tempId))
  }

  function iniciarEdicao(slot: Slot) {
    setEditandoId(slot.id)
    setEditandoHorario(slot.horario_inicio.slice(0, 5))
  }

  function cancelarEdicao() {
    setEditandoId(null)
    setEditandoHorario("")
  }

  async function salvarEdicao(id: number) {
    setSalvando(true)
    setErro("")
    try {
      const res = await fetch(`${API_URL}/api/v1/agenda/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ horario_inicio: editandoHorario }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Erro ao editar.")
      setSlots(prev => prev.map(s => s.id === id ? data : s))
      setEditandoId(null)
      setSucesso("Horário editado com sucesso!")
      setTimeout(() => setSucesso(""), 3000)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao editar horário.")
    } finally {
      setSalvando(false)
    }
  }

  async function deletarSlot(id: number) {
    setSalvando(true)
    setErro("")
    try {
      const res = await fetch(`${API_URL}/api/v1/agenda/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error("Erro ao deletar.")
      setSlots(prev => prev.filter(s => s.id !== id))
      setSucesso("Horário removido!")
      setTimeout(() => setSucesso(""), 3000)
    } catch {
      setErro("Erro ao deletar horário.")
    } finally {
      setSalvando(false)
    }
  }

  async function salvarNovos() {
    if (slotsNovos.length === 0) return
    setSalvando(true)
    setErro("")
    try {
      const resultados = await Promise.all(
        slotsNovos.map(slot =>
          fetch(`${API_URL}/api/v1/agenda`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
              data_disponivel: diaSelecionado,
              horario_inicio: slot.horario,
            }),
          })
        )
      )

      const falhas = resultados.filter(r => !r.ok && r.status !== 409)
      if (falhas.length > 0) {
        setErro(`${falhas.length} horário(s) não puderam ser criados.`)
      } else {
        setSlotsNovos([])
        setSucesso("Horários salvos com sucesso!")
        setTimeout(() => setSucesso(""), 3000)
        await carregarSlots()
      }
    } catch {
      setErro("Erro ao salvar horários.")
    } finally {
      setSalvando(false)
    }
  }

  function mesAnterior() {
    if (mesAtual === 0) { setMesAtual(11); setAnoAtual(a => a - 1) }
    else setMesAtual(m => m - 1)
  }

  function proximoMes() {
    if (mesAtual === 11) { setMesAtual(0); setAnoAtual(a => a + 1) }
    else setMesAtual(m => m + 1)
  }

  const dias = gerarDiasDoMes(anoAtual, mesAtual)
  const offset = primeiroDiaSemana(anoAtual, mesAtual)
  const slotsDoMes = slots.filter(s => {
    const d = s.data_disponivel.split("T")[0] ?? ""
    return d.startsWith(`${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}`)
  })
  const diasComSlots = [...new Set(slotsDoMes.map(s => s.data_disponivel.split("T")[0]))]

  const slotsDiaSelecionado = diaSelecionado ? slotsDoDia(diaSelecionado) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurar Horários</h1>
        <p className="text-muted-foreground">
          Clique em um dia para adicionar ou editar horários
        </p>
      </div>

      {/* Navegação do mês */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={mesAnterior}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">
              {meses[mesAtual]} {anoAtual}
            </h2>
            <Button variant="outline" size="icon" onClick={proximoMes}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Com horários</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border border-border bg-background" />
          <span>Sem horários</span>
        </div>
      </div>

      {/* Calendário */}
      {carregando ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            {/* Cabeçalho dias da semana */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {diasSemanaAbrev.map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Grid de dias */}
            <div className="grid grid-cols-7 gap-1">
              {/* Espaços vazios antes do primeiro dia */}
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {dias.map(data => {
                const temSlot = temSlots(data)
                const diaNum = Number(data.split("-")[2])
                const ehHoje = data === new Date().toISOString().split("T")[0]

                return (
                  <button
                    key={data}
                    onClick={() => abrirDia(data)}
                    className={`
                      relative flex flex-col items-center justify-center rounded-lg p-2 text-sm
                      transition-all hover:bg-accent hover:text-accent-foreground
                      ${ehHoje ? "border-2 border-primary font-bold" : "border border-transparent"}
                      ${diaSelecionado === data ? "bg-primary text-primary-foreground" : ""}
                    `}
                  >
                    <span>{diaNum}</span>
                    {temSlot && (
                      <div className={`mt-1 h-1.5 w-1.5 rounded-full ${diaSelecionado === data ? "bg-primary-foreground" : "bg-primary"}`} />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo do mês */}
      <div className="text-sm text-muted-foreground">
        {diasComSlots.length === 0
          ? "Nenhum horário configurado neste mês."
          : `${diasComSlots.length} dia(s) com horários em ${meses[mesAtual]}.`
        }
      </div>

      {/* Painel do dia — Dialog */}
      <Dialog open={painelAberto} onOpenChange={fecharPainel}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {diaSelecionado && formatarData(diaSelecionado)}
            </DialogTitle>
            <DialogDescription>
              Gerencie os horários disponíveis para este dia
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Feedback */}
            {erro && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {erro}
              </div>
            )}
            {sucesso && (
              <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700">
                {sucesso}
              </div>
            )}

            {/* Horários salvos */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Horários salvos
                {slotsDiaSelecionado.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {slotsDiaSelecionado.length}
                  </Badge>
                )}
              </p>

              {slotsDiaSelecionado.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum horário salvo para este dia.
                </p>
              )}

              {slotsDiaSelecionado.map(slot => (
                <div key={slot.id} className="flex items-center gap-2 rounded-lg border border-border p-2">
                  {editandoId === slot.id ? (
                    <>
                      <Select value={editandoHorario} onValueChange={setEditandoHorario}>
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {horariosDisponiveis.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-600 hover:text-green-700"
                        disabled={salvando}
                        onClick={() => salvarEdicao(slot.id)}
                      >
                        {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground"
                        onClick={cancelarEdicao}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 text-sm font-medium text-foreground">
                        {slot.horario_inicio.slice(0, 5)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => iniciarEdicao(slot)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        disabled={salvando}
                        onClick={() => deletarSlot(slot.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Novos horários */}
            {slotsNovos.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Novos horários</p>
                {slotsNovos.map(slot => (
                  <div key={slot.tempId} className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-2">
                    <Select
                      value={slot.horario}
                      onValueChange={(v) => atualizarSlotNovo(slot.tempId, v)}
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {horariosDisponiveis.map(h => (
                          <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className="text-xs text-primary">Novo</Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive ml-auto"
                      onClick={() => removerSlotNovo(slot.tempId)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={adicionarSlotNovo}
              >
                <Plus className="h-4 w-4" />
                Adicionar horário
              </Button>

              {slotsNovos.length > 0 && (
                <Button
                  size="sm"
                  className="gap-2 ml-auto"
                  disabled={salvando}
                  onClick={salvarNovos}
                >
                  {salvando
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Check className="h-4 w-4" />
                  }
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}