"use client"

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
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"

const menuItems = [
  {
    title: "Home",
    href: "/cliente",
    icon: Home,
  },
  {
    title: "Criar Consulta",
    href: "/cliente/agendar",
    icon: Calendar,
  },
  {
    title: "Agendamentos",
    href: "/cliente/agendamentos",
    icon: CalendarCheck,
  },
  {
    title: "Meu Perfil",
    href: "/cliente/perfil",
    icon: User,
  },
]

export function ClientSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-sidebar-foreground">UVV Health</h1>
          <p className="text-xs text-muted-foreground">Portal do Cliente</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-user.jpg" alt="Cliente" />
            <AvatarFallback className="bg-primary/10 text-primary">MO</AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              Maria Oliveira
            </p>
            <p className="truncate text-xs text-muted-foreground">
              maria@email.com
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-3 w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
