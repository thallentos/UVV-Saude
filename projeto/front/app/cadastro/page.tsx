"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, User, Stethoscope, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UserType = "paciente" | "profissional" | null

export default function CadastroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserType>(null)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    idade: "",
    sexo: "",
    especialidade: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular cadastro
    if (userType === "paciente") {
      router.push("/cliente")
    } else {
      router.push("/profissional")
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
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

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              {step === 1 ? "Escolha o tipo de conta" : "Preencha seus dados"}
            </CardDescription>
            {/* Progress */}
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
                      userType === "paciente"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
                      userType === "paciente" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
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
                      userType === "profissional"
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
                      userType === "profissional" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      <Stethoscope className="h-7 w-7" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">Profissional</p>
                      <p className="text-xs text-muted-foreground">Gerenciar atendimentos</p>
                    </div>
                  </button>
                </div>

                <Button
                  className="mt-6 w-full"
                  disabled={!userType}
                  onClick={() => setStep(2)}
                >
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      type="number"
                      placeholder="25"
                      value={formData.idade}
                      onChange={(e) => handleInputChange("idade", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select value={formData.sexo} onValueChange={(v) => handleInputChange("sexo", v)}>
                      <SelectTrigger id="sexo">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {userType === "profissional" && (
                  <div className="space-y-2">
                    <Label htmlFor="especialidade">Especialidade</Label>
                    <Select value={formData.especialidade} onValueChange={(v) => handleInputChange("especialidade", v)}>
                      <SelectTrigger id="especialidade">
                        <SelectValue placeholder="Selecione sua especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nutricionista">Nutricionista</SelectItem>
                        <SelectItem value="psicologo">Psicólogo(a)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Repita a senha"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button type="submit" className="flex-1">
                    Criar Conta
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
