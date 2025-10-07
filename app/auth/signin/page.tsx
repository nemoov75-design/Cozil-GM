"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Lock, AlertCircle } from "lucide-react"

// Usuários cadastrados (mesmos do NextAuth)
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

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Verificar credenciais
      const user = users.find(u => 
        u.email === email && 
        u.password === password
      )

      if (user) {
        // Salvar usuário no localStorage (como o sistema espera)
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ef4444&color=fff`
        }
        
        localStorage.setItem('user', JSON.stringify(userData))
        
        // Redirecionar para a página inicial
        router.push("/")
        router.refresh()
      } else {
        setError("Email ou senha incorretos")
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">CozilTech</CardTitle>
          <CardDescription>
            Sistema de Gestão de Manutenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@cozil.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Credenciais de Teste:</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div><strong>Admin:</strong> admin@cozil.com / admin123</div>
              <div><strong>Técnico:</strong> tecnico@cozil.com / tecnico123</div>
              <div><strong>Gestor:</strong> gestor@cozil.com / gestor123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
