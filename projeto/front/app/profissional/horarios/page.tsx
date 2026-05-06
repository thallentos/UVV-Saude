"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Clock, Save, Plus, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const API_URL = "http://localhost:3000"

const diasSemana = [
  { id: 0, nome: "Domingo", abrev: "Dom" },
  { id: 1, nome: "Segunda-feira", abrev: "Seg" },
  { id: 2, nome: "Terça-feira", abrev: "Ter" },
  { id: 3, nome: "Quarta-feira", abrev: "Qua" },
  { id: 4, nome: "Quinta-feira", abrev: "Qui" },
  { id: 5, nome: "Sexta-feira", abrev: "Sex" },
  { id: 6, nome: "Sábado", abrev: "Sáb" },
]

const horariosDisponiveis = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00"
]

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

// Slot já salvo no banco
interface SlotSalvo {
  id: number
  profissional_id: number
  data_disponivel: string
  horario_inicio: string
  status_vaga: "LIVRE" | "OCUPADO"
}

// Slot local ainda não salvo
interface SlotLocal {
  tempId: string
  horario: string
}

// Estado por dia da semana
interface DiaSemanaState {
  ativo: boolean
  slotsSalvos: SlotSalvo[]
  slotsNovos: SlotLocal[]
  slotsParaDeletar: number[]
}

type AgendaSemana = Record<number, DiaSemanaState>

function estadoInicial(): AgendaSemana {
  const estado: AgendaSemana = {}
  diasSemana.forEach(d => {
    estado[d.id] = {
      ativo: false,
      slotsSalvos: [],
      slotsNovos: [],
      slotsParaDeletar: [],
    }
  })
  return estado
}

// Monta data no formato YYYY-MM-DD para um dia da semana dentro do mês/ano
function montarDatas(diaSemana: number, mes: number, ano: number): string[] {
  const datas: string[] = []
  const data = new Date(ano, mes, 1)
  while (data.getMonth() === mes) {
    if (data.getDay() === diaSemana) {
      const yyyy = data.getFullYear()
      const mm = String(data.getMonth() + 1).padStart(2, "0")
      const dd = String(data.getDate()).padStart(2, "0")
      datas.push(`${yyyy}-${mm}-${dd}`)
    }
    data.setDate(data.getDate() + 1)
  }
  return datas
}

