"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Cloud,
  Cog,
  Download,
  Home,
  Menu,
  MessageSquare,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Wrench,
  X,
  Zap,
  Building,
  Droplets,
  BarChart3,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  PlayCircle,
  Upload,
  FileText,
  PenTool,
  LogOut,
  User,
  Filter,
  Eye,
  Edit,
  Printer
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { EmailReportManager } from './email-report-manager'

const maintenanceTypes = [
  {
    name: "Mecânica",
    icon: <Cog className="text-orange-500" />,
    description: "Equipamentos e máquinas",
    count: 0,
    urgent: 0,
  },
  {
    name: "Predial",
    icon: <Building className="text-red-600" />,
    description: "Manutenção predial",
    count: 0,
    urgent: 0,
  },
]

// Inicialmente vazio, será preenchido via API
const initialWorkOrders: any[] = []

const sidebarItems = [
  {
    title: "Dashboard",
    icon: <Home />,
    isActive: true,
    key: "home",
  },
  {
    title: "Nova OS",
    icon: <Plus />,
    key: "new-order",
  },
  {
    title: "Todas as OSs",
    icon: <FileText />,
    key: "all-orders",
  },
  {
    title: "Relatórios",
    icon: <BarChart3 />,
    key: "reports",
  },
  {
    title: "Configurações",
    icon: <Settings />,
    key: "settings",
  },
]

