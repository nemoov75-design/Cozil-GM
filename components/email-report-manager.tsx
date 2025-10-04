"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Send, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react'

interface EmailReportManagerProps {
  onClose: () => void
}

export function EmailReportManager({ onClose }: EmailReportManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSent, setLastSent] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)

  const handleSendReport = async () => {
    setIsLoading(true)
    setResults(null)
    
    try {
      const response = await fetch('/api/send-monthly-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json()
      setResults(data)
      
      if (data.success) {
        setLastSent(new Date().toLocaleString('pt-BR'))
      }
      
    } catch (error) {
      console.error('Erro ao enviar relatório:', error)
      setResults({
        success: false,
        error: 'Erro ao conectar com o servidor'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📧 Relatórios por Email
        </h2>
        <p className="text-gray-600">
          Envie relatórios mensais automaticamente para todos os usuários
        </p>
      </div>

      {/* Status do último envio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Último envio:</span>
              <Badge variant={lastSent ? "default" : "secondary"}>
                {lastSent || 'Nunca enviado'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Próximo envio:</span>
              <Badge variant="outline">
                Último dia do mês às 18:00
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Envio manual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Envio Manual
          </CardTitle>
          <CardDescription>
            Envie o relatório mensal agora para todos os usuários cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleSendReport}
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Relatório Agora
                </>
              )}
            </Button>
            
            {results && (
              <div className={`p-4 rounded-lg ${
                results.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {results.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    results.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {results.success ? 'Sucesso!' : 'Erro!'}
                  </span>
                </div>
                
                <p className={`text-sm ${
                  results.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {results.message || results.error}
                </p>
                
                {results.details && (
                  <div className="mt-3 text-xs text-gray-600">
                    <p>Total: {results.details.total} usuários</p>
                    <p>Sucessos: {results.details.success}</p>
                    <p>Erros: {results.details.errors}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre o sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Como Funciona
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="font-medium">📅 Agendamento:</span>
              <span>Último dia de cada mês às 18:00</span>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-medium">👥 Destinatários:</span>
              <span>Todos os usuários cadastrados no sistema</span>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-medium">📊 Conteúdo:</span>
              <span>Relatório completo com estatísticas e recomendações</span>
            </div>
            
            <div className="flex items-start gap-2">
              <span className="font-medium">🔧 Configuração:</span>
              <span>Configure as variáveis de ambiente EMAIL_USER e EMAIL_PASS</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
