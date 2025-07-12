
# 🚀 Template - Sistema de Pagamentos com Mercado Pago e Supabase

Um template completo e pronto para uso que implementa um sistema de pagamentos recorrentes usando **Mercado Pago** e **Supabase**.

## ✨ Principais Recursos

- 💳 **Pagamentos Recorrentes** - Sistema completo de assinaturas
- 🔐 **Autenticação Segura** - Login/registro com Supabase Auth
- 🎨 **Interface Moderna** - Design responsivo com Tailwind CSS
- 🔄 **Webhook Automático** - Sincronização de pagamentos em tempo real
- 🛡️ **Segurança RLS** - Row Level Security configurado
- 📱 **Mobile First** - Totalmente responsivo

## 🎯 Para quem é este template?

- Desenvolvedores que querem implementar pagamentos rapidamente
- Startups que precisam de um sistema de assinaturas
- Freelancers criando soluções para clientes
- Estudantes aprendendo integração de pagamentos

## 🚀 Configuração Rápida (5 minutos)

### 1. Use este template
```bash
# Clique em "Use this template" no GitHub ou:
git clone <your-repo-url>
cd mercadopago-supabase-template
npm install
```

### 2. Configuração automática
```bash
npm run setup
```

### 3. Inicie o projeto
```bash
npm run dev
```

**📖 [Guia Completo de Configuração →](./SETUP.md)**

## 🏗️ Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **Pagamentos**: Mercado Pago API
- **Deploy**: Vercel/Netlify Ready

## 📊 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Shadcn)
│   └── PaymentStatus.tsx
├── pages/              # Páginas principais
│   ├── Plans.tsx       # Página de planos
│   ├── Dashboard.tsx   # Dashboard do usuário
│   └── Auth.tsx        # Autenticação
├── hooks/              # Hooks customizados
│   └── useAuth.tsx     # Contexto de autenticação
└── integrations/       # Integrações externas
    └── supabase/       # Cliente Supabase

supabase/
├── functions/          # Edge Functions
│   ├── create-mercadopago-subscription/
│   └── mercadopago-webhook/
└── migrations/         # Migrations SQL
```

## 💳 Planos Incluídos

| Plano | Preço | Recursos |
|-------|-------|----------|
| 🆓 Gratuito | R$ 0,00 | Recursos básicos |
| ⭐ Premium | R$ 29,90 | Recursos avançados |
| 👑 VIP | R$ 59,90 | Todos os recursos |

*Preços totalmente personalizáveis*

## 🧪 Testando Pagamentos

Use os cartões de teste oficiais do Mercado Pago:

- **Visa**: `4509 9535 6623 3704` (Nome: APRO)
- **Mastercard**: `5031 7557 3453 0604` (Nome: APRO)
- **Amex**: `3711 803032 57522` (Nome: APRO)

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia desenvolvimento
npm run setup        # Configuração automática
npm run validate     # Valida configurações
npm run build        # Build para produção
npm run preview      # Preview do build
```

## 🎨 Personalização

### Modificar Planos
```sql
UPDATE public.plans SET 
  name = 'Seu Plano',
  price = 99.90,
  description = 'Sua descrição personalizada'
WHERE type = 'premium';
```

### Alterar Cores/Design
- **Cores**: Edite `src/index.css`
- **Componentes**: Modifique arquivos em `src/components/`
- **Layout**: Ajuste páginas em `src/pages/`

## 📱 Screenshots

| Página de Planos | Dashboard | Checkout |
|---|---|---|
| ![Plans](https://via.placeholder.com/200x120?text=Plans) | ![Dashboard](https://via.placeholder.com/200x120?text=Dashboard) | ![Checkout](https://via.placeholder.com/200x120?text=Checkout) |

## 🌟 Casos de Uso

- **SaaS** - Software como serviço
- **Cursos Online** - Plataformas educacionais  
- **Streaming** - Conteúdo digital
- **Fitness Apps** - Aplicativos de treino
- **Newsletters** - Conteúdo premium
- **E-commerce** - Assinaturas de produtos

## 📋 Requisitos

- Node.js 18+
- Conta Supabase (gratuita)
- Conta Mercado Pago (gratuita)
- Git

## 🆘 Precisa de Ajuda?

- 📖 [Documentação Completa](./SETUP.md)
- 🐛 [Reportar Bug](./issues)
- 💬 [Discussões](./discussions)
- 📧 Email: suporte@exemplo.com

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja nosso [guia de contribuição](./CONTRIBUTING.md).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

## 🚀 Pronto para começar?

1. **[Use este template](../../generate)** no GitHub
2. **[Siga o guia de setup](./SETUP.md)** 
3. **Customize** para suas necessidades
4. **Deploy** e comece a receber pagamentos!

**⭐ Se este template te ajudou, deixe uma estrela!**

---

*Desenvolvido com ❤️ para a comunidade de desenvolvedores brasileiros*
