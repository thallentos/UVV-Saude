"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Camera, Save, Bell, Shield, User, Clock, Plus, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"

const horariosDisponiveis = [
  { dia: "Segunda-feira", horarios: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"] },
  { dia: "Terça-feira", horarios: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"] },
  { dia: "Quarta-feira", horarios: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"] },
  { dia: "Quinta-feira", horarios: ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"] },
  { dia: "Sexta-feira", horarios: ["08:00", "09:00", "10:00", "14:00", "15:00"] },
]

export default function PerfilProfissional() {
  const [salvando, setSalvando] = useState(false)

  const handleSalvar = async () => {
    setSalvando(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSalvando(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Meu Perfil Profissional
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie suas informações profissionais e configurações de atendimento.
        </p>
      </div>

      <Tabs defaultValue="profissional" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profissional" className="gap-2">
            <User className="h-4 w-4" />
            Dados Profissionais
          </TabsTrigger>
          <TabsTrigger value="horarios" className="gap-2">
            <Clock className="h-4 w-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profissional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>
                Sua foto será exibida para os pacientes ao buscar profissionais.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-user.jpg" alt="Dra. Ana Costa" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">AC</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Alterar Foto
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou GIF. Máximo 2MB.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Profissionais</CardTitle>
              <CardDescription>
                Dados que serão exibidos no seu perfil público.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" defaultValue="Dra. Ana Paula Costa" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registro">Registro Profissional (CRN)</Label>
                  <Input id="registro" defaultValue="CRN-4 12345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Input id="especialidade" defaultValue="Nutricionista Clínica" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor da Consulta</Label>
                  <Input id="valor" defaultValue="R$ 180,00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Profissional</Label>
                  <Input id="email" type="email" defaultValue="ana.costa@uvvhealth.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" defaultValue="(27) 99999-1234" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="local">Local de Atendimento</Label>
                <Input id="local" defaultValue="Sala 205 - Bloco B - UVV Campus Boa Vista" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Descreva sua formação, experiência e áreas de atuação..."
                  className="min-h-[100px]"
                  defaultValue="Nutricionista formada pela UVV com especialização em Nutrição Clínica e Esportiva. Atuo há 8 anos na área, com foco em reeducação alimentar, emagrecimento saudável e nutrição para atletas."
                />
              </div>

              <div className="space-y-2">
                <Label>Áreas de Atuação</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    Reeducação Alimentar
                    <button className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    Nutrição Esportiva
                    <button className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    Emagrecimento
                    <button className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                  <Button variant="outline" size="sm" className="h-6 gap-1 text-xs">
                    <Plus className="h-3 w-3" />
                    Adicionar
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSalvar} disabled={salvando} className="gap-2">
                  <Save className="h-4 w-4" />
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Atendimento</CardTitle>
              <CardDescription>
                Configure os horários em que você está disponível para consultas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {horariosDisponiveis.map((dia) => (
                <div key={dia.dia} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">{dia.dia}</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dia.horarios.map((horario) => (
                      <Badge
                        key={horario}
                        variant="secondary"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      >
                        {horario}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-6 gap-1 text-xs">
                      <Plus className="h-3 w-3" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end border-t border-border pt-4">
                <Button onClick={handleSalvar} disabled={salvando} className="gap-2">
                  <Save className="h-4 w-4" />
                  {salvando ? "Salvando..." : "Salvar Horários"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bloqueio de Agenda</CardTitle>
              <CardDescription>
                Bloqueie datas específicas em que você não poderá atender.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Bloqueio
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Escolha como deseja receber alertas sobre suas consultas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Novas Solicitações</p>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas quando pacientes solicitarem agendamento
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Lembretes de Consulta</p>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes 1h antes de cada consulta
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Cancelamentos</p>
                  <p className="text-sm text-muted-foreground">
                    Seja notificado quando um paciente cancelar
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Resumo Diário</p>
                  <p className="text-sm text-muted-foreground">
                    Receba um resumo da sua agenda do dia às 7h
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notificações por SMS</p>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações importantes por SMS
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senha-atual">Senha Atual</Label>
                <Input id="senha-atual" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nova-senha">Nova Senha</Label>
                <Input id="nova-senha" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
                <Input id="confirmar-senha" type="password" />
              </div>
              <Button>Alterar Senha</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Autenticação em Duas Etapas</CardTitle>
              <CardDescription>
                Adicione uma camada extra de segurança à sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Proteja sua conta com verificação por SMS ou aplicativo autenticador.
                </p>
              </div>
              <Button variant="outline">Configurar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessões Ativas</CardTitle>
              <CardDescription>
                Gerencie os dispositivos conectados à sua conta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Este dispositivo</p>
                  <p className="text-sm text-muted-foreground">Chrome no Windows - Ativo agora</p>
                </div>
                <Badge className="bg-success/10 text-success">Atual</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">MacBook Pro</p>
                  <p className="text-sm text-muted-foreground">Safari no macOS - Há 1 dia</p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive">
                  Encerrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
