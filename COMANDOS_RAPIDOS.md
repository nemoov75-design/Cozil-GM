# ⚡ COMANDOS RÁPIDOS - Cozil-Maintenanc

## 🚀 DESENVOLVIMENTO LOCAL

### Iniciar servidor:
```powershell
cd "C:\Users\apoll\OneDrive\Área de Trabalho\Sistema-cozil"
npm run dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

### Parar servidor:
```
CTRL + C
```

---

## 🔄 GIT & DEPLOY

### Commitar mudanças:
```powershell
git add .
git commit -m "Sua mensagem aqui"
git push origin master
```

### Ver status:
```powershell
git status
```

### Ver histórico:
```powershell
git log --oneline
```

---

## 📦 DEPLOY VERCEL

### Deploy automático (após git push):
O Vercel detecta automaticamente e faz deploy!

### Deploy manual:
```powershell
npx vercel --prod
```

### Ver logs:
1. Acesse: [https://vercel.com](https://vercel.com)
2. Abra seu projeto
3. Vá em **Deployments** → último deploy → **Functions**

---

## 🗄️ SUPABASE

### Acessar:
[https://supabase.com/dashboard](https://supabase.com/dashboard)

### Executar SQL:
1. Vá em **SQL Editor**
2. Cole o código SQL
3. Clique em **RUN**

### Ver dados:
1. Vá em **Table Editor**
2. Selecione a tabela (`work_orders` ou `users`)

---

## 📊 GOOGLE SHEETS

### Acessar planilha:
[https://docs.google.com/spreadsheets/d/1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8](https://docs.google.com/spreadsheets/d/1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8)

### Sincronizar manualmente:
No sistema → **Configurações** → **📊 Exportar para Google Sheets**

---

## 📧 EMAIL (BREVO)

### Acessar dashboard:
[https://app.brevo.com](https://app.brevo.com)

### Ver emails enviados:
1. Vá em **Campaigns** → **Transactional**
2. Veja histórico de emails

---

## 🗑️ LIMPAR DADOS (PRODUÇÃO)

### 1. Limpar banco de dados:
```sql
-- No Supabase SQL Editor:
DELETE FROM work_orders;
DELETE FROM users;
ALTER SEQUENCE work_orders_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
```

### 2. Limpar Google Sheets:
1. Abra a planilha
2. Delete todas as linhas (exceto cabeçalhos)
3. Ou delete as abas inteiras

---

## 🔍 DEBUG

### Ver logs no navegador:
1. Abra o site
2. Pressione **F12**
3. Vá em **Console**

### Ver logs do servidor local:
No terminal onde rodou `npm run dev`

### Ver logs da produção:
Vercel → Projeto → Deployments → Functions

---

## 📝 SQL ÚTEIS

### Ver todas as OSs:
```sql
SELECT * FROM work_orders ORDER BY created_at DESC;
```

### Contar OSs:
```sql
SELECT COUNT(*) FROM work_orders;
```

### Ver OSs por status:
```sql
SELECT status, COUNT(*) FROM work_orders GROUP BY status;
```

### Ver OSs por prioridade:
```sql
SELECT prioridade, COUNT(*) FROM work_orders GROUP BY prioridade;
```

### Ver últimas 10 OSs:
```sql
SELECT numero_os, setor, status, created_at 
FROM work_orders 
ORDER BY created_at DESC 
LIMIT 10;
```

### Ver todos os usuários:
```sql
SELECT * FROM users WHERE active = true;
```

---

## 🛠️ MANUTENÇÃO

### Limpar cache npm:
```powershell
npm cache clean --force
```

### Reinstalar dependências:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### Atualizar dependências:
```powershell
npm update
```

---

## 📞 LINKS IMPORTANTES

| Serviço | URL |
|---------|-----|
| **Sistema (Local)** | http://localhost:3000 |
| **Sistema (Produção)** | https://cozil-maintenanc.vercel.app |
| **GitHub** | https://github.com/nemoov75-design/cozil-maintenance |
| **Vercel** | https://vercel.com |
| **Supabase** | https://supabase.com/dashboard |
| **Google Sheets** | [Link da Planilha](https://docs.google.com/spreadsheets/d/1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8) |
| **Brevo** | https://app.brevo.com |

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Erro ao rodar npm run dev:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### Porta 3000 ocupada:
```powershell
# Ver processo:
Get-NetTCPConnection | Where-Object {$_.LocalPort -eq 3000}

# Matar processo:
Stop-Process -Id [PID_DO_PROCESSO]
```

### Git push rejeitado:
```powershell
git pull origin master
git push origin master
```

---

## ✅ PRONTO!

Esses são os comandos mais usados no dia a dia! 🚀

Para mais detalhes, consulte:
- `README.md` - Visão geral do projeto
- `DEPLOY_PRODUCAO.md` - Guia completo de deploy
- `SISTEMA_ARQUIVAMENTO.md` - Sistema de backup




