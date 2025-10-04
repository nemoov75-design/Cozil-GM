'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wrench, Shield, Zap, Users, Mail, Lock } from 'lucide-react'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  
  // Estados do formulário de cadastro
  const [registerForm, setRegisterForm] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    console.log('🔐 Tentativa de login:', { email, password })

    try {
      // Primeiro, verificar se é um usuário cadastrado localmente
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]')
      const localUser = localUsers.find((user: any) => user.email === email && user.password === password)
      
      if (localUser) {
        // Login com usuário local
        console.log('✅ Login local bem-sucedido:', localUser.name)
        localStorage.setItem('user', JSON.stringify({
          id: localUser.id,
          name: localUser.name,
          email: localUser.email,
          role: localUser.role,
          image: localUser.image,
          status: 'online'
        }))
        
        window.location.href = '/'
        return
      }

      // Se não for usuário local, tentar API (para admin)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log('📋 Resultado do login:', data)

      if (data.success) {
        console.log('✅ Login API bem-sucedido!')
        // Salvar dados do usuário no localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        window.location.href = '/'
      } else {
        console.log('❌ Login falhou:', data.error)
        setError(data.error || 'Email ou senha incorretos')
      }
    } catch (error) {
      console.log('❌ Erro no catch:', error)
      setError('Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validações
    if (!registerForm.name || !registerForm.role || !registerForm.email || !registerForm.password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (registerForm.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    // Verificar se o email já existe no localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
    if (existingUsers.some((user: any) => user.email === registerForm.email)) {
      setError('Este email já está cadastrado')
      return
    }

    // Criar novo usuário
    const newUser = {
      id: Date.now().toString(),
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      role: registerForm.role,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(registerForm.name)}&background=ef4444&color=fff`,
      status: 'online',
      created_at: new Date().toISOString()
    }

    // Salvar no localStorage
    const updatedUsers = [...existingUsers, newUser]
    localStorage.setItem('users', JSON.stringify(updatedUsers))

    // Login automático após cadastro
    localStorage.setItem('user', JSON.stringify(newUser))
    
    alert(`✅ Cadastro realizado com sucesso!\nBem-vindo(a), ${newUser.name}!`)
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-50 rounded-full opacity-10 animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/80 border-red-200 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Wrench className="h-8 w-8 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Cozil
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Sistema de Gestão de Manutenção
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!showRegister ? (
              <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                  className="mr-2"
                >
                  <Wrench className="w-5 h-5" />
                </motion.div>
                {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
              </Button>
            </motion.form>
            ) : (
              <motion.form
                onSubmit={handleRegister}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nome Completo
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Cargo/Função
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <select
                        id="role"
                        value={registerForm.role}
                        onChange={(e) => setRegisterForm({...registerForm, role: e.target.value})}
                        className="pl-10 w-full h-11 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 bg-white appearance-none"
                        required
                      >
                        <option value="">Selecione seu cargo</option>
                        <option value="tecnico">Técnico</option>
                        <option value="gestor">Gestor</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="operador">Operador</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                      Confirmar Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                        className="pl-10 h-11 rounded-xl border-gray-200 focus:border-red-500 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Mensagem de Erro */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Botão de Cadastro */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <motion.div
                    className="flex items-center justify-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Users className="w-4 h-4" />
                    <span>Criar Conta</span>
                  </motion.div>
                </Button>
              </motion.form>
            )}

        {/* Sistema de Cadastro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-50 rounded-xl p-4 space-y-3"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-semibold text-gray-700">
              {showRegister ? '🔓 Já tem conta?' : '👤 Novo usuário?'}
            </h4>
            <button
              onClick={() => setShowRegister(!showRegister)}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              {showRegister ? 'Fazer Login' : 'Cadastrar-se'}
            </button>
          </div>
          
        </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-xs text-gray-600">Seguro</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-xs text-gray-600">Rápido</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-xs text-gray-600">Colaborativo</p>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          <p>© 2025 Cozil. Todos os direitos reservados.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