export default function ConfigurarHorariosPage() {
  const [mesAtual, setMesAtual] = useState(() => new Date().getMonth())
  const [anoAtual, setAnoAtual] = useState(() => new Date().getFullYear())
  const [agenda, setAgenda] = useState<AgendaSemana>(estadoInicial())
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  function getToken(): string {
    return localStorage.getItem("token") ?? ""
  }

  const carregarAgenda = useCallback(async () => {
    setCarregando(true)
    setErro("")
    try {
      const res = await fetch(`${API_URL}/api/v1/agenda/minha`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error("Erro ao carregar agenda.")
      const slots: SlotSalvo[] = await res.json()

      // Filtra apenas os slots do mês/ano atual
      const novoEstado = estadoInicial()
      slots.forEach(slot => {
        const data = new Date(slot.data_disponivel + "T00:00:00")
        if (data.getMonth() === mesAtual && data.getFullYear() === anoAtual) {
          const diaSemana = data.getDay()
          novoEstado[diaSemana].ativo = true
          // Evita duplicar o mesmo horário
          const jaExiste = novoEstado[diaSemana].slotsSalvos.some(
            s => s.horario_inicio === slot.horario_inicio
          )
          if (!jaExiste) {
            novoEstado[diaSemana].slotsSalvos.push(slot)
          }
        }
      })
      setAgenda(novoEstado)
    } catch {
      setErro("Não foi possível carregar sua agenda.")
    } finally {
      setCarregando(false)
    }
  }, [mesAtual, anoAtual])

  useEffect(() => {
    carregarAgenda()
  }, [carregarAgenda])

  function toggleDia(diaId: number) {
    setAgenda(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        ativo: !prev[diaId].ativo,
        slotsNovos: !prev[diaId].ativo
          ? [{ tempId: crypto.randomUUID(), horario: "08:00" }]
          : prev[diaId].slotsNovos,
      }
    }))
  }

  function adicionarSlotNovo(diaId: number) {
    setAgenda(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        slotsNovos: [
          ...prev[diaId].slotsNovos,
          { tempId: crypto.randomUUID(), horario: "14:00" }
        ]
      }
    }))
  }

  function atualizarSlotNovo(diaId: number, tempId: string, horario: string) {
    setAgenda(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        slotsNovos: prev[diaId].slotsNovos.map(s =>
          s.tempId === tempId ? { ...s, horario } : s
        )
      }
    }))
  }

  function removerSlotNovo(diaId: number, tempId: string) {
    setAgenda(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        slotsNovos: prev[diaId].slotsNovos.filter(s => s.tempId !== tempId)
      }
    }))
  }

  function marcarParaDeletar(diaId: number, slotId: number) {
    setAgenda(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        slotsSalvos: prev[diaId].slotsSalvos.filter(s => s.id !== slotId),
        slotsParaDeletar: [...prev[diaId].slotsParaDeletar, slotId],
      }
    }))
  }

  async function salvar() {
    setSalvando(true)
    setErro("")
    setSucesso("")
    const token = getToken()

    try {
      // 1. Deletar slots marcados
      const deletPromises: Promise<Response>[] = []
      diasSemana.forEach(dia => {
        agenda[dia.id].slotsParaDeletar.forEach(id => {
          deletPromises.push(
            fetch(`${API_URL}/api/v1/agenda/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        })
      })
      await Promise.all(deletPromises)

      // 2. Criar novos slots para todas as datas do mês
      const criarPromises: Promise<Response>[] = []
      diasSemana.forEach(dia => {
        if (!agenda[dia.id].ativo) return
        const datas = montarDatas(dia.id, mesAtual, anoAtual)
        agenda[dia.id].slotsNovos.forEach(slot => {
          datas.forEach(data => {
            criarPromises.push(
              fetch(`${API_URL}/api/v1/agenda`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  data_disponivel: data,
                  horario_inicio: slot.horario,
                }),
              })
            )
          })
        })
      })

      const resultados = await Promise.all(criarPromises)
      const falhas = resultados.filter(r => !r.ok && r.status !== 409)
      if (falhas.length > 0) {
        setErro(`${falhas.length} slot(s) não puderam ser criados.`)
      } else {
        setSucesso("Agenda salva com sucesso!")
        await carregarAgenda()
      }
    } catch {
      setErro("Erro ao salvar agenda. Tente novamente.")
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

  if (carregando) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurar Horários</h1>
          <p className="text-muted-foreground">
            Defina sua disponibilidade para {meses[mesAtual]} de {anoAtual}
          </p>
        </div>
        <Button onClick={salvar} disabled={salvando} className="gap-2">
          {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      {erro && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {erro}
        </div>
      )}
      {sucesso && (
        <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-700">
          {sucesso}
        </div>
      )}

      {/* Seletor de Mês */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={mesAnterior}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">
                {meses[mesAtual]} {anoAtual}
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure os horários para este mês
              </p>
            </div>
            <Button variant="outline" size="icon" onClick={proximoMes}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuração por Dia da Semana */}
      <div className="space-y-4">
        {diasSemana.map((dia) => {
          const estado = agenda[dia.id]
          const totalSlots = estado.slotsSalvos.length + estado.slotsNovos.length
          return (
            <Card key={dia.id} className={!estado.ativo ? "opacity-60" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={estado.ativo}
                      onCheckedChange={() => toggleDia(dia.id)}
                      id={`dia-${dia.id}`}
                    />
                    <Label htmlFor={`dia-${dia.id}`} className="cursor-pointer">
                      <CardTitle className="text-base">{dia.nome}</CardTitle>
                    </Label>
                  </div>
                  {estado.ativo && (
                    <Badge variant="secondary">{totalSlots} horário(s)</Badge>
                  )}
                </div>
              </CardHeader>

              {estado.ativo && (
                <CardContent className="space-y-3 pt-0">
                  {/* Slots já salvos no banco */}
                  {estado.slotsSalvos.map(slot => (
                    <div key={slot.id} className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="w-24 rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground">
                        {slot.horario_inicio.slice(0, 5)}
                      </span>
                      <Badge variant="secondary" className="text-xs">Salvo</Badge>
                      {slot.status_vaga === "LIVRE" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => marcarParaDeletar(dia.id, slot.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {slot.status_vaga === "OCUPADO" && (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">Ocupado</Badge>
                      )}
                    </div>
                  ))}

                  {/* Slots novos ainda não salvos */}
                  {estado.slotsNovos.map(slot => (
                    <div key={slot.tempId} className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Select
                        value={slot.horario}
                        onValueChange={(v) => atualizarSlotNovo(dia.id, slot.tempId, v)}
                      >
                        <SelectTrigger className="w-24">
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
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removerSlotNovo(dia.id, slot.tempId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => adicionarSlotNovo(dia.id)}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Horário
                  </Button>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo da Disponibilidade</CardTitle>
          <CardDescription>
            Dias ativos em {meses[mesAtual]}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diasSemana.filter(d => agenda[d.id].ativo).map(dia => {
              const total = agenda[dia.id].slotsSalvos.length + agenda[dia.id].slotsNovos.length
              return (
                <div key={dia.id} className="rounded-lg border border-border p-3">
                  <p className="font-medium text-foreground">{dia.abrev}</p>
                  <p className="text-sm text-muted-foreground">{total} horário(s) configurado(s)</p>
                </div>
              )
            })}
            {diasSemana.every(d => !agenda[d.id].ativo) && (
              <p className="text-sm text-muted-foreground">Nenhum dia ativo ainda.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}