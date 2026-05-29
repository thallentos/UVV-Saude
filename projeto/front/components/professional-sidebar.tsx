"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  CalendarClock,
  ClipboardList,
  LogOut,
  User,
  Menu,
  Home,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { logout, getToken } from "@/lib/auth"
import { getInitials } from "@/lib/utils"
import { API_URL } from "@/lib/api"

const navItems = [
  { href: "/profissional", label: "Home", icon: Home },
  { href: "/profissional/horarios", label: "Configurar Horários", icon: CalendarClock },
  { href: "/profissional/agendamentos", label: "Agendamentos", icon: CalendarDays },
  { href: "/profissional/solicitacoes", label: "Solicitações", icon: ClipboardList },
  { href: "/profissional/perfil", label: "Meu Perfil", icon: User },
]

interface UsuarioMe {
  id: number
  nome: string
  email: string
}

export function ProfessionalSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [usuario, setUsuario] = useState<UsuarioMe | null>(null)

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = getToken()
        if (!token) return

        const res = await fetch(`${API_URL}/api/v1/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) return

        const data = await res.json()
        setUsuario(data)
      } catch {
        // silencioso
      }
    }

    carregarUsuario()
  }, [])

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-200 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <Image
            src="/logouvv.png"
            alt="UVV Saúde"
            width={300}
            height={120}
            className="h-auto w-auto max-h-10 max-w-[42px] object-contain"
            priority
          />

          <div>
            <h1 className="font-semibold text-foreground">UVV Saúde</h1>
            <p className="text-xs text-muted-foreground">
              Portal do Profissional
            </p>
          </div>
        </div>

        <nav
          className="flex flex-1 flex-col gap-1 px-3 py-4"
          role="navigation"
          aria-label="Menu do profissional"
        >
          {navItems.map((item) => {
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
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4 space-y-3">
          {usuario && (
            <div className="flex items-center gap-3 rounded-lg bg-accent p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(usuario.nome)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium text-foreground">
                  {usuario.nome}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {usuario.email}
                </p>
              </div>
            </div>
          )}

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