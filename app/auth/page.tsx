"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, AlertCircle, Mail, Phone, Briefcase, Building2, Wrench, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // Estados do Login
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Estados do Cadastro
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    setor: "",
    cargo: "",
    telefone: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/users')
      const { users } = await response.json()
      
      const user = users.find((u: any) => 
        u.email === loginEmail && 
        u.password === loginPassword &&
        u.active === true
      )

      if (user) {
        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.cargo || 'user',
          setor: user.setor,
          telefone: user.telefone,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ef4444&color=fff`
        }
        
        localStorage.setItem('user', JSON.stringify(userData))
        router.push("/")
        router.refresh()
      } else {
        setError("Email ou senha incorretos, ou usuário inativo")
      }
    } catch (error) {
      setError("Erro ao fazer login. Tente novamente.")
      console.error('Erro no login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validações
    if (signupData.password !== signupData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (signupData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          setor: signupData.setor,
          cargo: signupData.cargo,
          telefone: signupData.telefone,
          receive_notifications: true,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("Cadastro realizado com sucesso! Redirecionando...")
        
        // Fazer login automático
        setTimeout(() => {
          setLoginEmail(signupData.email)
          setLoginPassword(signupData.password)
          setActiveTab("login")
          setSuccess("")
        }, 2000)
      } else {
        setError(data.error || "Erro ao criar conta")
      }
    } catch (error) {
      setError("Erro ao criar conta. Tente novamente.")
      console.error('Erro no cadastro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-100/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-red-100/30 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-0 shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
            >
              <Wrench className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
              CozilTech
            </CardTitle>
            <CardDescription className="text-base">
              Sistema de Gestão de Manutenção
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Cadastro
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="login" key="login">
                  <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    {error && (
                      <Alert variant="destructive" className="animate-shake">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-red-500" />
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-red-500" />
                        Senha
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Digite sua senha"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </motion.form>
                </TabsContent>

                <TabsContent value="signup" key="signup">
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSignup}
                    className="space-y-4"
                  >
                    {error && (
                      <Alert variant="destructive" className="animate-shake">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {success && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">{success}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-red-500" />
                        Nome Completo
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="João Silva"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        required
                        disabled={isLoading}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-red-500" />
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                        disabled={isLoading}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-red-500" />
                          Senha
                        </Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          required
                          disabled={isLoading}
                          className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm" className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-red-500" />
                          Confirmar
                        </Label>
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="Repita a senha"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          required
                          disabled={isLoading}
                          className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-setor" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-red-500" />
                        Setor
                      </Label>
                      <Select
                        value={signupData.setor}
                        onValueChange={(value) => setSignupData({ ...signupData, setor: value })}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                          <SelectValue placeholder="Selecione o setor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TI">TI</SelectItem>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                          <SelectItem value="Produção">Produção</SelectItem>
                          <SelectItem value="Gestão">Gestão</SelectItem>
                          <SelectItem value="Administrativo">Administrativo</SelectItem>
                          <SelectItem value="Restaurante">Restaurante</SelectItem>
                          <SelectItem value="T.I.">T.I.</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-cargo" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-red-500" />
                        Cargo
                      </Label>
                      <Input
                        id="signup-cargo"
                        type="text"
                        placeholder="Ex: Técnico, Gerente, Administrador"
                        value={signupData.cargo}
                        onChange={(e) => setSignupData({ ...signupData, cargo: e.target.value })}
                        disabled={isLoading}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-telefone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-red-500" />
                        Telefone
                      </Label>
                      <Input
                        id="signup-telefone"
                        type="tel"
                        placeholder="(11) 99999-9999"
                        value={signupData.telefone}
                        onChange={(e) => setSignupData({ ...signupData, telefone: e.target.value })}
                        disabled={isLoading}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando conta..." : "Criar Conta"}
                    </Button>

                    <p className="text-xs text-center text-gray-500 mt-4">
                      Ao criar uma conta, você receberá notificações sobre novas ordens de serviço
                    </p>
                  </motion.form>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Sistema desenvolvido para gestão eficiente de manutenção
        </motion.p>
      </motion.div>
    </div>
  )
}