export function DesignaliCreative() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState(0)
  const [activeTab, setActiveTab] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [workOrders, setWorkOrders] = useState(initialWorkOrders)
  const [archivedOrders, setArchivedOrders] = useState<any[]>([])
  const [isLoadingArchived, setIsLoadingArchived] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({
    pendentes: 0,
    execucao: 0,
    concluidas: 0,
    altas: 0
  })
  const [selectedOS, setSelectedOS] = useState<any>(null)
  const [showOSDetails, setShowOSDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showNewOSModal, setShowNewOSModal] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterSector, setFilterSector] = useState('all')
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [showNotifications, setShowNotifications] = useState(false)
  const [viewedNotifications, setViewedNotifications] = useState<string[]>([])
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const [osForm, setOsForm] = useState({
    setor: "",
    data: "",
    equipamento: "",
    tipoManutencao: "",
    prioridade: "",
    descricao: "",
    solicitante: "",
    responsavelSetor: "",
    fotos: [] as File[],
    assinatura: "",
  })
  
  const [newOSForm, setNewOSForm] = useState({
    solicitante: "",
    setor: "",
    data_solicitacao: "",
    local: "",
    prioridade: "Média",
    tipo_manutencao: "Predial",
    descricao: "",
    responsavelSetor: "",
    fotos: [] as string[]
  })
  const [showEmailManager, setShowEmailManager] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedMaintenanceType, setSelectedMaintenanceType] = useState<string | null>(null)
  
  // Estados para feedback visual
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)

  // Verificar se o usuário está logado
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  // Buscar dados quando o componente carrega
  useEffect(() => {
    if (user) {
      fetchWorkOrders()
      
      // Atualizar a cada 30 segundos
      const interval = setInterval(fetchWorkOrders, 30000)
      
      return () => clearInterval(interval)
    }
  }, [user])

  // Fechar notificações quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications && !(event.target as Element).closest('.notification-dropdown')) {
        setShowNotifications(false)
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  // Verificar autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Wrench className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">CozilTech</h2>
          <p className="text-gray-600">Carregando sistema...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <Wrench className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-4">
            CozilTech
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Sistema de Gestão de Manutenção
          </p>
          
          <Button
            onClick={() => window.location.href = '/auth'}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <User className="w-5 h-5 mr-2" />
            Fazer Login
          </Button>
        </motion.div>
      </div>
    )
  }

  // Função auxiliar para formatar data (evita problema de timezone)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'
    
    // Extrair apenas a parte da data (YYYY-MM-DD) se vier com timestamp
    let dateOnly = dateString
    if (dateString.includes('T')) {
      dateOnly = dateString.split('T')[0]
    }
    
    // Se a data está no formato YYYY-MM-DD, converter diretamente
    if (dateOnly.includes('-') && dateOnly.length === 10) {
      const [year, month, day] = dateOnly.split('-')
      return `${day}/${month}/${year}`
    }
    
    // Caso contrário, usar Date (pode ter problema de timezone)
    try {
      const date = new Date(dateString + 'T12:00:00') // Adicionar meio-dia para evitar timezone
      return date.toLocaleDateString('pt-BR')
    } catch {
      return 'N/A'
    }
  }

  // Função para buscar OSs da API
  const fetchWorkOrders = async () => {
    try {
      const response = await fetch('/api/os')
      const data = await response.json()
      
      if (data.success) {
        // Debug: Verificar primeiros registros
        console.log('📊 Primeiros 2 registros da API:', data.orders.slice(0, 2))
        
        // Remover duplicatas usando Map para garantir unicidade (mais robusto)
        const orderMap = new Map()
        data.orders.forEach((os: any) => {
          const key = os.numero_os || os.id
          if (key && !orderMap.has(key)) {
            orderMap.set(key, os)
          }
        })
        const uniqueOrders = Array.from(orderMap.values())
        
        console.log('🔍 Debug duplicatas:', {
          total: data.orders.length,
          unicos: uniqueOrders.length,
          removidas: data.orders.length - uniqueOrders.length,
          numero_os_duplicados: data.orders.map(os => os.numero_os).filter((os, index, arr) => arr.indexOf(os) !== index)
        })
        
        setWorkOrders(uniqueOrders)
        
        // Calcular estatísticas
        const stats = {
          pendentes: uniqueOrders.filter((os: any) => os.status !== 'Concluído').length,
          execucao: 0, // Não usado mais
          concluidas: uniqueOrders.filter((os: any) => os.status === 'Concluído').length,
          altas: uniqueOrders.filter((os: any) => os.prioridade === 'Alta').length
        }
        
        setDashboardStats(stats)
        
        // Verificar notificações de alta prioridade não vistas
        const urgentOrders = uniqueOrders.filter((os: any) => os.prioridade === 'Alta' && os.status !== 'Concluído')
        const unviewedUrgentOrders = urgentOrders.filter((os: any) => !viewedNotifications.includes(os.id))
        
        setNotifications(unviewedUrgentOrders.length)
        setHasNewNotifications(unviewedUrgentOrders.length > 0)
        
        console.log('📊 Dados únicos carregados:', {
          total: uniqueOrders.length,
          removidas: data.orders.length - uniqueOrders.length,
          numero_os_duplicados: data.orders.map(os => os.numero_os).filter((os, index, arr) => arr.indexOf(os) !== index)
        })
      }
    } catch (error) {
      console.error('Erro ao buscar OSs:', error)
    }
  }


  // Função para buscar OSs arquivadas do Google Sheets
  const fetchArchivedOrders = async () => {
    setIsLoadingArchived(true)
    try {
      console.log('📖 Buscando OSs arquivadas...')
      const response = await fetch('/api/archived-os')
      const data = await response.json()
      
      if (data.success) {
        setArchivedOrders(data.orders)
        console.log(`✅ ${data.orders.length} OSs arquivadas carregadas`)
      } else {
        console.error('❌ Erro ao buscar OSs arquivadas:', data.error)
      }
    } catch (error) {
      console.error('❌ Erro ao buscar OSs arquivadas:', error)
    } finally {
      setIsLoadingArchived(false)
    }
  }

  // Função para marcar notificações como vistas
  const markNotificationsAsViewed = () => {
    const urgentOrderIds = workOrders
      .filter(os => os.prioridade === 'Alta' && os.status !== 'Concluído')
      .map(os => os.id);
    
    setViewedNotifications(prev => [...new Set([...prev, ...urgentOrderIds])]);
    setNotifications(0);
    setHasNewNotifications(false);
  };


  // Função para visualizar detalhes da OS
  const handleViewOS = (os: any) => {
    setSelectedOS(os);
    setShowOSDetails(true);
  };

  // Função para atualizar status da OS
  const handleUpdateOSStatus = async (osId: string, newStatus: string) => {
    try {
      console.log('🔄 Atualizando OS:', { osId, newStatus });
      
      const response = await fetch('/api/os/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ osId, status: newStatus }),
      });

      const result = await response.json();
      console.log('📋 Resposta da API:', result);

      if (response.ok) {
        console.log('✅ Status atualizado com sucesso');
        
        // Atualizar lista local
        setWorkOrders(prev => prev.map(os => 
          os.id === osId ? { ...os, status: newStatus, last_updated: new Date().toISOString() } : os
        ));
        
        // Se concluiu uma OS de alta prioridade, remover das notificações vistas
        if (newStatus === 'Concluído') {
          setViewedNotifications(prev => prev.filter(id => id !== osId));
        }
        
        // Fechar modal
        setShowOSDetails(false);
        
        // Atualizar dados
        await fetchWorkOrders();
      } else {
        console.error('❌ Erro ao atualizar status:', result);
        alert(`Erro ao atualizar status: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar status:', error);
      alert('Erro ao atualizar status da OS');
    }
  };

  // Função para editar OS
  const handleEditOS = (os?: any) => {
    // Se não passar OS, usar o selectedOS
    const osToEdit = os || selectedOS
    
    if (!osToEdit) {
      console.error('❌ Nenhuma OS selecionada para editar')
      return
    }

    console.log('✏️ Editando OS:', osToEdit)
    
    // Normalizar prioridade para o formato correto
    let prioridade = osToEdit.prioridade || 'Média'
    if (prioridade.toLowerCase() === 'normal') {
      prioridade = 'Média'
    } else if (prioridade.toLowerCase() === 'baixa') {
      prioridade = 'Baixa'
    } else if (prioridade.toLowerCase() === 'alta') {
      prioridade = 'Alta'
    } else if (prioridade.toLowerCase() === 'média') {
      prioridade = 'Média'
    }
    
    // Normalizar tipo_manutencao para o formato correto
    let tipoManutencao = osToEdit.tipo_manutencao || osToEdit.tipoManutencao || 'Predial'
    if (tipoManutencao.toLowerCase().includes('mec') || tipoManutencao.toLowerCase().includes('mec')) {
      tipoManutencao = 'Mecânica'
    } else {
      // Qualquer outro tipo vira Predial (elétrica, tubulação, etc)
      tipoManutencao = 'Predial'
    }
    
    setSelectedOS(osToEdit)
    setEditForm({
      setor: osToEdit.setor || '',
      equipamento: osToEdit.equipamento || '',
      tipo_manutencao: tipoManutencao,
      prioridade: prioridade,
      descricao: osToEdit.descricao || '',
      solicitante: osToEdit.solicitante || '',
      responsavel_setor: osToEdit.responsavel_setor || osToEdit.responsavelSetor || '',
      data: osToEdit.data || osToEdit.data_solicitacao || new Date(osToEdit.created_at).toISOString().split('T')[0]
    })
    setShowEditModal(true)
  }


  // Função para criar nova OS
  const handleCreateNewOS = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/os', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOSForm),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Nova OS criada:', result)
        
        // Limpar formulário
        setNewOSForm({
          solicitante: "",
          setor: "",
          data_solicitacao: "",
          local: "",
          prioridade: "Média",
          tipo_manutencao: "Predial",
          descricao: "",
          responsavelSetor: "",
          fotos: []
        })
        
        // Fechar modal
        setShowNewOSModal(false)
        
        // Recarregar OSs
        await fetchWorkOrders()
        
        // Voltar para o dashboard
        setActiveTab('home')
        
        // Mostrar notificação de sucesso
        setToastMessage('✅ Ordem de Serviço criada com sucesso!')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } else {
        console.error('❌ Erro ao criar OS:', response.statusText)
        setToastMessage('❌ Erro ao criar Ordem de Serviço')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error) {
      console.error('❌ Erro ao criar OS:', error)
      setToastMessage('❌ Erro ao criar Ordem de Serviço')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setIsCreating(false)
    }
  }

  // Função para sincronizar com Google Sheets
  const handleSyncSheets = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/sync-sheets', { method: 'POST' })
      const result = await response.json()

      if (result.success) {
        setToastMessage(`✅ ${result.totalOSs} OSs sincronizadas!`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
        
        if (result.spreadsheetUrl) {
          window.open(result.spreadsheetUrl, '_blank')
        }
      } else {
        setToastMessage(`❌ Erro: ${result.error}`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      setToastMessage('❌ Erro ao sincronizar')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 5000)
    } finally {
      setIsSyncing(false)
    }
  }

  // Função para salvar edição
  const handleSaveEdit = async () => {
    console.log('💾 Salvando edição...')
    console.log('📝 Dados a serem enviados:', {
      osId: selectedOS?.id,
      selectedOS: selectedOS,
      editForm: editForm
    })

    if (!selectedOS || !selectedOS.id) {
      console.error('❌ Erro: selectedOS inválido ou sem ID')
      setToastMessage('❌ Erro: OS não encontrada')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setIsSaving(true)
    try {
      const payload = { 
        osId: selectedOS.id, 
        updates: editForm 
      }
      
      console.log('📤 Payload sendo enviado:', JSON.stringify(payload, null, 2))
      
      const response = await fetch('/api/os/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('📡 Resposta recebida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      const result = await response.json()
      console.log('📊 Resultado da API:', result)

      if (result.success) {
        console.log('✅ OS atualizada com sucesso!')
        setShowEditModal(false)
        
        // Recarregar dados
        await fetchWorkOrders()
        
        // Notificação de sucesso
        setToastMessage('✅ OS atualizada com sucesso!')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      } else {
        // Notificação de erro
        console.error('❌ Erro retornado pela API:', result)
        setToastMessage(`❌ Erro: ${result.error || 'Erro desconhecido'}`)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 5000)
      }
    } catch (error) {
      console.error('❌ Erro ao salvar edição:', error)
      setToastMessage('❌ Erro ao salvar edição')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  // Função para filtrar OSs
  const getFilteredOrders = (orders: any[]) => {
    return orders.filter((os: any) => {
      // Filtro por termo de busca
      const matchesSearch = !searchTerm || 
        os.numero_os?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        os.setor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        os.equipamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        os.solicitante?.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtro por status
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'pending' && os.status !== 'Concluído') ||
        (filterStatus === 'completed' && os.status === 'Concluído')

      // Filtro por prioridade
      const matchesPriority = filterPriority === 'all' || os.prioridade === filterPriority

      // Filtro por setor
      const matchesSector = filterSector === 'all' || os.setor === filterSector

      return matchesSearch && matchesStatus && matchesPriority && matchesSector
    })
  }

  // Obter setores únicos para o filtro
  const getUniqueSectors = () => {
    const sectors = [...new Set(workOrders.map((os: any) => os.setor).filter(Boolean))]
    return sectors.sort()
  }

  // Função para imprimir OS
  const handlePrintOS = () => {
    if (!selectedOS) {
      alert('Nenhuma OS selecionada para impressão')
      return
    }
    
    try {
      const printContent = `
        <html>
          <head>
            <title>OS ${selectedOS.numero_os || 'N/A'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; }
              .value { margin-left: 10px; }
              .status { padding: 5px 10px; border-radius: 5px; color: white; }
              .alta { background-color: #dc2626; }
              .normal { background-color: #059669; }
              .em-andamento { background-color: #d97706; }
              .concluido { background-color: #059669; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>ORDEM DE SERVIÇO - COZIL</h1>
              <h2>OS: ${selectedOS.numero_os || 'N/A'}</h2>
            </div>
            
            <div class="field">
              <span class="label">Setor:</span>
              <span class="value">${selectedOS.setor || 'N/A'}</span>
            </div>
            
            <div class="field">
              <span class="label">Local/Equipamento:</span>
              <span class="value">${selectedOS.local || selectedOS.equipamento || 'N/A'}</span>
            </div>
            
            <div class="field">
              <span class="label">Tipo de Manutenção:</span>
              <span class="value">${selectedOS.tipoManutencao || selectedOS.tipo_manutencao || 'N/A'}</span>
            </div>
            
            <div class="field">
              <span class="label">Prioridade:</span>
              <span class="value">
                <span class="status ${(selectedOS.prioridade === 'Alta') ? 'alta' : 'normal'}">
                  ${(selectedOS.prioridade === 'Alta') ? 'ALTA' : 'NORMAL'}
                </span>
              </span>
            </div>
            
            <div class="field">
              <span class="label">Data:</span>
              <span class="value">${
                selectedOS.data_solicitacao 
                  ? selectedOS.data_solicitacao.split('T')[0].split('-').reverse().join('/') 
                  : (selectedOS.data 
                      ? selectedOS.data.split('T')[0].split('-').reverse().join('/') 
                      : (selectedOS.created_at 
                          ? new Date(selectedOS.created_at).toLocaleDateString('pt-BR') 
                          : 'N/A'))
              }</span>
            </div>
            
            <div class="field">
              <span class="label">Solicitante:</span>
              <span class="value">${selectedOS.solicitante || 'N/A'}</span>
            </div>
            
            <div class="field">
              <span class="label">Responsável pelo Setor:</span>
              <span class="value">${selectedOS.responsavelSetor || selectedOS.responsavel_setor || 'N/A'}</span>
            </div>
            
            <div class="field">
              <span class="label">Status:</span>
              <span class="value">
                <span class="status ${(selectedOS.status === 'Concluído') ? 'concluido' : 'em-andamento'}">
                  ${selectedOS.status || 'N/A'}
                </span>
              </span>
            </div>
            
            <div class="field">
              <span class="label">Descrição do Problema:</span>
              <div class="value" style="margin-top: 10px; padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                ${selectedOS.descricao || 'N/A'}
              </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
              Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
            </div>
          </body>
        </html>
      `
      
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      if (printWindow) {
        printWindow.document.write(printContent)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
        }, 500)
      } else {
        alert('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.')
      }
    } catch (error) {
      console.error('Erro ao imprimir OS:', error)
      alert('Erro ao gerar impressão. Tente novamente.')
    }
  }

  // Função para baixar relatório em PDF
  const downloadReport = () => {
    const monthOrders = workOrders.filter(os => {
      const osDate = new Date(os.created_at || os.created);
      return osDate.getMonth() === selectedMonth && osDate.getFullYear() === selectedYear;
    });

    const completedOrders = monthOrders.filter(os => os.status === 'Concluído');
    const pendingOrders = monthOrders.filter(os => os.status !== 'Concluído');
    const urgentOrders = monthOrders.filter(os => os.prioridade === 'Alta');

    // Análise por tipo
    const typeAnalysis = monthOrders.reduce((acc, os) => {
      const type = os.tipoManutencao || 'outros';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Análise por setor
    const sectorAnalysis = monthOrders.reduce((acc, os) => {
      acc[os.setor] = (acc[os.setor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthName = new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    });

    // Criar conteúdo do relatório
    const reportContent = `
RELATÓRIO INTELIGENTE DE MANUTENÇÃO - COZIL
${monthName.toUpperCase()}

📊 RESUMO EXECUTIVO
Total de OSs: ${monthOrders.length}
Concluídas: ${completedOrders.length}
Em Andamento: ${pendingOrders.length}
Alta Prioridade: ${urgentOrders.length}

📝 ANÁLISE DO PERÍODO
Durante o mês de ${monthName}, foram registradas ${monthOrders.length} ordens de serviço.

${monthOrders.length > 0 ? `
DISTRIBUIÇÃO POR TIPO DE MANUTENÇÃO:
${Object.entries(typeAnalysis).map(([type, count]) => `• ${type}: ${count} OSs`).join('\n')}

DISTRIBUIÇÃO POR SETOR:
${Object.entries(sectorAnalysis).map(([sector, count]) => `• ${sector}: ${count} OSs`).join('\n')}

RECOMENDAÇÕES:
${monthOrders.length > 0 ? `
• Foque na conclusão das ${pendingOrders.length} OSs pendentes
• Priorize as ${urgentOrders.length} OSs de alta prioridade
• Analise os padrões de manutenção por setor
` : '• Nenhuma atividade registrada no período'}
` : 'Nenhuma atividade registrada no período.'}

RELATÓRIO GERADO EM: ${new Date().toLocaleString('pt-BR')}
SISTEMA COZIL - GESTÃO DE MANUTENÇÃO
    `.trim();

    // Criar e baixar arquivo
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-manutencao-${monthName.replace(' ', '-').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateOSNumber = () => {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, "0")
    const day = String(new Date().getDate()).padStart(2, "0")
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `OS-${year}${month}${day}-${random}`
  }

  const handleCreateOS = async () => {
    try {
      const response = await fetch('/api/os', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(osForm)
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert(`OS ${data.os.numeroOS} criada com sucesso!`)
        
    // Reset form
    setOsForm({
      setor: "",
      data: "",
      equipamento: "",
      tipoManutencao: "",
      prioridade: "",
      descricao: "",
      solicitante: "",
      responsavelSetor: "",
      fotos: [],
      assinatura: "",
    })
        
        // Atualizar lista de OSs
        fetchWorkOrders()
      } else {
        alert(`Erro ao criar OS: ${data.error}`)
      }
    } catch (error) {
      console.error('Erro ao criar OS:', error)
      alert('Erro ao criar OS')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Converter arquivos para Base64
    const base64Files = await Promise.all(
      files.map(async (file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(file)
        })
      })
    )
    
    setNewOSForm((prev) => ({ ...prev, fotos: [...prev.fotos, ...base64Files] }))
  }

  const handleSidebarClick = (key: string) => {
    setActiveTab(key)
    setMobileMenuOpen(false)
  }

  // Funções movidas para o topo do arquivo

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.3) 0%, rgba(185, 28, 28, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 30% 70%, rgba(220, 38, 38, 0.3) 0%, rgba(153, 27, 27, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 70% 30%, rgba(248, 113, 113, 0.3) 0%, rgba(185, 28, 28, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col border-r">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white">
                <Wrench className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold">ManutençãoPro</h2>
                <p className="text-xs text-muted-foreground">Sistema de OS</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleSidebarClick(item.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium",
                    activeTab === item.key ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.image || "/placeholder.svg?height=32&width=32"} alt={user?.name || "User"} />
                    <AvatarFallback>
                      {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user?.name || 'Usuário'}</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {user?.role === 'admin' ? 'Admin' : 
                   user?.role === 'tecnico' ? 'Técnico' :
                   user?.role === 'gestor' ? 'Gestor' :
                   user?.role === 'supervisor' ? 'Supervisor' :
                   user?.role === 'operador' ? 'Operador' : 'Usuário'}
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 text-white">
                <Wrench className="size-5" />
              </div>
              <div>
                <h2 className="font-semibold">ManutençãoPro</h2>
                <p className="text-xs text-muted-foreground">Sistema de OS</p>
              </div>
            </div>
          </div>

          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar..." className="w-full rounded-2xl bg-muted pl-9 pr-4 py-2" />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleSidebarClick(item.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium",
                    activeTab === item.key ? "bg-primary/10 text-primary" : "hover:bg-muted",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-3">
            <div className="space-y-1">
              <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.image || "/placeholder.svg?height=32&width=32"} alt={user?.name || "User"} />
                    <AvatarFallback>
                      {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user?.name || 'Usuário'}</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {user?.role === 'admin' ? 'Admin' : 
                   user?.role === 'tecnico' ? 'Técnico' :
                   user?.role === 'gestor' ? 'Gestor' :
                   user?.role === 'supervisor' ? 'Supervisor' :
                   user?.role === 'operador' ? 'Operador' : 'Usuário'}
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Wrench className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  CozilTech
                </h1>
              </motion.div>
              <span className="text-sm text-muted-foreground hidden sm:block">
                Sistema de Gestão de Manutenção
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Sistema de Notificações */}
              <div className="relative notification-dropdown">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-2xl relative"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications && notifications > 0) {
                      markNotificationsAsViewed();
                    }
                  }}
                >
                  <motion.div
                    animate={hasNewNotifications ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: hasNewNotifications ? Infinity : 0, repeatDelay: 2 }}
                  >
                      <Bell className="h-5 w-5" />
                  </motion.div>
                      {notifications > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                    >
                          {notifications}
                    </motion.span>
                      )}
                    </Button>

                {/* Dropdown de Notificações */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 w-80 bg-background border rounded-2xl shadow-lg z-50"
                  >
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Notificações</h3>
                      <p className="text-sm text-muted-foreground">
                        {notifications} OSs de alta prioridade aguardando atenção
                      </p>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {workOrders
                        .filter(os => os.prioridade === 'Alta' && os.status !== 'Concluído')
                        .slice(0, 5)
                        .map((os) => (
                          <motion.div
                            key={os.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-3 border-b hover:bg-muted/50 cursor-pointer"
                            onClick={() => {
                              setSelectedOS(os);
                              setShowOSDetails(true);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{os.numeroOS}</p>
                                <p className="text-sm text-muted-foreground truncate">{os.equipamento}</p>
                                <p className="text-xs text-red-600">
                                  🚨 Urgente - {os.setor}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      
                      {workOrders.filter(os => os.prioridade === 'Alta' && os.status !== 'Concluído').length === 0 && (
                        <div className="p-6 text-center">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">
                            Nenhuma notificação de alta prioridade
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {notifications > 0 && (
                      <div className="p-3 border-t space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full rounded-xl"
                          onClick={() => {
                            setActiveTab("home");
                            setShowNotifications(false);
                          }}
                        >
                          Ver todas as OSs
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full rounded-xl"
                          onClick={() => {
                            setViewedNotifications([]);
                            setNotifications(0);
                            setHasNewNotifications(false);
                          }}
                        >
                          Limpar Notificações
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-red-200">
                  <AvatarImage src={user?.image || "/placeholder.svg?height=40&width=40"} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-red-100 text-red-600 font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
              </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Usuário"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "email@exemplo.com"}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    localStorage.removeItem('user')
                    window.location.href = '/auth/signin'
                  }}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TabsList className="grid w-full max-w-[450px] grid-cols-3 rounded-2xl p-1">
                <TabsTrigger value="home" className="rounded-xl data-[state=active]:rounded-xl">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="all-orders" className="rounded-xl data-[state=active]:rounded-xl">
                  Todas as OSs
                </TabsTrigger>
                <TabsTrigger value="reports" className="rounded-xl data-[state=active]:rounded-xl">
                  Relatórios
                </TabsTrigger>
              </TabsList>
              <div className="hidden md:flex gap-2">
                <Button
                  className="rounded-2xl bg-primary text-white hover:bg-primary/90"
                  onClick={() => setActiveTab("new-order")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova OS
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl bg-transparent"
                  onClick={() => setActiveTab("reports")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Relatório
                </Button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="home" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-8 text-white"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                          <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">Sistema Ativo</Badge>
                          <h2 className="text-3xl font-bold">Dashboard de Manutenção</h2>
                          <p className="max-w-[600px] text-white/80">
                            Controle total das ordens de serviço com indicadores em tempo real.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  {/* Dashboard Indicators */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="rounded-3xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Em Andamento</p>
                            <p className="text-2xl font-bold">{dashboardStats.pendentes}</p>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100">
                            <Clock className="h-6 w-6 text-yellow-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total de OSs</p>
                            <p className="text-2xl font-bold">{dashboardStats.pendentes + dashboardStats.concluidas}</p>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                            <PlayCircle className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Concluídas</p>
                            <p className="text-2xl font-bold">{dashboardStats.concluidas}</p>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                            <p className="text-2xl font-bold">{dashboardStats.altas}</p>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">Tipos de Manutenção</h2>
                      {selectedMaintenanceType && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedMaintenanceType(null)}
                          className="rounded-xl"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Limpar Filtro
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {maintenanceTypes.map((type) => {
                        const typeCount = workOrders.filter((os: any) => os.tipo_manutencao === type.name).length
                        const isSelected = selectedMaintenanceType === type.name
                        return (
                          <motion.div 
                            key={type.name} 
                            whileHover={{ scale: 1.02, y: -5 }} 
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className={`overflow-hidden rounded-3xl border-2 cursor-pointer transition-all duration-300 ${
                                isSelected 
                                  ? 'border-primary bg-primary/5 shadow-lg' 
                                  : 'hover:border-primary/50'
                              }`}
                              onClick={() => setSelectedMaintenanceType(isSelected ? null : type.name)}
                            >
                              <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className={`rounded-2xl p-4 ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                                  {type.icon}
                                </div>
                                    <div>
                                      <h3 className="text-xl font-bold">{type.name}</h3>
                                      <p className="text-sm text-muted-foreground">{type.description}</p>
                              </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-3xl font-bold text-primary">{typeCount}</p>
                                    <p className="text-xs text-muted-foreground">OSs</p>
                                  </div>
                                </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                        )
                      })}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">
                        {selectedMaintenanceType 
                          ? `OSs de ${selectedMaintenanceType}` 
                          : 'Ordens de Serviço Recentes'}
                      </h2>
                    </div>
                    <div className="rounded-3xl border">
                      {workOrders.length > 0 ? (
                      <div className="grid grid-cols-1 divide-y">
                          {/* Filtrar por tipo de manutenção se selecionado */}
                          {workOrders
                            .filter((os: any) => {
                              if (selectedMaintenanceType) {
                                return os.tipo_manutencao === selectedMaintenanceType && os.status !== 'Concluído'
                              }
                              return os.status !== 'Concluído'
                            })
                            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .slice(0, selectedMaintenanceType ? 10 : 5)
                            .map((order) => (
                          <motion.div
                            key={order.id}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                              className="p-3 md:p-4"
                              onClick={() => handleViewOS(order)}
                          >
                              {/* Layout Card Compacto para Mobile */}
                            <div className="flex items-center gap-3">
                                {/* Ícone */}
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted flex-shrink-0">
                                  {order.tipoManutencao === 'eletrica' && <Zap className="h-6 w-6 text-red-500" />}
                                  {order.tipoManutencao === 'mecanica' && <Cog className="h-6 w-6 text-orange-500" />}
                                  {order.tipoManutencao === 'predial' && <Building className="h-6 w-6 text-red-600" />}
                                  {order.tipoManutencao === 'tubulacao' && <Droplets className="h-6 w-6 text-blue-500" />}
                                  {!['eletrica', 'mecanica', 'predial', 'tubulacao'].includes(order.tipoManutencao) && <Wrench className="h-6 w-6 text-gray-500" />}
                              </div>

                                {/* Informações Principais */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-bold text-base text-primary truncate pr-2">{order.numeroOS}</h3>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      {/* Status Badge Compacto */}
                                      <div className={`w-3 h-3 rounded-full ${
                                        order.status === 'Concluído' ? 'bg-green-500' : 'bg-orange-500'
                                      }`} />
                              </div>
                            </div>
                                  
                                  <p className="font-medium text-lg text-foreground truncate mb-1">
                                    {order.local || order.equipamento || order.setor || 'Sem título'}
                                  </p>
                                  
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground truncate">
                                      {order.setor} • {formatDate(order.data_solicitacao || order.data || order.created_at)}
                                    </p>
                                    
                                    {/* Badge de Prioridade */}
                                    {order.prioridade === 'Alta' && (
                                      <Badge variant="destructive" className="text-xs px-2 py-0 h-5">
                                        Alta
                              </Badge>
                                    )}
                                  </div>
                                </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted">
                              <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium text-muted-foreground">Nenhuma OS encontrada</p>
                              <p className="text-sm text-muted-foreground">
                                As ordens de serviço aparecerão aqui quando criadas através do formulário do Google
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="all-orders" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      {/* Header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-primary">Todas as Ordens de Serviço</h2>
                          <p className="text-muted-foreground mt-1">
                            Gerencie todas as ordens de serviço do sistema
                          </p>
                        </div>
                      </div>

                      {/* Filtros */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                              placeholder="Buscar por número, setor, equipamento..."
                              className="pl-10 rounded-2xl"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="rounded-2xl"
                            onClick={() => setShowFilters(!showFilters)}
                          >
                            <Filter className="h-4 w-4 mr-2" />
                            Filtros
                          </Button>
                        </div>
                      </div>

                      {/* Painel de Filtros */}
                      {showFilters && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-muted/50 rounded-2xl p-4 space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Status</Label>
                              <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Todos os status" />
                            </SelectTrigger>
                            <SelectContent>
                                  <SelectItem value="all">Todos</SelectItem>
                                  <SelectItem value="pending">Em Andamento</SelectItem>
                                  <SelectItem value="completed">Concluídas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                              <Label>Prioridade</Label>
                              <Select value={filterPriority} onValueChange={setFilterPriority}>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Todas as prioridades" />
                            </SelectTrigger>
                            <SelectContent>
                                  <SelectItem value="all">Todas</SelectItem>
                              <SelectItem value="Alta">Alta</SelectItem>
                                  <SelectItem value="normal">Normal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                              <Label>Setor</Label>
                              <Select value={filterSector} onValueChange={setFilterSector}>
                                <SelectTrigger className="rounded-xl">
                                  <SelectValue placeholder="Todos os setores" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">Todos</SelectItem>
                                  {getUniqueSectors().map((sector) => (
                                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                        </div>
                        </div>
                          <div className="flex gap-2 pt-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSearchTerm('')
                                setFilterStatus('all')
                                setFilterPriority('all')
                                setFilterSector('all')
                              }}
                              className="rounded-xl"
                            >
                              Limpar Filtros
                            </Button>
                      </div>
                        </motion.div>
                      )}

                      {/* OSs Pendentes */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <h3 className="text-lg font-semibold">Em Andamento ({getFilteredOrders(workOrders.filter(os => os.status !== 'Concluído')).length})</h3>
                      </div>

                        {getFilteredOrders(workOrders.filter(os => os.status !== 'Concluído')).length === 0 ? (
                          <div className="text-center py-12">
                            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Nenhuma OS em andamento</p>
                          </div>
                        ) : (
                          <div className="grid gap-4">
                            {getFilteredOrders(workOrders.filter(os => os.status !== 'Concluído'))
                              .map((os: any) => (
                                <motion.div
                                  key={os.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-card rounded-2xl p-4 md:p-6 border hover:shadow-lg transition-all duration-300"
                                >
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg text-primary">
                                          {os.numero_os || os.numeroOS || 'N/A'}
                                        </span>
                                        <Badge 
                                          className={`text-xs ${
                                            os.prioridade === 'Alta'
                                              ? 'bg-red-100 text-red-700 border-red-200' 
                                              : os.prioridade === 'Média'
                                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                              : 'bg-green-100 text-green-700 border-green-200'
                                          }`}
                                        >
                                          {os.prioridade || 'Normal'}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {os.status}
                                        </Badge>
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                        <div><strong>Setor:</strong> {os.setor}</div>
                                        <div><strong>Local:</strong> {os.local || os.equipamento || 'N/A'}</div>
                                        <div><strong>Solicitante:</strong> {os.solicitante}</div>
                                        <div><strong>Data:</strong> {formatDate(os.data_solicitacao || os.data || os.created_at)}</div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                              <Button
                                variant="outline"
                                        size="sm"
                                        onClick={() => handleViewOS(os)}
                                        className="rounded-xl"
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Ver
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEditOS(os)}
                                        className="rounded-xl"
                                      >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Editar
                              </Button>
                            </div>
                                  </div>
                                </motion.div>
                              ))}
                              </div>
                            )}
                          </div>

                      {/* OSs Concluídas */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <h3 className="text-lg font-semibold">Concluídas ({getFilteredOrders(workOrders.filter(os => os.status === 'Concluído')).length})</h3>
                        </div>

                        {getFilteredOrders(workOrders.filter(os => os.status === 'Concluído')).length === 0 ? (
                          <div className="text-center py-12">
                            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Nenhuma OS concluída</p>
                          </div>
                        ) : (
                          <div className="grid gap-4">
                            {getFilteredOrders(workOrders.filter(os => os.status === 'Concluído'))
                              .map((os: any) => (
                                <motion.div
                                  key={os.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="bg-card rounded-2xl p-4 md:p-6 border hover:shadow-lg transition-all duration-300"
                                >
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                        <span className="font-bold text-lg text-primary">
                                          {os.numero_os || os.numeroOS || 'N/A'}
                                        </span>
                                        <Badge 
                                          className={`text-xs ${
                                            os.prioridade === 'Alta'
                                              ? 'bg-red-100 text-red-700 border-red-200' 
                                              : os.prioridade === 'Média'
                                              ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                              : 'bg-green-100 text-green-700 border-green-200'
                                          }`}
                                        >
                                          {os.prioridade || 'Normal'}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
                                          {os.status}
                                        </Badge>
                              </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                        <div><strong>Setor:</strong> {os.setor}</div>
                                        <div><strong>Local:</strong> {os.local || os.equipamento || 'N/A'}</div>
                                        <div><strong>Solicitante:</strong> {os.solicitante}</div>
                                        <div><strong>Data:</strong> {formatDate(os.data_solicitacao || os.data || os.created_at)}</div>
                            </div>
                          </div>
                                    <div className="flex gap-2">
                        <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewOS(os)}
                                        className="rounded-xl"
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Ver
                        </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePrintOS()}
                                        className="rounded-xl"
                                      >
                                        <Printer className="h-4 w-4 mr-1" />
                                        Imprimir
                        </Button>
                      </div>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </section>
                </TabsContent>

                <TabsContent value="new-order" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      {/* Header */}
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900">Nova Ordem de Serviço</h2>
                          <p className="text-gray-600 mt-2">Preencha os dados para criar uma nova OS</p>
                        </div>
                      </div>

                      {/* Formulário */}
                      <Card className="rounded-3xl">
                        <CardContent className="p-6 md:p-8">
                          <form onSubmit={(e) => { e.preventDefault(); handleCreateNewOS(); }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Solicitante */}
                              <div className="space-y-2">
                                <Label htmlFor="solicitante" className="text-sm font-medium">
                                  Solicitante *
                                </Label>
                                <Input
                                  id="solicitante"
                                  value={newOSForm.solicitante}
                                  onChange={(e) => setNewOSForm({...newOSForm, solicitante: e.target.value})}
                                  placeholder="Nome do solicitante"
                                  className="rounded-xl"
                                  required
                                />
                              </div>

                              {/* Setor */}
                              <div className="space-y-2">
                                <Label htmlFor="setor" className="text-sm font-medium">
                                  Setor *
                                </Label>
                                <Select 
                                  value={newOSForm.setor} 
                                  onValueChange={(value) => setNewOSForm({...newOSForm, setor: value})}
                                >
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Selecione o setor" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Portaria">Portaria</SelectItem>
                                    <SelectItem value="Recepção">Recepção</SelectItem>
                                    <SelectItem value="RH">RH</SelectItem>
                                    <SelectItem value="Comercial">Comercial</SelectItem>
                                    <SelectItem value="Engenharia">Engenharia</SelectItem>
                                    <SelectItem value="Controladoria">Controladoria</SelectItem>
                                    <SelectItem value="Financeiro">Financeiro</SelectItem>
                                    <SelectItem value="Diretoria">Diretoria</SelectItem>
                                    <SelectItem value="Projetos">Projetos</SelectItem>
                                    <SelectItem value="Acabamento">Acabamento</SelectItem>
                                    <SelectItem value="Mobiliário">Mobiliário</SelectItem>
                                    <SelectItem value="CPC">CPC</SelectItem>
                                    <SelectItem value="Caldeiraria">Caldeiraria</SelectItem>
                                    <SelectItem value="Recebimento">Recebimento</SelectItem>
                                    <SelectItem value="Laboratório">Laboratório</SelectItem>
                                    <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                                    <SelectItem value="Logística">Logística</SelectItem>
                                    <SelectItem value="Show room">Show room</SelectItem>
                                    <SelectItem value="Estacionamento 1">Estacionamento 1</SelectItem>
                                    <SelectItem value="Estacionamento 2">Estacionamento 2</SelectItem>
                                    <SelectItem value="Almoxarifado">Almoxarifado</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Data da Solicitação */}
                              <div className="space-y-2">
                                <Label htmlFor="data_solicitacao" className="text-sm font-medium">
                                  Data da Solicitação *
                                </Label>
                                <Input
                                  id="data_solicitacao"
                                  type="date"
                                  value={newOSForm.data_solicitacao}
                                  onChange={(e) => setNewOSForm({...newOSForm, data_solicitacao: e.target.value})}
                                  className="rounded-xl"
                                  required
                                />
                              </div>

                              {/* Local */}
                              <div className="space-y-2">
                                <Label htmlFor="local" className="text-sm font-medium">
                                  Local *
                                </Label>
                                <Input
                                  id="local"
                                  value={newOSForm.local}
                                  onChange={(e) => setNewOSForm({...newOSForm, local: e.target.value})}
                                  placeholder="Local do problema"
                                  className="rounded-xl"
                                  required
                                />
                              </div>

                              {/* Prioridade */}
                              <div className="space-y-2">
                                <Label htmlFor="prioridade" className="text-sm font-medium">
                                  Prioridade *
                                </Label>
                                <Select 
                                  value={newOSForm.prioridade} 
                                  onValueChange={(value) => setNewOSForm({...newOSForm, prioridade: value})}
                                >
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Selecione a prioridade" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Baixa">Baixa</SelectItem>
                                    <SelectItem value="Média">Média</SelectItem>
                                    <SelectItem value="Alta">Alta</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Tipo de Manutenção */}
                              <div className="space-y-2">
                                <Label htmlFor="tipo_manutencao" className="text-sm font-medium">
                                  Tipo de Manutenção *
                                </Label>
                                <Select 
                                  value={newOSForm.tipo_manutencao} 
                                  onValueChange={(value) => setNewOSForm({...newOSForm, tipo_manutencao: value})}
                                >
                                  <SelectTrigger className="rounded-xl">
                                    <SelectValue placeholder="Selecione o tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Predial">Predial</SelectItem>
                                    <SelectItem value="Mecânica">Mecânica</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Descrição */}
                            <div className="space-y-2">
                              <Label htmlFor="descricao" className="text-sm font-medium">
                                Descrição do Problema *
                              </Label>
                              <Textarea
                                id="descricao"
                                value={newOSForm.descricao}
                                onChange={(e) => setNewOSForm({...newOSForm, descricao: e.target.value})}
                                placeholder="Descreva detalhadamente o problema..."
                                className="rounded-xl min-h-[120px]"
                                required
                              />
                            </div>

                            {/* Responsável pelo Setor */}
                            <div className="space-y-2">
                              <Label htmlFor="responsavelSetor" className="text-sm font-medium">
                                Responsável pelo Setor
                              </Label>
                              <Input
                                id="responsavelSetor"
                                value={newOSForm.responsavelSetor}
                                onChange={(e) => setNewOSForm({...newOSForm, responsavelSetor: e.target.value})}
                                placeholder="Nome do responsável pelo setor"
                                className="rounded-xl"
                              />
                            </div>

                            {/* Upload de Imagem */}
                            <div className="space-y-2">
                              <Label htmlFor="fotos" className="text-sm font-medium">
                                Fotos do Problema
                              </Label>
                              <Input
                                id="fotos"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileUpload}
                                className="rounded-xl"
                              />
                              <p className="text-xs text-muted-foreground">
                                Você pode selecionar múltiplas imagens (JPG, PNG, etc.)
                              </p>
                            </div>

                            {/* Botões */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                              <Button 
                                type="submit" 
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3"
                                size="lg"
                                disabled={isCreating}
                              >
                                {isCreating ? (
                                  <>
                                    <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Criando...
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-5 w-5 mr-2" />
                                    Criar Ordem de Serviço
                                  </>
                                )}
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="flex-1 rounded-xl py-3"
                                onClick={() => setActiveTab("home")}
                                disabled={isCreating}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </section>
                </TabsContent>

                <TabsContent value="reports" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-8 text-white"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">Relatórios e Indicadores</h2>
                          <p className="max-w-[600px] text-white/80">
                            Análise completa das ordens de serviço com filtros por período, setor e tipo de manutenção.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Gráfico - OSs por Mês
                        </CardTitle>
                        <CardDescription>Evolução mensal em tempo real</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Gráfico de Linha Mensal */}
                        <div className="space-y-3">
                          {(() => {
                            const monthCounts: { [key: string]: number } = {};
                            workOrders.forEach(os => {
                              const month = new Date(os.created).toLocaleDateString('pt-BR', { 
                                month: 'short', 
                                year: '2-digit' 
                              });
                              monthCounts[month] = (monthCounts[month] || 0) + 1;
                            });
                            
                            const maxCount = Math.max(...Object.values(monthCounts), 1);
                            
                            return Object.entries(monthCounts)
                              .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
                              .slice(-6) // últimos 6 meses
                              .map(([month, count], index) => {
                                const countNumber = count as number;
                                return (
                                  <motion.div
                                    key={month}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-12 text-xs font-medium text-muted-foreground">
                                      {month}
                        </div>
                                    <div className="flex-1 relative">
                                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                          initial={{ width: 0 }}
                                          animate={{ width: `${(countNumber / maxCount) * 100}%` }}
                                          transition={{ duration: 1.5, delay: index * 0.1 }}
                          />
                        </div>
                                      <div className="absolute -top-6 right-0 text-xs font-bold text-blue-600">
                                        {countNumber}
                        </div>
                        </div>
                                  </motion.div>
                                );
                              });
                          })()}
                        </div>
                        
                        {workOrders.length === 0 && (
                          <div className="text-center py-4 text-muted-foreground">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">Nenhuma OS para exibir</p>
                        </div>
                        )}
                        
                        {/* Indicador de atualização */}
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full"
                          />
                          Evolução mensal
                      </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          Gráfico - Tipos de Manutenção
                        </CardTitle>
                        <CardDescription>Distribuição por categoria</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Gráfico de Pizza Simplificado */}
                        <div className="space-y-2">
                          {(() => {
                            const typeCounts: { [key: string]: number } = {};
                            workOrders.forEach(os => {
                              const type = os.tipoManutencao || 'outros';
                              typeCounts[type] = (typeCounts[type] || 0) + 1;
                            });
                            
                            const total = Object.values(typeCounts).reduce((sum, count) => sum + (count as number), 0);
                            
                            return Object.entries(typeCounts)
                              .sort((a, b) => (b[1] as number) - (a[1] as number))
                              .slice(0, 4)
                              .map(([type, count], index) => {
                                const countNumber = count as number;
                                const percentage = total > 0 ? Math.round((countNumber / total) * 100) : 0;
                                const typeNames: { [key: string]: string } = {
                                  'eletrica': 'Elétrica',
                                  'mecanica': 'Mecânica', 
                                  'predial': 'Predial',
                                  'tubulacao': 'Hidráulica',
                                  'corretiva': 'Corretiva',
                                  'preventiva': 'Preventiva',
                                  'preditiva': 'Preditiva'
                                };
                                
                                return (
                                  <motion.div
                                    key={type}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${
                                        index === 0 ? 'bg-purple-500' : 
                                        index === 1 ? 'bg-green-500' : 
                                        index === 2 ? 'bg-orange-500' : 'bg-pink-500'
                                      }`} />
                                      <span className="text-sm font-medium">
                                        {typeNames[type] || type}
                                      </span>
                            </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-muted-foreground">{percentage}%</span>
                                      <span className="text-sm font-bold">{countNumber}</span>
                                </div>
                                  </motion.div>
                                );
                              });
                          })()}
                        </div>
                        
                        {workOrders.length === 0 && (
                          <div className="text-center py-4 text-muted-foreground">
                            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">Nenhuma OS para exibir</p>
                              </div>
                            )}
                        
                        {/* Indicador de atualização */}
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-2 h-2 border border-purple-500 border-t-transparent rounded-full"
                          />
                          Categorias ativas
                          </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Relatório Inteligente
                        </CardTitle>
                        <CardDescription>Análise completa mensal</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Seletor de Mês/Ano */}
                        <div className="grid grid-cols-2 gap-2">
                          <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="px-3 py-2 rounded-xl border text-sm"
                          >
                            {Array.from({length: 12}, (_, i) => (
                              <option key={i} value={i}>
                                {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'long' })}
                              </option>
                            ))}
                          </select>
                          <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="px-3 py-2 rounded-xl border text-sm"
                          >
                            <option value={2024}>2024</option>
                            <option value={2025}>2025</option>
                          </select>
                        </div>

                        {/* Preview do Relatório */}
                        <div className="bg-muted/50 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-1">Preview do Relatório:</div>
                          <div className="text-sm font-medium">
                            {new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', { 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                              </div>
                          <div className="text-xs text-muted-foreground">
                            {(() => {
                              const monthOrders = workOrders.filter(os => {
                                const osDate = new Date(os.created);
                                return osDate.getMonth() === selectedMonth && osDate.getFullYear() === selectedYear;
                              });
                              return `${monthOrders.length} OSs encontradas`;
                            })()}
                        </div>
                      </div>

                        <Button
                          className="w-full rounded-2xl"
                          onClick={() => setShowReportModal(true)}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Gerar Relatório
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Seção Explicativa dos Gráficos */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="rounded-3xl bg-muted/30 p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-red-500 rounded-full"
                      />
                      <h3 className="text-lg font-semibold">Como Funcionam os Gráficos Dinâmicos</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="space-y-2">
                        <h4 className="font-medium text-foreground">📊 Atualização Automática</h4>
                        <p>Os gráficos se atualizam automaticamente a cada 30 segundos, refletindo as mudanças em tempo real das Ordens de Serviço.</p>
                        </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">🎨 Cores Inteligentes</h4>
                        <p>Cada setor recebe uma cor única: vermelho para o mais ativo, seguido por laranja, amarelo, verde e azul.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">📈 Animações Fluidas</h4>
                        <p>As barras crescem de forma animada para proporcionar uma experiência visual agradável e moderna.</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">⚡ Performance Otimizada</h4>
                        <p>O sistema calcula automaticamente as proporções e exibe apenas os 5 setores mais ativos.</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-muted">
                      <p className="text-xs text-muted-foreground text-center">
                        💡 <strong>Dica:</strong> Crie novas OSs para ver os gráficos se atualizarem instantaneamente!
                      </p>
                  </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-8 text-white"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">Configurações do Sistema</h2>
                          <p className="max-w-[600px] text-white/80">
                            Gerencie usuários, perfis de acesso e configurações gerais do sistema.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Sistema de Notificações
                        </CardTitle>
                        <CardDescription>Usuários cadastrados para receber emails de novas OSs</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                            <p className="text-sm text-green-900">
                              <strong>✅ Sistema Ativo</strong><br />
                              Usuários cadastrados na tabela <code>users</code> do Supabase recebem automaticamente 
                              emails detalhados sempre que uma nova OS é criada.
                            </p>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-2">
                            <p><strong>Usuários configurados:</strong></p>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                <Badge variant="outline" className="bg-green-100">✓</Badge>
                                <span>Administrador (TI)</span>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                                <Badge variant="outline" className="bg-green-100">✓</Badge>
                                <span>Gerente (Manutenção)</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground pt-2 border-t">
                            💡 Para adicionar mais usuários, insira-os na tabela <code>users</code> no Supabase
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          Ações Rápidas
                        </CardTitle>
                        <CardDescription>Ferramentas e exportações</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Button 
                            variant="outline" 
                            className="w-full rounded-2xl justify-start bg-transparent"
                            onClick={() => setShowEmailManager(true)}
                          >
                            📧 Enviar Relatório Mensal
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full rounded-2xl justify-start bg-transparent"
                            onClick={handleSyncSheets}
                            disabled={isSyncing}
                          >
                            {isSyncing ? (
                              <>
                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                Sincronizando...
                              </>
                            ) : (
                              '📊 Exportar para Google Sheets'
                            )}
                          </Button>

                          <div className="pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-2">
                              <strong>Informações do Sistema:</strong>
                            </p>
                            <div className="space-y-1 text-xs text-muted-foreground">
                              <div className="flex justify-between">
                                <span>Versão:</span>
                                <span className="font-mono">1.0.0</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Banco de Dados:</span>
                                <Badge variant="outline" className="text-xs bg-green-100">✓ Supabase</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Backup:</span>
                                <Badge variant="outline" className="text-xs bg-green-100">✓ Google Sheets</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          🗄️ Histórico de OSs Arquivadas
                        </CardTitle>
                        <CardDescription>Visualizar OSs antigas arquivadas no Google Sheets</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                            <p className="text-sm text-blue-900">
                              <strong>Sistema de Arquivamento:</strong><br />
                              Quando o sistema atinge 500 OSs, as 200 mais antigas são automaticamente arquivadas no Google Sheets. 
                              Todas permanecem acessíveis aqui! 🛡️
                            </p>
                          </div>
                          
                          <Button
                            className="w-full rounded-2xl justify-start"
                            variant="outline"
                            onClick={fetchArchivedOrders}
                            disabled={isLoadingArchived}
                          >
                            {isLoadingArchived ? (
                              <>
                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                Carregando...
                              </>
                            ) : (
                              <>
                                <Download className="h-4 w-4 mr-2" />
                                Ver Histórico ({archivedOrders.length} OSs arquivadas)
                              </>
                            )}
                          </Button>

                          {archivedOrders.length > 0 && (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                              <p className="text-sm font-semibold text-muted-foreground">
                                Últimas OSs arquivadas:
                              </p>
                              {archivedOrders.slice(0, 5).map((os: any, index: number) => (
                                <div 
                                  key={`archived-preview-${index}`}
                                  className="p-3 bg-muted/50 rounded-xl text-sm space-y-1 cursor-pointer hover:bg-muted transition-colors"
                                  onClick={() => {
                                    setSelectedOS(os);
                                    setShowOSDetails(true);
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold">{os.numero_os}</span>
                                    <Badge variant="outline" className="text-xs bg-blue-100">
                                      📦 Arquivada
                                    </Badge>
                                  </div>
                                  <div className="text-muted-foreground">
                                    {os.setor} • {os.data_solicitacao}
                                  </div>
                                </div>
                              ))}
                              {archivedOrders.length > 5 && (
                                <p className="text-xs text-center text-muted-foreground pt-2">
                                  + {archivedOrders.length - 5} OSs arquivadas
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </main>
      </div>

      {/* Modal de Detalhes da OS */}
      {showOSDetails && selectedOS && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowOSDetails(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-primary">Detalhes da OS</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowOSDetails(false)}
                className="rounded-2xl h-8 w-8 md:h-10 md:w-10"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Número da OS</label>
                  <p className="text-lg font-bold text-primary">{selectedOS.numero_os || selectedOS.numeroOS}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className="text-sm">{selectedOS.status}</Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Setor</label>
                  <p className="text-base">{selectedOS.setor}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Data</label>
                  <p className="text-base">{formatDate(selectedOS.data_solicitacao || selectedOS.data || selectedOS.created_at)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Equipamento</label>
                  <p className="text-base">{selectedOS.local || selectedOS.equipamento}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Manutenção</label>
                  <p className="text-base capitalize">{selectedOS.tipo_manutencao || selectedOS.tipoManutencao}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Prioridade</label>
                  <Badge variant={selectedOS.prioridade === 'Alta' ? 'destructive' : selectedOS.prioridade === 'Média' ? 'secondary' : 'outline'}>
                    {selectedOS.prioridade || 'Normal'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                  <p className="text-base">{selectedOS.created_at ? new Date(selectedOS.created_at).toLocaleString('pt-BR') : (selectedOS.created ? new Date(selectedOS.created).toLocaleString('pt-BR') : 'N/A')}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Solicitante</label>
                <p className="text-base">{selectedOS.solicitante}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Responsável pelo Setor</label>
                <p className="text-base">{selectedOS.responsavel_setor || selectedOS.responsavelSetor || 'A definir'}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Descrição do Problema</label>
                <div className="bg-muted p-4 rounded-2xl">
                  <p className="text-base whitespace-pre-wrap">{selectedOS.descricao}</p>
                </div>
              </div>
              
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Fotos Anexadas</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedOS.fotos && selectedOS.fotos.length > 0 ? (
                    selectedOS.fotos.map((foto: any, index: number) => {
                      const isBase64 = typeof foto === 'string' && foto.startsWith('data:image')
                      return (
                        <div key={index} className="bg-muted p-2 rounded-2xl">
                          {isBase64 ? (
                            <img 
                              src={foto} 
                              alt={`Foto ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedImage(foto)}
                            />
                          ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex flex-col items-center justify-center mb-2">
                              <span className="text-4xl mb-2">📷</span>
                              <span className="text-xs text-gray-600 font-medium">Imagem</span>
                      </div>
                          )}
                          <p className="text-xs text-center truncate font-medium">
                            {isBase64 ? `Foto ${index + 1}` : (foto.name || foto)}
                          </p>
                          <button 
                            className="w-full mt-2 text-xs bg-primary text-white px-2 py-1 rounded-lg hover:bg-primary/90"
                            onClick={() => isBase64 ? setSelectedImage(foto) : alert(`Arquivo: ${foto}`)}
                          >
                            {isBase64 ? 'Ver Imagem' : 'Ver Detalhes'}
                          </button>
                  </div>
                      )
                    })
                  ) : (
                    <div className="col-span-full text-center text-muted-foreground py-6">
                      <span className="text-4xl block mb-2">📷</span>
                      <span className="text-sm">Nenhuma foto anexada</span>
                </div>
              )}
                </div>
              </div>
              
              <div className="space-y-3 md:space-y-4 pt-3 md:pt-4 border-t">
                {/* Ações de Status */}
                <div className="space-y-2 md:space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">Ações da OS:</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {selectedOS.status !== 'Concluído' ? (
                      <Button 
                        className="rounded-2xl bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateOSStatus(selectedOS.id, 'Concluído')}
                      >
                        ✅ Concluir OS
                      </Button>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">OS Concluída</span>
                        </div>
                        <Button 
                          variant="outline" 
                          className="rounded-2xl bg-transparent border-blue-500 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleUpdateOSStatus(selectedOS.id, 'Em Andamento')}
                        >
                          🔄 Reabrir OS
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Outras Ações */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button 
                    variant="outline" 
                    className="rounded-2xl bg-transparent text-sm"
                    onClick={() => handleEditOS(selectedOS)}
                  >
                    📝 Editar OS
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-2xl bg-transparent text-sm"
                    onClick={handlePrintOS}
                  >
                    🖨️ Imprimir
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-2xl bg-transparent text-sm sm:ml-auto"
                    onClick={() => setShowOSDetails(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      )}

      {/* Modal do Relatório Inteligente */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header do Relatório */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Relatório Inteligente de Manutenção</h2>
                <p className="text-muted-foreground">
                  {new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={downloadReport}
                  className="rounded-xl"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Relatório
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowReportModal(false)}
                  className="rounded-xl"
                >
                  ✕ Fechar
                </Button>
              </div>
            </div>

            {(() => {
              const monthOrders = workOrders.filter(os => {
                const osDate = new Date(os.created_at || os.created);
                return osDate.getMonth() === selectedMonth && osDate.getFullYear() === selectedYear;
              });

              const completedOrders = monthOrders.filter(os => os.status === 'Concluído');
              const pendingOrders = monthOrders.filter(os => os.status !== 'Concluído');
              const urgentOrders = monthOrders.filter(os => os.prioridade === 'Alta');

              // Análise por tipo
              const typeAnalysis = monthOrders.reduce((acc, os) => {
                const type = os.tipoManutencao || 'outros';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              // Análise por setor
              const sectorAnalysis = monthOrders.reduce((acc, os) => {
                acc[os.setor] = (acc[os.setor] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              return (
                <div className="space-y-6">
                  {/* Resumo Executivo */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-red-800 mb-4">📊 Resumo Executivo</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-700">{monthOrders.length}</div>
                        <div className="text-sm text-red-600">Total de OSs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">{completedOrders.length}</div>
                        <div className="text-sm text-green-600">Concluídas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-700">{pendingOrders.length}</div>
                        <div className="text-sm text-orange-600">Em Andamento</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-700">{urgentOrders.length}</div>
                        <div className="text-sm text-purple-600">Alta Prioridade</div>
                      </div>
                    </div>
                  </div>

                  {/* Análise Textual */}
                  <div className="bg-muted/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">📝 Análise do Período</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="mb-3">
                        Durante o mês de <strong>{new Date(selectedYear, selectedMonth).toLocaleDateString('pt-BR', { month: 'long' })}</strong>, 
                        foram registradas <strong>{monthOrders.length} ordens de serviço</strong>, 
                        representando {monthOrders.length > 0 ? 
                          `uma taxa de conclusão de ${Math.round((completedOrders.length / monthOrders.length) * 100)}%` : 
                          'nenhuma atividade registrada'
                        }.
                      </p>
                      
                      {monthOrders.length > 0 && (
                        <div>
                          <p className="mb-3">
                            Durante este período, foram identificadas as principais demandas por tipo e setor.
                          </p>

                          {urgentOrders.length > 0 && (
                            <p className="text-orange-700 font-medium">
                              ⚠️ Atenção: {urgentOrders.length} OSs foram marcadas como alta prioridade, 
                              representando {Math.round((urgentOrders.length / monthOrders.length) * 100)}% do total.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gráficos */}
                  {monthOrders.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Gráfico por Tipo */}
                      <div className="bg-white rounded-2xl p-6 border">
                        <h4 className="font-bold mb-4">📊 Distribuição por Tipo</h4>
                        <div className="space-y-3">
                          {Object.entries(typeAnalysis)
                            .sort((a, b) => (b[1] as number) - (a[1] as number))
                            .map(([type, count], index) => {
                              const countNum = count as number;
                              return (
                              <div key={type} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    index === 0 ? 'bg-blue-500' : 
                                    index === 1 ? 'bg-green-500' : 
                                    index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                                  }`} />
                                  <span className="text-sm capitalize">{type}</span>
                                </div>
                                <span className="font-bold">{countNum}</span>
                              </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Gráfico por Setor */}
                      <div className="bg-white rounded-2xl p-6 border">
                        <h4 className="font-bold mb-4">🏢 Distribuição por Setor</h4>
                        <div className="space-y-3">
                          {Object.entries(sectorAnalysis)
                            .sort((a, b) => (b[1] as number) - (a[1] as number))
                            .slice(0, 5)
                            .map(([sector, count], index) => {
                              const countNum = count as number;
                              return (
                              <div key={sector} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    index === 0 ? 'bg-red-500' : 
                                    index === 1 ? 'bg-yellow-500' : 
                                    index === 2 ? 'bg-green-500' : 
                                    index === 3 ? 'bg-blue-500' : 'bg-pink-500'
                                  }`} />
                                  <span className="text-sm">{sector}</span>
                                </div>
                                <span className="font-bold">{countNum}</span>
                              </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recomendações */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-blue-800 mb-4">💡 Recomendações</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {monthOrders.length === 0 ? (
                        <p className="text-blue-700">Período sem atividades registradas. Sistema funcionando corretamente.</p>
                      ) : (
                        <>
                          {pendingOrders.length > completedOrders.length && (
                            <div className="flex gap-2">
                              <span className="text-orange-600">⚠️</span>
                              <span className="text-blue-700">Priorizar conclusão das OSs pendentes para melhorar eficiência.</span>
                            </div>
                          )}
                          
                          {urgentOrders.length > monthOrders.length * 0.3 && (
                            <div className="flex gap-2">
                              <span className="text-red-600">🚨</span>
                              <span className="text-blue-700">Alto volume de OSs de alta prioridade. Revisar processos preventivos.</span>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <span className="text-green-600">✅</span>
                            <span className="text-blue-700">Manter registro detalhado para análises futuras.</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <span className="text-purple-600">📈</span>
                            <span className="text-blue-700">Implementar manutenção preventiva nos setores mais ativos.</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Footer do Relatório */}
                  <div className="text-center text-sm text-muted-foreground border-t pt-4">
                    Relatório gerado automaticamente em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                    <br />
                    Sistema ManutençãoPro - Gestão Inteligente de Ordens de Serviço
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>
      )}

      {/* Modal de Edição da OS */}
      {showEditModal && selectedOS && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowEditModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-primary">Editar OS</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowEditModal(false)}
                className="rounded-2xl h-8 w-8 md:h-10 md:w-10"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-setor">Setor</Label>
                  <Input
                    id="edit-setor"
                    value={editForm.setor || ''}
                    onChange={(e) => setEditForm({...editForm, setor: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-equipamento">Equipamento</Label>
                  <Input
                    id="edit-equipamento"
                    value={editForm.equipamento || ''}
                    onChange={(e) => setEditForm({...editForm, equipamento: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tipo">Tipo de Manutenção</Label>
                  <Select 
                    value={editForm.tipo_manutencao || ''} 
                    onValueChange={(value) => setEditForm({...editForm, tipo_manutencao: value})}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Predial">Predial</SelectItem>
                      <SelectItem value="Mecânica">Mecânica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prioridade">Prioridade</Label>
                  <Select 
                    value={editForm.prioridade || ''} 
                    onValueChange={(value) => setEditForm({...editForm, prioridade: value})}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-solicitante">Solicitante</Label>
                  <Input
                    id="edit-solicitante"
                    value={editForm.solicitante || ''}
                    onChange={(e) => setEditForm({...editForm, solicitante: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-responsavel">Responsável pelo Setor</Label>
                  <Input
                    id="edit-responsavel"
                    value={editForm.responsavel_setor || ''}
                    onChange={(e) => setEditForm({...editForm, responsavel_setor: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-data">Data</Label>
                  <Input
                    id="edit-data"
                    type="date"
                    value={editForm.data || ''}
                    onChange={(e) => setEditForm({...editForm, data: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-descricao">Descrição do Problema</Label>
                <Textarea
                  id="edit-descricao"
                  value={editForm.descricao || ''}
                  onChange={(e) => setEditForm({...editForm, descricao: e.target.value})}
                  rows={4}
                  className="rounded-xl"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 rounded-xl"
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal do Gerenciador de Emails */}
      {showEmailManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary">Gerenciador de Relatórios por Email</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowEmailManager(false)}
                className="rounded-2xl h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <EmailReportManager onClose={() => setShowEmailManager(false)} />
          </motion.div>
        </div>
      )}

      {/* Modal de Visualização de Imagem */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={selectedImage} 
              alt="Visualização" 
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Toast de Notificação */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 z-[101] bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 min-w-[300px] border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            {toastMessage.includes('✅') ? (
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            )}
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {toastMessage.replace('✅ ', '').replace('❌ ', '')}
            </p>
            <button
              onClick={() => setShowToast(false)}
              className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
