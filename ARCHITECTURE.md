# 🏗 Arquitetura do Sistema de Autenticação

Este documento detalha a arquitetura e fluxo de dados do sistema de autenticação implementado.

## 📊 Diagrama de Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │    │   (API Routes)  │    │   (SQLite)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐              ┌───▼───┐               ┌───▼───┐
    │ React   │              │ Auth  │               │Users  │
    │ Pages   │              │ Logic │               │ Table │
    └─────────┘              └───────┘               └───────┘
         │                       │                       │
    ┌────▼────┐              ┌───▼───┐               ┌───▼───┐
    │ Client  │              │Cookie │               │Sessions│
    │ State   │              │Store  │               │ Table │
    └─────────┘              └───────┘               └───────┘
```

## 🔄 Fluxo de Autenticação

### **1. Registro de Usuário**

```
Usuário → Formulário → API /register → Hash Password → Salvar no DB → Redirect Login
```

### **2. Login de Usuário**

```
Usuário → Formulário → API /login → Verificar Credenciais → Criar Sessão → Cookie → Redirect Dashboard
```

### **3. Verificação de Sessão**

```
Página → getSessionUser() → Ler Cookie → Validar no DB → Retornar User ou Null
```

### **4. Logout**

```
Usuário → Botão Logout → API /logout → Remover do DB → Limpar Cookie → Redirect Login
```

## 🗄 Estrutura do Banco de Dados

### **Tabela: users**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### **Tabela: sessions**
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔐 Segurança por Camadas

### **Camada 1: Frontend**
- Validação de formulários
- Estados de loading
- Redirecionamentos automáticos
- Proteção de rotas

### **Camada 2: API Routes**
- Validação de entrada
- Verificação de credenciais
- Geração de tokens seguros
- Controle de sessões

### **Camada 3: Banco de Dados**
- Hash de senhas (bcrypt)
- Tokens assinados (HMAC)
- Expiração automática
- Integridade referencial

### **Camada 4: Cookies**
- HTTP-only (proteção XSS)
- SameSite (proteção CSRF)
- Secure (HTTPS)
- Expiração controlada

## 🔄 Fluxo de Dados Detalhado

### **Login Bem-sucedido**

```
1. POST /api/login
   ├── Validar email/senha
   ├── Verificar hash no DB
   ├── Gerar token HMAC
   ├── Salvar sessão no DB
   ├── Definir cookie HTTP-only
   └── Retornar sucesso

2. Redirecionamento
   ├── router.replace('/')
   ├── Página carrega
   ├── getSessionUser() executa
   ├── Cookie é lido
   ├── Sessão é validada
   └── Usuário é retornado
```

### **Verificação de Acesso**

```
1. Página protegida
   ├── getSessionUser() é chamado
   ├── Cookie 'session' é lido
   ├── Token é validado no DB
   ├── Expiração é verificada
   └── Dados do usuário são retornados

2. Decisão de acesso
   ├── Se user = null → Redirect login
   ├── Se user = object → Mostrar conteúdo
   └── Se expirado → Limpar e redirect
```

## 🛡 Medidas de Segurança

### **1. Autenticação**
- ✅ Hash de senhas com bcrypt
- ✅ Salt automático
- ✅ Verificação segura de credenciais

### **2. Sessões**
- ✅ Tokens HMAC assinados
- ✅ Expiração automática
- ✅ Validação server-side
- ✅ Limpeza automática

### **3. Cookies**
- ✅ HTTP-only (inacessível via JS)
- ✅ SameSite=Lax (proteção CSRF)
- ✅ Secure em produção
- ✅ Path controlado

### **4. Banco de Dados**
- ✅ Integridade referencial
- ✅ Índices otimizados
- ✅ Limpeza automática
- ✅ Transações seguras

## 📱 Responsividade e UX

### **Estados da Interface**

```
┌─────────────────┐
│   Loading       │ → Spinner + "Verificando..."
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Não Logado    │ → Botões Login/Register
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Logado        │ → Dashboard + Logout
└─────────────────┘
```

### **Feedback Visual**

- **Loading**: Spinners e estados de carregamento
- **Erro**: Mensagens claras e acionáveis
- **Sucesso**: Confirmações visuais
- **Transições**: Animações suaves

## 🔧 Configurações de Produção

### **Variáveis de Ambiente**
```env
SECRET_KEY=chave-super-secreta-de-producao
NODE_ENV=production
DATABASE_URL=postgresql://...
```

### **Configurações de Segurança**
```typescript
// Cookies em produção
cookies().set({
  name: 'session',
  value: token,
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
  domain: '.seudominio.com',
  expires: new Date(expires)
});
```

### **Monitoramento**
- Logs de segurança
- Rate limiting
- Detecção de ataques
- Métricas de performance

## 🚀 Escalabilidade

### **Estratégias de Escala**

1. **Banco de Dados**
   - SQLite → PostgreSQL
   - Connection pooling
   - Read replicas

2. **Sessões**
   - Redis para cache
   - Distributed sessions
   - Session clustering

3. **Aplicação**
   - Load balancers
   - CDN para assets
   - Caching strategies

### **Monitoramento**
- Uptime monitoring
- Performance metrics
- Security alerts
- User analytics

---

Esta arquitetura garante um sistema robusto, seguro e escalável para autenticação baseada em sessões! 🛡️
