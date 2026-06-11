import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rotasPublicas = ['/login', '/cadastro', '/']

const rotasPorPerfil: Record<string, string> = {
  '/cliente': 'PACIENTE',
  '/profissional': 'PROFISSIONAL',
  '/admin': 'ADMIN',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas passam direto
  if (rotasPublicas.some(r => pathname === r)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value
  const tipoUsuario = request.cookies.get('tipo_usuario')?.value

  // Sem token → login
  if (!token || !tipoUsuario) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verifica permissão por prefixo de rota
  for (const [prefixo, perfil] of Object.entries(rotasPorPerfil)) {
    if (pathname.startsWith(prefixo) && tipoUsuario !== perfil) {
      // Redireciona para a área correta do perfil logado
      if (tipoUsuario === 'PACIENTE') {
        return NextResponse.redirect(new URL('/cliente', request.url))
      }
      if (tipoUsuario === 'PROFISSIONAL') {
        return NextResponse.redirect(new URL('/profissional', request.url))
      }
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)',
  ],
}