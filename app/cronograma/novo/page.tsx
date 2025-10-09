"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Wrench,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Save
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FormData {
  equipamento: string
  local: string
  tipo_manutencao: string
  data_programada: string
  hora_programada: string
  responsavel: string
  prioridade: 'Baixa' | 'Média' | 'Alta'
  observacoes: string
}

export default function NovoAgendamentoPage() {
  const [formData, setFormData] = useState<FormData>({
    equipamento: '',
    local: '',
    tipo_manutencao: '',
    data_programada: '',
    hora_programada: '',
    responsavel: '',
    prioridade: 'Média',
    observacoes: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Tipos de manutenção disponíveis
  const tiposManutencao = [
    'Limpeza de Filtros',
    'Inspeção Geral',
    'Teste de Funcionamento',
    'Verificação de Sensores',
    'Manutenção Preventiva',
    'Calibração',
    'Substituição de Peças',
    'Lubrificação',
    'Verificação Elétrica',
    'Teste de Segurança',
    'Outros'
  ]

  // Equipamentos comuns
  const equipamentosComuns = [
    'Ar Condicionado',
    'Elevador',
    'Gerador de Emergência',
    'Sistema de Incêndio',
    'Bomba de Água',
    'Compressor de Ar',
    'Sistema de Ventilação',
    'Iluminação de Emergência',
    'Portão Automático',
    'Sistema de Segurança',
    'Outros'
  ]

  // Locais comuns
  const locaisComuns = [
    'Sala de Reuniões',
    'Prédio Principal',
    'Subsolo',
    'Térreo',
    '1º Andar',
    '2º Andar',
    '3º Andar',
    'Cozinha',
    'Recepção',
    'Estacionamento',
    'Outros'
  ]

  // Responsáveis comuns
  const responsaveisComuns = [
    'João Silva',
    'Maria Santos',
    'Carlos Oliveira',
    'Ana Costa',
    'Pedro Lima',
    'Sistema Automático',
    'Outros'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos obrigatórios
    if (!formData.equipamento || !formData.local || !formData.tipo_manutencao || !formData.data_programada) {
      setError('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/cronograma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Limpar formulário
        setFormData({
          equipamento: '',
          local: '',
          tipo_manutencao: '',
          data_programada: '',
          hora_programada: '',
          responsavel: '',
          prioridade: 'Média',
          observacoes: ''
        })
      } else {
        setError(data.error || 'Erro ao criar manutenção preventiva')
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Manutenção Agendada!
              </h2>
              <p className="text-gray-600 mb-6">
                A manutenção preventiva foi agendada com sucesso.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                >
                  Nova Manutenção
                </Button>
                <Button
                  onClick={() => window.location.href = '/cronograma'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ver Cronograma
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => window.location.href = '/cronograma'}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                Nova Manutenção Preventiva
              </h1>
              <p className="text-gray-600 mt-2">
                Agende uma nova manutenção preventiva no cronograma
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-600" />
                Dados da Manutenção
              </CardTitle>
              <CardDescription>
                Preencha os dados da manutenção preventiva que será agendada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Equipamento */}
                <div className="space-y-2">
                  <Label htmlFor="equipamento" className="text-sm font-medium">
                    Equipamento *
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.equipamento}
                      onValueChange={(value) => handleInputChange('equipamento', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione o equipamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipamentosComuns.map((equipamento) => (
                          <SelectItem key={equipamento} value={equipamento}>
                            {equipamento}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Ou digite um equipamento personalizado"
                      value={formData.equipamento}
                      onChange={(e) => handleInputChange('equipamento', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Local */}
                <div className="space-y-2">
                  <Label htmlFor="local" className="text-sm font-medium">
                    Local *
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.local}
                      onValueChange={(value) => handleInputChange('local', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        {locaisComuns.map((local) => (
                          <SelectItem key={local} value={local}>
                            {local}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Ou digite um local personalizado"
                      value={formData.local}
                      onChange={(e) => handleInputChange('local', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Tipo de Manutenção */}
                <div className="space-y-2">
                  <Label htmlFor="tipo_manutencao" className="text-sm font-medium">
                    Tipo de Manutenção *
                  </Label>
                  <Select
                    value={formData.tipo_manutencao}
                    onValueChange={(value) => handleInputChange('tipo_manutencao', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de manutenção" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposManutencao.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data e Hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data_programada" className="text-sm font-medium">
                      Data Programada *
                    </Label>
                    <Input
                      type="date"
                      value={formData.data_programada}
                      onChange={(e) => handleInputChange('data_programada', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora_programada" className="text-sm font-medium">
                      Horário (opcional)
                    </Label>
                    <Input
                      type="time"
                      value={formData.hora_programada}
                      onChange={(e) => handleInputChange('hora_programada', e.target.value)}
                    />
                  </div>
                </div>

                {/* Responsável e Prioridade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="responsavel" className="text-sm font-medium">
                      Responsável
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.responsavel}
                        onValueChange={(value) => handleInputChange('responsavel', value)}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecione o responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          {responsaveisComuns.map((responsavel) => (
                            <SelectItem key={responsavel} value={responsavel}>
                              {responsavel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Ou digite um nome"
                        value={formData.responsavel}
                        onChange={(e) => handleInputChange('responsavel', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prioridade" className="text-sm font-medium">
                      Prioridade
                    </Label>
                    <Select
                      value={formData.prioridade}
                      onValueChange={(value) => handleInputChange('prioridade', value as 'Baixa' | 'Média' | 'Alta')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-sm font-medium">
                    Observações
                  </Label>
                  <Textarea
                    placeholder="Adicione observações sobre a manutenção (opcional)"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Erro */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Erro:</span>
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}

                {/* Botões */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.href = '/cronograma'}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Agendar Manutenção
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
