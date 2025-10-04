export default function SolicitacaoPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏢 Solicitação de Manutenção Cozil
          </h1>
          <p className="text-gray-600">
            Formulário funcionando perfeitamente!
          </p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Solicitante
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setor
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Selecione o setor</option>
                <option value="Portaria">Portaria</option>
                <option value="Recepção">Recepção</option>
                <option value="RH">RH</option>
                <option value="Comercial">Comercial</option>
                <option value="Engenharia">Engenharia</option>
                <option value="Controladoria">Controladoria</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Diretoria">Diretoria</option>
                <option value="Projetos">Projetos</option>
                <option value="Acabamento">Acabamento</option>
                <option value="Mobiliário">Mobiliário</option>
                <option value="CPC">CPC</option>
                <option value="Caldeiraria">Caldeiraria</option>
                <option value="Recebimento">Recebimento</option>
                <option value="Laboratório">Laboratório</option>
                <option value="Desenvolvimento">Desenvolvimento</option>
                <option value="Logística">Logística</option>
                <option value="Show room">Show room</option>
                <option value="Estacionamento 1">Estacionamento 1</option>
                <option value="Estacionamento 2">Estacionamento 2</option>
                <option value="Almoxarifado">Almoxarifado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Solicitação
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Local/Equipamento
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ex: Sala 205, Máquina X"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Selecione a prioridade</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Manutenção
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                <option value="">Selecione o tipo</option>
                <option value="Predial">Predial</option>
                <option value="Mecânica">Mecânica</option>
                <option value="Elétrica">Elétrica</option>
                <option value="Hidráulica">Hidráulica</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do Problema
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Descreva detalhadamente o problema ou serviço necessário..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition duration-200"
          >
            🚀 Enviar Solicitação
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 Cozil - Sistema de Gestão de Manutenção</p>
        </div>
      </div>
    </div>
  )
}