"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, User, Stethoscope, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UserType = "paciente" | "profissional" | null

export default function CadastroPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserType>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    telefone: "",
    matricula: "",
    sexo: "",
    especialidade_id: "",
    registro_prof: "",
    bio: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!userType) {
      setError("Selecione o tipo de usuário.")
      return
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.")
      return
    }

    try {
      setLoading(true)

      const payload =
        userType === "paciente"
          ? {
              nome: formData.nome,
              email: formData.email,
              senha: formData.senha,
              cpf: formData.cpf,
              tipo_usuario: "PACIENTE",
              telefone: formData.telefone,
              matricula: formData.matricula,
            }
          : {
              nome: formData.nome,
              email: formData.email,
              senha: formData.senha,
              cpf: formData.cpf,
              tipo_usuario: "PROFISSIONAL",
              telefone: formData.telefone,
              matricula: formData.matricula,
              especialidade_id: Number(formData.especialidade_id),
              registro_prof: formData.registro_prof,
              bio: formData.bio,
            }

      const response = await fetch("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta.")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", JSON.stringify(data.usuario))

      if (data.usuario.tipo_usuario === "PACIENTE") {
        router.push("/cliente")
      } else {
        router.push("/profissional")
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao criar conta.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">UVV Health</span>
          </Link>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
            Já tem conta? Entrar
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              {step === 1 ? "Escolha o tipo de conta" : "Preencha seus dados"}
            </CardDescription>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
              <div className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            </div>
          </CardHeader>

          <CardContent>
            {step === 1 ? (
              <div className="space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Você é um profissional de saúde ou um paciente?
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setUserType("paciente")}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-primary ${
                      userType === "paciente" ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${
                        userType === "paciente"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <User className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">Paciente</p>
                      <p className="text-xs text-muted-foreground">Agendar consultas</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserType("profissional")}
                    className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-primary ${
                      userType === "profissional" ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${
                        userType === "profissional"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Stethoscope className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">Profissional</p>
                      <p className="text-xs text-muted-foreground">Gerenciar atendimentos</p>
                    </div>
                  </button>
                </div>

                <Button className="mt-6 w-full" disabled={!userType} onClick={() => setStep(2)}>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    placeholder="Seu nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    placeholder="12345678901"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange("cpf", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      placeholder="27999990000"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange("telefone", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="matricula">Matrícula</Label>
                    <Input
                      id="matricula"
                      placeholder={userType === "paciente" ? "M01" : "P01"}
                      value={formData.matricula}
                      onChange={(e) => handleInputChange("matricula", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {userType === "profissional" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="especialidade_id">Especialidade</Label>
                      <Select
                        value={formData.especialidade_id}
                        onValueChange={(v) => handleInputChange("especialidade_id", v)}
                      >
                        <SelectTrigger id="especialidade_id">
                          <SelectValue placeholder="Selecione sua especialidade" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Psicólogo(a)</SelectItem>
                          <SelectItem value="2">Nutricionista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registro_prof">Registro profissional</Label>
                      <Input
                        id="registro_prof"
                        placeholder="CRP-01"
                        value={formData.registro_prof}
                        onChange={(e) => handleInputChange("registro_prof", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        placeholder="Psicólogo"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Repita a senha"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>

                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}