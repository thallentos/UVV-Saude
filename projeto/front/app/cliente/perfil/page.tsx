"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Save, Bell, Shield, User } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function PerfilCliente() {
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
          Meu Perfil
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie suas informações pessoais e preferências.
        </p>
      </div>

      <Tabs defaultValue="pessoal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pessoal" className="gap-2">
            <User className="h-4 w-4" />
            Dados Pessoais
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="gap-2">
            <Bell className="h-4 w-4" />
            Notificacoes
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="gap-2">
            <Shield className="h-4 w-4" />
            Seguranca
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pessoal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>
                Sua foto sera exibida para os profissionais de saude.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-user.jpg" alt="Maria Oliveira" />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">MO</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" className="gap-2">
                  <Camera className="h-4 w-4" />
                  Alterar Foto
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou GIF. Maximo 2MB.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informacoes Pessoais</CardTitle>
              <CardDescription>
                Mantenha seus dados atualizados para melhor atendimento.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" defaultValue="Maria Oliveira Santos" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" defaultValue="123.456.789-00" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" defaultValue="maria@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" defaultValue="(27) 99999-8888" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nascimento">Data de Nascimento</Label>
                  <Input id="nascimento" type="date" defaultValue="1990-05-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genero">Genero</Label>
                  <Input id="genero" defaultValue="Feminino" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereco</Label>
                <Input id="endereco" defaultValue="Av. Principal, 123 - Vila Velha, ES" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Informacoes Medicas Relevantes</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Alergias, condicoes cronicas, medicamentos em uso..."
                  className="min-h-[100px]"
                  defaultValue="Alergia a dipirona. Uso continuo de anticoncepcional."
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSalvar} disabled={salvando} className="gap-2">
                  <Save className="h-4 w-4" />
                  {salvando ? "Salvando..." : "Salvar Alteracoes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificacao</CardTitle>
              <CardDescription>
                Escolha como deseja receber lembretes e atualizacoes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Lembretes de Consulta</p>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes 24h e 1h antes da consulta
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Confirmacao por E-mail</p>
                  <p className="text-sm text-muted-foreground">
                    Receba confirmacoes de agendamento por e-mail
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notificacoes por SMS</p>
                  <p className="text-sm text-muted-foreground">
                    Receba notificacoes importantes por SMS
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Novidades e Promocoes</p>
                  <p className="text-sm text-muted-foreground">
                    Receba informacoes sobre novos servicos e promocoes
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
              <CardTitle>Sessoes Ativas</CardTitle>
              <CardDescription>
                Gerencie os dispositivos conectados a sua conta.
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
                  <p className="font-medium text-foreground">iPhone 14</p>
                  <p className="text-sm text-muted-foreground">Safari no iOS - Ha 2 dias</p>
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

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}
