import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Usuários cadastrados (em produção, use um banco de dados)
const users = [
  {
    id: '1',
    email: 'admin@cozil.com',
    password: 'admin123',
    name: 'Administrador Cozil',
    role: 'admin'
  },
  {
    id: '2', 
    email: 'tecnico@cozil.com',
    password: 'tecnico123',
    name: 'Técnico Cozil',
    role: 'tecnico'
  },
  {
    id: '3',
    email: 'gestor@cozil.com', 
    password: 'gestor123',
    name: 'Gestor Cozil',
    role: 'gestor'
  }
]

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 Tentativa de login:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Credenciais vazias')
          return null
        }

        // Verificar se as credenciais estão corretas
        const user = users.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password
        )

        console.log('👤 Usuário encontrado:', user ? 'Sim' : 'Não')
        console.log('📧 Email recebido:', credentials.email)
        console.log('🔑 Senha recebida:', credentials.password)

        if (user) {
          console.log('✅ Login bem-sucedido:', user.name)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ef4444&color=fff`
          }
        }

        console.log('❌ Login falhou - credenciais inválidas')
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET || 'cozil-secret-key-2025',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
