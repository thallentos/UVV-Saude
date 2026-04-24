"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Clock, Save, Plus, Trash2 } from "lucide-react"
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

type HorarioDia = {
  ativo: boolean
  periodos: { inicio: string; fim: string }[]
}

type HorariosSemana = Record<number, HorarioDia>

export default function ConfigurarHorariosPage() {
  const [mesAtual, setMesAtual] = useState(3) // Abril
  const [anoAtual, setAnoAtual] = useState(2026)
  const [horarios, setHorarios] = useState<HorariosSemana>({
    0: { ativo: false, periodos: [] },
    1: { ativo: true, periodos: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
    2: { ativo: true, periodos: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
    3: { ativo: true, periodos: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
    4: { ativo: true, periodos: [{ inicio: "08:00", fim: "12:00" }, { inicio: "14:00", fim: "18:00" }] },
    5: { ativo: true, periodos: [{ inicio: "08:00", fim: "12:00" }] },
    6: { ativo: false, periodos: [] },
  })

  const toggleDia = (diaId: number) => {
    setHorarios(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        ativo: !prev[diaId].ativo,
        periodos: !prev[diaId].ativo ? [{ inicio: "08:00", fim: "12:00" }] : prev[diaId].periodos
      }
    }))
  }

  const adicionarPeriodo = (diaId: number) => {
    setHorarios(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        periodos: [...prev[diaId].periodos, { inicio: "14:00", fim: "18:00" }]
      }
    }))
  }

  const removerPeriodo = (diaId: number, periodoIndex: number) => {
    setHorarios(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        periodos: prev[diaId].periodos.filter((_, i) => i !== periodoIndex)
      }
    }))
  }

  const atualizarPeriodo = (diaId: number, periodoIndex: number, campo: "inicio" | "fim", valor: string) => {
    setHorarios(prev => ({
      ...prev,
      [diaId]: {
        ...prev[diaId],
        periodos: prev[diaId].periodos.map((p, i) => 
          i === periodoIndex ? { ...p, [campo]: valor } : p
        )
      }
    }))
  }

  const mesAnterior = () => {
    if (mesAtual === 0) {
      setMesAtual(11)
      setAnoAtual(prev => prev - 1)
    } else {
      setMesAtual(prev => prev - 1)
    }
  }

  const proximoMes = () => {
    if (mesAtual === 11) {
      setMesAtual(0)
      setAnoAtual(prev => prev + 1)
    } else {
      setMesAtual(prev => prev + 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurar Horários</h1>
          <p className="text-muted-foreground">
            Defina sua disponibilidade mensal para atendimentos
          </p>
        </div>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

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
        {diasSemana.map((dia) => (
          <Card key={dia.id} className={!horarios[dia.id].ativo ? "opacity-60" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={horarios[dia.id].ativo}
                    onCheckedChange={() => toggleDia(dia.id)}
                    id={`dia-${dia.id}`}
                  />
                  <Label htmlFor={`dia-${dia.id}`} className="cursor-pointer">
                    <CardTitle className="text-base">{dia.nome}</CardTitle>
                  </Label>
                </div>
                {horarios[dia.id].ativo && (
                  <Badge variant="secondary">
                    {horarios[dia.id].periodos.length} período(s)
                  </Badge>
                )}
              </div>
            </CardHeader>

            {horarios[dia.id].ativo && (
              <CardContent className="space-y-4 pt-0">
                {horarios[dia.id].periodos.map((periodo, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-1 items-center gap-2">
                      <Select
                        value={periodo.inicio}
                        onValueChange={(v) => atualizarPeriodo(dia.id, index, "inicio", v)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {horariosDisponiveis.map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">até</span>
                      <Select
                        value={periodo.fim}
                        onValueChange={(v) => atualizarPeriodo(dia.id, index, "fim", v)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {horariosDisponiveis.map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {horarios[dia.id].periodos.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removerPeriodo(dia.id, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => adicionarPeriodo(dia.id)}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Período
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumo da Disponibilidade</CardTitle>
          <CardDescription>
            Visão geral dos seus horários configurados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diasSemana.filter(d => horarios[d.id].ativo).map((dia) => (
              <div key={dia.id} className="rounded-lg border border-border p-3">
                <p className="font-medium text-foreground">{dia.abrev}</p>
                <div className="mt-1 space-y-1">
                  {horarios[dia.id].periodos.map((p, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {p.inicio} - {p.fim}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
