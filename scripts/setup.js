
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Configuração do Template - Sistema de Pagamentos\n');

const questions = [
  {
    key: 'SUPABASE_URL',
    question: 'Digite a URL do seu projeto Supabase: ',
    example: 'https://abc123.supabase.co'
  },
  {
    key: 'SUPABASE_ANON_KEY',
    question: 'Digite a chave anon do Supabase: ',
    example: 'eyJ...'
  },
  {
    key: 'MERCADOPAGO_ACCESS_TOKEN',
    question: 'Digite seu Access Token do Mercado Pago: ',
    example: 'TEST-123...'
  },
  {
    key: 'MERCADOPAGO_PUBLIC_KEY',
    question: 'Digite sua Public Key do Mercado Pago: ',
    example: 'TEST-abc...'
  }
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    console.log(`\nExemplo: ${question.example}`);
    rl.question(question.question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  const config = {};
  
  for (const question of questions) {
    const answer = await askQuestion(question);
    config[question.key] = answer;
  }
  
  // Atualizar arquivo client.ts
  const clientPath = path.join(__dirname, '../src/integrations/supabase/client.ts');
  let clientContent = fs.readFileSync(clientPath, 'utf8');
  
  clientContent = clientContent.replace(
    /const SUPABASE_URL = ".*";/,
    `const SUPABASE_URL = "${config.SUPABASE_URL}";`
  );
  
  clientContent = clientContent.replace(
    /const SUPABASE_PUBLISHABLE_KEY = ".*";/,
    `const SUPABASE_PUBLISHABLE_KEY = "${config.SUPABASE_ANON_KEY}";`
  );
  
  fs.writeFileSync(clientPath, clientContent);
  
  // Criar arquivo .env
  const envContent = `# Gerado automaticamente pelo script de setup
SUPABASE_URL=${config.SUPABASE_URL}
SUPABASE_ANON_KEY=${config.SUPABASE_ANON_KEY}
MERCADOPAGO_ACCESS_TOKEN=${config.MERCADOPAGO_ACCESS_TOKEN}
MERCADOPAGO_PUBLIC_KEY=${config.MERCADOPAGO_PUBLIC_KEY}
VITE_APP_URL=http://localhost:5173
`;
  
  fs.writeFileSync(path.join(__dirname, '../.env'), envContent);
  
  console.log('\n✅ Configuração concluída!');
  console.log('\n📝 Próximos passos:');
  console.log('1. Execute as migrations SQL no Supabase (veja SETUP.md)');
  console.log('2. Configure os secrets no Supabase Edge Functions');
  console.log('3. Configure o webhook no Mercado Pago');
  console.log('4. Execute: npm run dev');
  console.log('\n📖 Documentação completa: SETUP.md');
  
  rl.close();
}

main().catch(console.error);
