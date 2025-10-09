"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Plus,
  Filter,
  Search,
  Eye,
  Play,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CronogramaItem {
  id: string
  equipamento: string
  local: string
  tipo_manutencao: string
  data_programada: string
  hora_programada?: string
  responsavel?: string
  prioridade: 'Baixa' | 'Média' | 'Alta'
  status: 'Agendada' | 'Em Andamento' | 'Concluída' | 'Cancelada' | 'Atrasada'
  observacoes?: string
  os_gerada_id?: string
  created_at: string
}

export default function CronogramaPage() {
  const [cronograma, setCronograma] = useState<CronogramaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [prioridadeFilter, setPrioridadeFilter] = useState('todos')
  const [activeTab, setActiveTab] = useState('agendadas')

  // Buscar dados do cronograma
  const fetchCronograma = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cronograma')
      const data = await response.json()
      
      if (data.success) {
        setCronograma(data.cronograma)
      } else {
        console.error('Erro ao buscar cronograma:', data.error)
      }
    } catch (error) {
      console.error('Erro ao buscar cronograma:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCronograma()
  }, [])

  // Filtrar cronograma
  const filteredCronograma = cronograma.filter(item => {
    const matchesSearch = item.equipamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tipo_manutencao.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'todos' || item.status === statusFilter
    const matchesPrioridade = prioridadeFilter === 'todos' || item.prioridade === prioridadeFilter
    
    return matchesSearch && matchesStatus && matchesPrioridade
  })

  // Agrupar por status
  const agendadas = filteredCronograma.filter(item => item.status === 'Agendada')
  const emAndamento = filteredCronograma.filter(item => item.status === 'Em Andamento')
  const concluidas = filteredCronograma.filter(item => item.status === 'Concluída')
  const atrasadas = filteredCronograma.filter(item => item.status === 'Atrasada')

  // Gerar OS a partir do cronograma
  const handleGerarOS = async (cronogramaId: string) => {
    try {
      const response = await fetch('/api/cronograma/gerar-os', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cronogramaId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('✅ OS gerada com sucesso!')
        fetchCronograma() // Recarregar dados
      } else {
        alert('❌ Erro ao gerar OS: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao gerar OS:', error)
      alert('❌ Erro ao gerar OS')
    }
  }

  // Atualizar status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch('/api/cronograma', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus })
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchCronograma() // Recarregar dados
      } else {
        alert('❌ Erro ao atualizar status: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('❌ Erro ao atualizar status')
    }
  }

  // Deletar manutenção
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta manutenção?')) return
    
    try {
      const response = await fetch(`/api/cronograma?id=${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        fetchCronograma() // Recarregar dados
      } else {
        alert('❌ Erro ao deletar: ' + data.error)
      }
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('❌ Erro ao deletar')
    }
  }

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  // Badge de prioridade
  const getPrioridadeBadge = (prioridade: string) => {
    const colors = {
      'Alta': 'bg-red-100 text-red-800 border-red-200',
      'Média': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Baixa': 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[prioridade as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // Badge de status
  const getStatusBadge = (status: string) => {
    const colors = {
      'Agendada': 'bg-blue-100 text-blue-800 border-blue-200',
      'Em Andamento': 'bg-orange-100 text-orange-800 border-orange-200',
      'Concluída': 'bg-green-100 text-green-800 border-green-200',
      'Atrasada': 'bg-red-100 text-red-800 border-red-200',
      'Cancelada': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando cronograma...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                Cronograma de Manutenção Preventiva
              </h1>
              <p className="text-gray-600 mt-2">
                Gerencie e acompanhe as manutenções preventivas programadas
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.href = '/cronograma/novo'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Manutenção
              </Button>
              <Button
                onClick={fetchCronograma}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="h-4 w-4 inline mr-1" />
                  Buscar
                </label>
                <Input
                  placeholder="Equipamento, local, tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Agendada">Agendada</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Concluída">Concluída</SelectItem>
                    <SelectItem value="Atrasada">Atrasada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('todos')
                    setPrioridadeFilter('todos')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agendadas">
              Agendadas ({agendadas.length})
            </TabsTrigger>
            <TabsTrigger value="em-andamento">
              Em Andamento ({emAndamento.length})
            </TabsTrigger>
            <TabsTrigger value="concluidas">
              Concluídas ({concluidas.length})
            </TabsTrigger>
            <TabsTrigger value="atrasadas">
              Atrasadas ({atrasadas.length})
            </TabsTrigger>
          </TabsList>

          {/* Agendadas */}
          <TabsContent value="agendadas">
            <div className="grid gap-4">
              {agendadas.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma manutenção agendada
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Crie uma nova manutenção preventiva para começar
                    </p>
                    <Button
                      onClick={() => window.location.href = '/cronograma/novo'}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Manutenção
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                agendadas.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.equipamento}
                            </h3>
                            <Badge className={getPrioridadeBadge(item.prioridade)}>
                              {item.prioridade}
                            </Badge>
                            <Badge className={getStatusBadge(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <strong>Local:</strong> {item.local}
                            </div>
                            <div>
                              <strong>Tipo:</strong> {item.tipo_manutencao}
                            </div>
                            <div>
                              <strong>Data:</strong> {formatDate(item.data_programada)}
                              {item.hora_programada && ` às ${item.hora_programada}`}
                            </div>
                            {item.responsavel && (
                              <div>
                                <strong>Responsável:</strong> {item.responsavel}
                              </div>
                            )}
                            {item.observacoes && (
                              <div className="md:col-span-3">
                                <strong>Observações:</strong> {item.observacoes}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  onClick={() => handleGerarOS(item.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Gerar OS</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(item.id, 'Em Andamento')}
                                >
                                  <Clock className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Iniciar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(item.id, 'Concluída')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Concluir</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Deletar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Em Andamento */}
          <TabsContent value="em-andamento">
            <div className="grid gap-4">
              {emAndamento.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma manutenção em andamento
                    </h3>
                    <p className="text-gray-600">
                      As manutenções em andamento aparecerão aqui
                    </p>
                  </CardContent>
                </Card>
              ) : (
                emAndamento.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.equipamento}
                            </h3>
                            <Badge className={getPrioridadeBadge(item.prioridade)}>
                              {item.prioridade}
                            </Badge>
                            <Badge className={getStatusBadge(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <strong>Local:</strong> {item.local}
                            </div>
                            <div>
                              <strong>Tipo:</strong> {item.tipo_manutencao}
                            </div>
                            <div>
                              <strong>Data:</strong> {formatDate(item.data_programada)}
                            </div>
                            {item.responsavel && (
                              <div>
                                <strong>Responsável:</strong> {item.responsavel}
                              </div>
                            )}
                            {item.os_gerada_id && (
                              <div className="md:col-span-3">
                                <strong>OS Gerada:</strong> 
                                <span className="text-green-600 font-medium ml-1">
                                  #{item.os_gerada_id.substring(0, 8)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleUpdateStatus(item.id, 'Concluída')}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Concluir</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Concluídas */}
          <TabsContent value="concluidas">
            <div className="grid gap-4">
              {concluidas.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma manutenção concluída
                    </h3>
                    <p className="text-gray-600">
                      As manutenções concluídas aparecerão aqui
                    </p>
                  </CardContent>
                </Card>
              ) : (
                concluidas.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.equipamento}
                            </h3>
                            <Badge className={getPrioridadeBadge(item.prioridade)}>
                              {item.prioridade}
                            </Badge>
                            <Badge className={getStatusBadge(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <strong>Local:</strong> {item.local}
                            </div>
                            <div>
                              <strong>Tipo:</strong> {item.tipo_manutencao}
                            </div>
                            <div>
                              <strong>Data:</strong> {formatDate(item.data_programada)}
                            </div>
                            {item.responsavel && (
                              <div>
                                <strong>Responsável:</strong> {item.responsavel}
                              </div>
                            )}
                            {item.os_gerada_id && (
                              <div className="md:col-span-3">
                                <strong>OS Gerada:</strong> 
                                <span className="text-green-600 font-medium ml-1">
                                  #{item.os_gerada_id.substring(0, 8)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Atrasadas */}
          <TabsContent value="atrasadas">
            <div className="grid gap-4">
              {atrasadas.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma manutenção atrasada
                    </h3>
                    <p className="text-gray-600">
                      Ótimo! Todas as manutenções estão em dia
                    </p>
                  </CardContent>
                </Card>
              ) : (
                atrasadas.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow border-red-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.equipamento}
                            </h3>
                            <Badge className={getPrioridadeBadge(item.prioridade)}>
                              {item.prioridade}
                            </Badge>
                            <Badge className={getStatusBadge(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <strong>Local:</strong> {item.local}
                            </div>
                            <div>
                              <strong>Tipo:</strong> {item.tipo_manutencao}
                            </div>
                            <div>
                              <strong>Data:</strong> {formatDate(item.data_programada)}
                            </div>
                            {item.responsavel && (
                              <div>
                                <strong>Responsável:</strong> {item.responsavel}
                              </div>
                            )}
                            <div className="md:col-span-3">
                              <span className="text-red-600 font-medium">
                                ⚠️ Esta manutenção está atrasada!
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  onClick={() => handleGerarOS(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Gerar OS Urgente</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
