# 🔥 Configuração do Firebase Cloud Messaging

## 📋 **PASSO A PASSO COMPLETO**

### **1. Configurar Firebase Console**

1. **Acesse**: https://console.firebase.google.com
2. **Projeto**: `CozilTech-Notifications`
3. **Vá em**: Configurações do projeto ⚙️
4. **Abra**: Cloud Messaging
5. **Copie**: Project ID: `coziltech-notifications`

### **2. Obter Chaves de Configuração**

1. **Vá em**: Configurações do projeto
2. **Abra**: Geral
3. **Role até**: "Seus aplicativos"
4. **Clique**: Web app (ícone `</>`)
5. **Nome**: `CozilTech Web`
6. **Copie**: As configurações que aparecem

### **3. Configurar Variáveis de Ambiente**

Adicione no Vercel e no `.env.local`:

```bash
# Firebase Configuration
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDC+W3UsqiNZmQE\n90chjIH1I8KM8Q7hoe4hxZA999Tcy5+xxYf9J6gZtnx9/5whMRmaAnUENO5d2nRK\nz+dcL1puVInCpdFxS++KDA8NJYvBQNMTG/orNBBupHw6MApOJlBEk4ZYGFTtmZCq\nz96F8J5tfrOCzdhB5whe8/GKAHsm4Yobpwrj0dl+Sp8MHGi96vU31OyBmsboaMOR\n+8DqEgrBSpxBfNmZdZUTulwVg05IQ4czxLrnlyONquRR5gGi33YGgyUql8JZPnfG\nC22lXUCh8EncOkI1fvd83dECkJbS0TXfRJBEL6PzT6riNIVpUl34LZ1wRd9GJTsg\nrAWUbBSRAgMBAAECggEAF3zi3Ue0hGw8Sljbqc/6a+Sl8EKt70KJpGnfaYesjfi9\nwTWxny6i0o4oSyl6zojSs7nuDNavjIDfl4+aKIHP3BC1E8zUAVkLf07alVPblSlR\nBDFPntrDzABmsr/MzgNRkiFPgtdTi9f/FIS8ItiMzVYBHBXeInpJiN7MTzqlm1ZE\nBwlBxmvixAUbY39JS7sk21WUJULrj32czl/8a5dP2WPhjBJinRlM2EjmuaEYPi0v\ndbVbpfI/bVfpYs2JpRYkROzYiYkTftzSzLAxKH70vKEU/8ezf2mawyoCXt+5RC/8\nSXbVGjks96rL3SS96jgSun6ZFsC98iYaZLOJ49nzrQKBgQD8uroVIjEFTXukEkxS\ntwzmE+FMqQK7KgU0gcLLo9UCraxMmpQYRMMJgj7S6EO/feM99/LwhqJRFT14b8EB\nQ87d9teNFNGxj573Wck8YRxOu4N77fRHZN8s8EHMlermbr+8LMSdNQ7MITL4Ankv\nRqKF5GiJRwYj+cA2BB+UA440KwKBgQDFf10w6Tsajqb8gz41xVp9TpwPTElKNujA\n5uL42tqCIt3/PPHP6BthAcfVOt9z1gkSsoDHpSaVVDq/vsVMjR22/ji6SBxZW6hV\nFfEiKpnyE19suSuC7xGI1IEef5SpOkvC3gLVSmSr0wcWCIk0Ybj9YXNx08fU4sAe\nR7WSj/8QMwKBgQDcoi9dz9G37WLpY8gZ1hB+tBBWmp31w8NziW0D1u1ZP0FSRwjO\n/wi+PmSWP4sVm9NNAC+o6ADAhKh7giSe9BGfGaYoVmqSdu2yx0G1YpoR6gXppV1D\nDr7/PmhTMPY3YawlnXewPufCMaGLfq1JJoMwHK1eWxDzS1AQWB0xXMFCrQKBgDoX\nfYTehZkJLssFm63bUAOdtL+3M7OVtR7QiyCh1zYCJYRnG8WIw0zkZjAtMf7zjRWn\n1cNjq5avANzXs1cSBxSFcJAyl8wc7sWgP55KI6AV3LKxQMAxq9mwkA41frfMQu6d\nuP2d9UCpQONVPW5f9DbrjDaGEbhnvhTqCNmEa4ULAoGAISXsro6IoQot5Q7gUrzU\no7rKkdRgY3vhO5yKuEsBY/dcEzS9aOLQqwDHPH2Sk2dvKL6cZm5H8RanHMhwvyTv\nRDYFLJ7jFHhvBas3mFSWdJhafwGNAfev7xtbcfKeks+4PBHs7r5DvSPWycckkOTn\nqPVGbs7MdvstBdgEP3noa8A=\n-----END PRIVATE KEY-----\n"

# Firebase Web App Configuration (substitua pelos valores reais)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="coziltech-notifications.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="coziltech-notifications"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="coziltech-notifications.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="258685936619"
NEXT_PUBLIC_FIREBASE_APP_ID="1:258685936619:web:XXXXXXXXXXXXXXXXXXXXXX"
```

### **4. Executar Script SQL**

Execute no Supabase SQL Editor:

```sql
-- Criar tabela para tokens FCM
CREATE TABLE IF NOT EXISTS fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON fcm_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_token ON fcm_tokens(token);
```

### **5. Atualizar Arquivos de Configuração**

1. **Atualizar `lib/firebase.ts`** com as chaves reais
2. **Atualizar `public/firebase-messaging-sw.js`** com as chaves reais
3. **Fazer commit e push**

### **6. Testar Notificações**

1. **Abrir o app** no navegador
2. **Permitir notificações** quando solicitado
3. **Criar uma nova OS** para testar
4. **Verificar** se a notificação aparece

## 🎯 **RESULTADO FINAL**

- ✅ **Notificações ilimitadas** (sem limite de envio)
- ✅ **Funcionam com app fechado** (background)
- ✅ **Notificações push nativas** (Android, iOS, Desktop)
- ✅ **Som personalizado** e visual atrativo
- ✅ **Integração completa** com o sistema existente

## 🚀 **PRÓXIMOS PASSOS**

1. **Configurar Firebase Console** (5 min)
2. **Executar script SQL** (2 min)
3. **Atualizar variáveis** (3 min)
4. **Fazer deploy** (5 min)
5. **Testar notificações** (5 min)

**Total: ~20 minutos para sistema completo!** 🎉
