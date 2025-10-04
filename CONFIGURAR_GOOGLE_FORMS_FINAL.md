# 🚀 Configurar Google Forms - Cozil

## 📋 **PASSO A PASSO COMPLETO**

### **1. Criar o Formulário Google**

1. Acesse: https://forms.google.com
2. Clique em **"Criar um formulário em branco"**
3. Configure o título: **"Solicitação de Manutenção - Cozil"**
4. Adicione a descrição: **"Formulário para solicitação de serviços de manutenção. Todos os campos são obrigatórios."**

### **2. Adicionar os Campos**

Adicione os campos na seguinte ordem:

#### **Campo 1: Solicitante**
- Tipo: **Resposta curta**
- Título: **Solicitante**
- Marque como **obrigatório**

#### **Campo 2: Setor**
- Tipo: **Lista suspensa**
- Título: **Setor**
- Opções:
  - Portaria
  - Recepção
  - RH
  - Comercial
  - Engenharia
  - Controladoria
  - Financeiro
  - Diretoria
  - Projetos
  - Acabamento
  - Mobiliário
  - CPC
  - Caldeiraria
  - Recebimento
  - Laboratório
  - Desenvolvimento
  - Logística
  - Show room
  - Estacionamento 1
  - Estacionamento 2
  - Almoxarifado
- Marque como **obrigatório**

#### **Campo 3: Data da Solicitação**
- Tipo: **Data**
- Título: **Data da solicitação**
- Marque como **obrigatório**

#### **Campo 4: Local/Equipamento**
- Tipo: **Resposta curta**
- Título: **Local/Equipamento**
- Marque como **obrigatório**

#### **Campo 5: Prioridade**
- Tipo: **Múltipla escolha**
- Título: **Prioridade**
- Opções:
  - Baixa
  - Média
  - Alta
- Marque como **obrigatório**

#### **Campo 6: Tipo de Manutenção**
- Tipo: **Múltipla escolha**
- Título: **Tipo de Manutenção**
- Opções:
  - Predial
  - Mecânica
  - Elétrica
  - Hidráulica
- Marque como **obrigatório**

#### **Campo 7: Descrição**
- Tipo: **Parágrafo**
- Título: **Descreva o serviço...**
- Marque como **obrigatório**

#### **Campo 8: Foto (Opcional)**
- Tipo: **Carregar arquivo**
- Título: **Upload de Foto do Problema**
- **NÃO marque como obrigatório**

### **3. Configurar o Google Apps Script**

1. No formulário, clique no ícone **"⋮"** (três pontos) no canto superior direito
2. Selecione **"Script do editor"**
3. **DELETE todo o código existente**
4. **COLE o código do arquivo `google-forms-script-funcional.js`**
5. **SALVE** o projeto (Ctrl+S)
6. **DÊ UM NOME** ao projeto: "Cozil Formulario"

### **4. Configurar o Trigger**

1. No Google Apps Script, clique em **"Triggers"** (Relógio) no menu lateral
2. Clique em **"+ Adicionar trigger"**
3. Configure:
   - **Função:** `onSubmit`
   - **Tipo de evento:** `Envio do formulário`
   - **Fonte do evento:** Selecione seu formulário
4. Clique em **"Salvar"**

### **5. Testar a Conexão**

1. No Google Apps Script, selecione a função **`testConnection`**
2. Clique em **"Executar"** (▶️)
3. **AUTORIZE** as permissões se solicitado
4. Verifique o log para confirmar que funcionou

### **6. Testar o Formulário**

1. **PUBLIQUE** o formulário (botão "Enviar" no Google Forms)
2. **COPIE** o link do formulário
3. **TESTE** preenchendo todos os campos
4. **VERIFIQUE** se a OS aparece no sistema Cozil

## ✅ **RESULTADO ESPERADO**

- ✅ Formulário Google funcionando
- ✅ Dados enviados para o sistema Cozil
- ✅ OS criada automaticamente
- ✅ Integração completa

## 🔗 **URLs IMPORTANTES**

- **Sistema Cozil:** https://cozil-sistema-qxrx.vercel.app
- **Formulário Google:** (seu link personalizado)
- **Dashboard:** https://cozil-sistema-qxrx.vercel.app (login: admin@cozil.com / admin123)

## 🆘 **SE ALGO DER ERRADO**

1. **Verifique os logs** no Google Apps Script
2. **Teste a função `testConnection`**
3. **Confirme se o trigger está ativo**
4. **Verifique se o formulário está publicado**

**Pronto! Seu formulário Google está integrado com o sistema Cozil!** 🎉
