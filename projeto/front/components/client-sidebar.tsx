"use client"

import { useEffect, useState } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Calendar,
  CalendarCheck,
  Home,
  LogOut,
  User,
  Heart,
  Menu,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { logout, getToken } from "@/lib/auth"

const menuItems = [
  { title: "Home", href: "/cliente", icon: Home },
  { title: "Criar Consulta", href: "/cliente/agendar", icon: Calendar },
  { title: "Agendamentos", href: "/cliente/agendamentos", icon: CalendarCheck },
  { title: "Meu Perfil", href: "/cliente/perfil", icon: User },
]

interface UsuarioMe {
  id: number
  nome: string
  email: string
  telefone: string | null
  tipo_usuario: string
}

export function ClientSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [usuario, setUsuario] = useState<UsuarioMe | null>(null)

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = getToken()

        if (!token) {
          logout()
          return
        }

        const response = await fetch("http://localhost:3000/api/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.status === 401) {
          logout()
          return
        }

        if (!response.ok) {
          throw new Error("Erro ao carregar usuário")
        }

        const data = await response.json()
        setUsuario(data)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
      }
    }

    carregarUsuario()
  }, [])

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-200 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">UVV Health</h1>
            <p className="text-xs text-muted-foreground">Portal do Cliente</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.title}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-accent p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {usuario?.nome
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-foreground">
                {usuario?.nome}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {usuario?.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}