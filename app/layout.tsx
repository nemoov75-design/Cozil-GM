import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import AuthProvider from '@/components/auth-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cozil - Sistema de Gestão de Manutenção',
  description: 'Sistema completo de gestão de ordens de serviço e manutenção',
  generator: 'Cozil',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
