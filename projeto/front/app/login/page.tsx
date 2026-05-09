"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [formData, setFormData] = useState({ email: "", senha: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")
    setCarregando(true)

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, senha: formData.senha }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErro(data.message || "E-mail ou senha incorretos.")
        return
      }

      // Salva no localStorage
      localStorage.setItem("token", data.token)
      localStorage.setItem("usuario", JSON.stringify(data.usuario))

      // Salva cookies para o middleware conseguir ler
      const expires = new Date()
      expires.setDate(expires.getDate() + 7)
      document.cookie = `auth_token=${data.token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
      document.cookie = `tipo_usuario=${data.usuario.tipo_usuario}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`

      if (data.usuario.tipo_usuario === "PACIENTE") {
        router.push("/cliente")
      } else if (data.usuario.tipo_usuario === "PROFISSIONAL") {
        router.push("/profissional")
      } else {
        router.push("/admin")
      }
    } catch {
      setErro("Erro ao conectar com o servidor.")
    } finally {
      setCarregando(false)
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
          <Link href="/cadastro" className="text-sm text-muted-foreground hover:text-primary">
            Criar conta
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha">Senha</Label>
                </div>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={formData.senha}
                    onChange={e => setFormData({ ...formData, senha: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {erro && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {erro}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-primary hover:underline">
                  Criar conta
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}