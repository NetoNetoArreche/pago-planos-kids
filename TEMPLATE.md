
# 🎯 Template de Sistema de Pagamentos - Mercado Pago + Supabase

Este é um template completo para implementar um sistema de pagamentos recorrentes usando **Mercado Pago** e **Supabase**.

## ✨ O que está incluído

### 🎨 Frontend
- ✅ Interface de planos de assinatura responsiva
- ✅ Sistema de autenticação completo (login/registro)
- ✅ Página de gerenciamento de assinaturas
- ✅ Feedback visual para pagamentos
- ✅ Componentes reutilizáveis com Shadcn/UI
- ✅ Tema dark/light configurável

### 🔧 Backend
- ✅ Edge Functions do Supabase configuradas
- ✅ Webhook do Mercado Pago implementado
- ✅ Sistema de autenticação com RLS
- ✅ Banco de dados estruturado (usuários, planos, assinaturas)
- ✅ Logs detalhados para debugging

### 💰 Pagamentos
- ✅ Integração completa com Mercado Pago
- ✅ Suporte a pagamentos recorrentes
- ✅ Cartões de teste configurados
- ✅ Webhook para atualização automática de status
- ✅ Tratamento de erros robusto

### 🛡️ Segurança
- ✅ Row Level Security (RLS) configurado
- ✅ Validação de usuários
- ✅ Secrets gerenciados pelo Supabase
- ✅ CORS configurado corretamente

## 🚀 Como usar este template

### Opção 1: GitHub Template (Recomendado)
1. Clique em "Use this template" no GitHub
2. Crie seu repositório
3. Clone localmente
4. Siga o guia de configuração

### Opção 2: Clone Manual
```bash
git clone <this-repo-url>
cd <project-name>
npm install
```

## 📖 Configuração Rápida

```bash
# 1. Instalar dependências
npm install

# 2. Configuração automática
npm run setup

# 3. Validar configuração
npm run validate

# 4. Iniciar projeto
npm run dev
```

## 📋 Checklist de Setup

### Supabase
- [ ] Criar projeto no Supabase
- [ ] Executar migrations SQL
- [ ] Configurar authentication URLs
- [ ] Adicionar secrets das Edge Functions

### Mercado Pago
- [ ] Criar aplicação no Mercado Pago
- [ ] Obter credenciais de teste
- [ ] Configurar webhook URL
- [ ] Testar com cartões oficiais

### Projeto
- [ ] Executar script de setup
- [ ] Validar configurações
- [ ] Testar autenticação
- [ ] Testar pagamentos

## 🎯 Casos de Uso

Este template é perfeito para:
- 💼 **SaaS** - Software como serviço
- 📚 **Cursos Online** - Plataformas educacionais
- 🎵 **Streaming** - Conteúdo digital
- 📰 **Assinaturas** - Jornais, revistas
- 🏋️ **Fitness** - Apps de treino
- 🎨 **Criativos** - Portfolios premium

## 🛠️ Personalização

### Modificar Planos
```sql
UPDATE public.plans SET 
  name = 'Seu Plano',
  price = 99.90,
  description = 'Sua descrição'
WHERE type = 'premium';
```

### Alterar Design
- Cores: `src/index.css`
- Componentes: `src/components/`
- Páginas: `src/pages/`

### Adicionar Funcionalidades
- Dashboard: `src/pages/Dashboard.tsx`
- Profile: `src/components/`
- Notificações: Supabase Realtime

## 📊 Estrutura do Banco

```
profiles (usuários)
├── id (uuid, PK)
├── email (text)
├── full_name (text)
└── created_at (timestamp)

plans (planos)
├── id (uuid, PK)
├── name (text)
├── type (enum: free|premium|vip)
├── price (decimal)
└── features (jsonb)

subscriptions (assinaturas)
├── id (uuid, PK)
├── user_id (uuid, FK)
├── plan_id (uuid, FK)
├── status (text)
├── started_at (timestamp)
└── expires_at (timestamp)
```

## 🔗 Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Documentação Mercado Pago](https://developers.mercadopago.com)
- [Cartões de Teste](https://developers.mercadopago.com/docs/checkout-pro/additional-content/test-cards)

## 📞 Suporte

- 🐛 [Issues no GitHub](./issues)
- 📖 [Documentação Completa](./SETUP.md)
- 💬 [Discussões](./discussions)

---

**⭐ Se este template te ajudou, deixe uma estrela no GitHub!**

**🚀 Pronto para começar? Veja o [Guia de Setup Completo](./SETUP.md)**
