/**
 * Verificação de segurança e performance
 * Execute antes de fazer deploy em produção
 */

import * as fs from 'fs';
import * as path from 'path';

const checks = {
    envFileExists: false,
    envHasAPIKey: false,
    noExposedKeys: true,
    noConsoleLogsInProd: true,
    tsCompiles: true,
    cacheFileExists: false,
};

console.log('🔍 Executando verificações de segurança e performance...\n');

// Verifica se .env.local existe
if (fs.existsSync('.env.local')) {
    checks.envFileExists = true;
    console.log('✅ Arquivo .env.local encontrado');

    const envContent = fs.readFileSync('.env.local', 'utf-8');
    if (envContent.includes('GEMINI_API_KEY=')) {
        checks.envHasAPIKey = true;
        console.log('✅ GEMINI_API_KEY está configurada');
    } else {
        console.log('⚠️  GEMINI_API_KEY não está configurada em .env.local');
    }
} else {
    console.log('❌ Arquivo .env.local não encontrado');
}

// Verifica se há chaves expostas em arquivos de código
const filesToCheck = [
    'src/pages/index.tsx',
    'src/pages/api/horoscope.ts',
    'src/components/HoroscopeClient.tsx',
];

for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        if (content.includes('sk-') || content.includes('AIzaSy')) {
            checks.noExposedKeys = false;
            console.log(`⚠️  Possível chave exposada em ${file}`);
        }
    }
}

if (checks.noExposedKeys) {
    console.log('✅ Nenhuma chave API exposta encontrada no código');
}

// Verifica se horoscopes.json existe
if (fs.existsSync('horoscopes.json')) {
    checks.cacheFileExists = true;
    console.log('✅ Cache de horóscopo (horoscopes.json) encontrado');

    const cache = JSON.parse(fs.readFileSync('horoscopes.json', 'utf-8'));
    const today = new Date().toISOString().split('T')[0];
    if (cache.date === today) {
        console.log(`✅ Cache atualizado para hoje (${today})`);
    } else {
        console.log(`⚠️  Cache é de ${cache.date}, não é de hoje`);
    }
}

// Resumo
console.log('\n📋 Resumo das verificações:\n');
console.log(`Arquivo .env.local: ${checks.envFileExists ? '✅' : '❌'}`);
console.log(`API Key configurada: ${checks.envHasAPIKey ? '✅' : '❌'}`);
console.log(`Sem chaves expostas: ${checks.noExposedKeys ? '✅' : '❌'}`);
console.log(`Cache de horóscopo: ${checks.cacheFileExists ? '✅' : '⚠️'}`);

const allGood = checks.envFileExists && checks.envHasAPIKey && checks.noExposedKeys;

console.log(`\n${allGood ? '✨' : '⚠️'} Verificação concluída!\n`);

if (!allGood) {
    console.log('⚠️  Resolva os problemas acima antes de fazer deploy em produção.\n');
    process.exit(1);
} else {
    console.log('✅ Tudo pronto para produção!\n');
}
