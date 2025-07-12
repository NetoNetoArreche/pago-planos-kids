
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validando configuração do projeto...\n');

const checks = [
  {
    name: 'Arquivo de configuração Supabase',
    check: () => fs.existsSync(path.join(__dirname, '../src/integrations/supabase/client.ts')),
    fix: 'Verifique se o arquivo client.ts existe'
  },
  {
    name: 'Arquivo .env criado',
    check: () => fs.existsSync(path.join(__dirname, '../.env')),
    fix: 'Execute o script de setup: npm run setup'
  },
  {
    name: 'Dependências instaladas',
    check: () => fs.existsSync(path.join(__dirname, '../node_modules')),
    fix: 'Execute: npm install'
  },
  {
    name: 'Configuração Supabase URL',
    check: () => {
      const clientPath = path.join(__dirname, '../src/integrations/supabase/client.ts');
      if (!fs.existsSync(clientPath)) return false;
      const content = fs.readFileSync(clientPath, 'utf8');
      return !content.includes('SUA_URL_SUPABASE_AQUI') && content.includes('supabase.co');
    },
    fix: 'Configure a URL do Supabase no arquivo client.ts'
  },
  {
    name: 'Edge Functions configuradas',
    check: () => {
      return fs.existsSync(path.join(__dirname, '../supabase/functions/create-mercadopago-subscription')) &&
             fs.existsSync(path.join(__dirname, '../supabase/functions/mercadopago-webhook'));
    },
    fix: 'Edge functions já estão configuradas ✅'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${check.name}`);
  
  if (!passed) {
    console.log(`   💡 ${check.fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 Todas as verificações passaram!');
  console.log('\n📋 Checklist final:');
  console.log('□ Executar migrations SQL no Supabase');
  console.log('□ Configurar secrets no Supabase Edge Functions');
  console.log('□ Configurar webhook no Mercado Pago');
  console.log('□ Testar login/registro');
  console.log('□ Testar pagamentos com cartões de teste');
} else {
  console.log('⚠️  Algumas configurações precisam ser corrigidas.');
  console.log('📖 Consulte o arquivo SETUP.md para instruções completas.');
}

console.log('\n🚀 Para iniciar o projeto: npm run dev');
