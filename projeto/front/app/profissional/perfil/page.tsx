"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Bell, Shield, User, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { getToken, logout } from "@/lib/auth"

const API_URL = "http://localhost:3000"

interface ProfissionalMe {
  id: number
  nome: string
  email: string
  cpf: string
  tipo_usuario: string
  telefone: string | null
  matricula: string | null
  foto_url: string | null
  created_at: string
  bio: string | null
  registro_prof: string | null
  especialidade_id: number | null
  especialidade_nome: string | null
}

function getInitials(nome: string): string {
  return nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

export default function PerfilProfissional() {
  const [usuario, setUsuario] = useState<ProfissionalMe | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [fotoUrl, setFotoUrl] = useState("")
  const [bio, setBio] = useState("")

  const [senhaAtual, setSenhaAtual] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [salvandoSenha, setSalvandoSenha] = useState(false)
  const [erroSenha, setErroSenha] = useState("")
  const [sucessoSenha, setSucessoSenha] = useState("")

  useEffect(() => {
    async function carregarPerfil() {
      try {
        const res = await fetch(`${API_URL}/api/v1/me`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        if (res.status === 401) { logout(); return }
        if (!res.ok) throw new Error()
        const data: ProfissionalMe = await res.json()
        setUsuario(data)
        setNome(data.nome)
        setEmail(data.email)
        setTelefone(data.telefone ?? "")
        setFotoUrl(data.foto_url ?? "")
        setBio(data.bio ?? "")
      } catch {
        setErro("Não foi possível carregar seus dados.")
      } finally {
        setCarregando(false)
      }
    }
    carregarPerfil()
  }, [])

  async function salvarPerfil() {
    setSalvando(true)
    setErro("")
    setSucesso("")
    try {
      const res = await fetch(`${API_URL}/api/v1/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          nome: nome || undefined,
          email: email || undefined,
          telefone: telefone || undefined,
          foto_url: fotoUrl || undefined,
          bio: bio || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Erro ao salvar.")
      setUsuario(data)
      localStorage.setItem("usuario", JSON.stringify({
        id: data.id,
        nome: data.nome,
        email: data.email,
        tipo_usuario: data.tipo_usuario,
      }))
      setSucesso("Perfil atualizado com sucesso!")
      setTimeout(() => setSucesso(""), 3000)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar perfil.")
    } finally {
      setSalvando(false)
    }
  }

  async function alterarSenha() {
    setErroSenha("")
    setSucessoSenha("")
    if (novaSenha !== confirmarSenha) {
      setErroSenha("As senhas não coincidem.")
      return
    }
    setSalvandoSenha(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/me/senha`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Erro ao alterar senha.")
      setSucessoSenha("Senha alterada com sucesso!")
      setSenhaAtual("")
      setNovaSenha("")
      setConfirmarSenha("")
      setTimeout(() => setSucessoSenha(""), 3000)
    } catch (e: unknown) {
      setErroSenha(e instanceof Error ? e.message : "Erro ao alterar senha.")
    } finally {
      setSalvandoSenha(false)
    }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Meu Perfil Profissional</h1>
        <p className="mt-1 text-muted-foreground">Gerencie suas informações profissionais.</p>
      </div>

      <Tabs defaultValue="profissional" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profissional" className="gap-2">
            <User className="h-4 w-4" />
            Dados Profissionais
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

        {/* Dados Profissionais */}
        <TabsContent value="profissional" className="space-y-6">
          {/* Avatar */}
          <Card>
            <CardContent className="flex items-center gap-6 p-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {usuario ? getInitials(usuario.nome) : "??"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-semibold text-foreground text-lg">{usuario?.nome}</p>
                <p className="text-sm text-muted-foreground">{usuario?.especialidade_nome}</p>
                {usuario?.registro_prof && (
                  <Badge variant="secondary">{usuario.registro_prof}</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Profissionais</CardTitle>
              <CardDescription>Dados exibidos para os pacientes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registro">Registro Profissional</Label>
                  <Input id="registro" value={usuario?.registro_prof ?? ""} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Input id="especialidade" value={usuario?.especialidade_nome ?? ""} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value={telefone} onChange={e => setTelefone(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foto_url">URL da Foto de Perfil</Label>
                <Input
                  id="foto_url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={fotoUrl}
                  onChange={e => setFotoUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Descreva sua formação e áreas de atuação..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={salvarPerfil} disabled={salvando} className="gap-2">
                  {salvando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notificações */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Escolha como deseja receber alertas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "Novas Solicitações", desc: "Alertas quando pacientes solicitarem agendamento" },
                { label: "Lembretes de Consulta", desc: "Lembretes antes de cada consulta" },
                { label: "Cancelamentos", desc: "Notificações quando um paciente cancelar" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segurança */}
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Mantenha sua conta segura.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {erroSenha && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {erroSenha}
                </div>
              )}
              {sucessoSenha && (
                <div className="rounded-lg border border-green-500/50 bg-green-500/10 px-3 py-2 text-sm text-green-700">
                  {sucessoSenha}
                </div>
              )}
              <div className="space-y-2">
                <Label>Senha Atual</Label>
                <Input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nova Senha</Label>
                <Input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Nova Senha</Label>
                <Input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} />
              </div>
              <Button
                onClick={alterarSenha}
                disabled={salvandoSenha || !senhaAtual || !novaSenha || !confirmarSenha}
                className="gap-2"
              >
                {salvandoSenha ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {salvandoSenha ? "Alterando..." : "Alterar Senha"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}