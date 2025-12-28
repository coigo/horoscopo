#!/usr/bin/env node

/**
 * Script de inicialização para gerar horóscopo do dia
 * Execute manualmente ou como parte do build process
 */

import * as path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname no ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa dinâmicamente do projeto
const projectRoot = path.join(__dirname, '..');

async function generateDailyHoroscopes() {
    console.log('🔮 Iniciando geração de horóscopo do dia...\n');

    try {
        // Importa as funções necessárias
        const { isTodayHoroscopeGenerated, getTodayHoroscopes, saveAllHoroscopes } = await import(
            path.join(projectRoot, 'src', 'lib', 'horoscopeCache.ts')
        );
        const { ZODIAC_MAP, generatePrompt, callGeminiAPI } = await import(
            path.join(projectRoot, 'src', 'lib', 'geminiService.ts')
        );

        // Verifica se já foram gerados
        if (isTodayHoroscopeGenerated()) {
            console.log('✅ Horóscopo do dia já foi gerado!');
            const horoscopes = getTodayHoroscopes();
            console.log('Signos disponíveis:', Object.keys(horoscopes).length);
            return;
        }

        console.log('⏳ Gerando novos horóscopo...\n');

        const horoscopes: Record<string, string> = {};
        const zodiacSigns = Object.keys(ZODIAC_MAP);
        let count = 0;

        for (const sign of zodiacSigns) {
            try {
                count++;
                console.log(`[${count}/12] Gerando horóscopo para ${ZODIAC_MAP[sign]}...`);

                const prompt = generatePrompt(ZODIAC_MAP[sign]);
                const horoscope = await callGeminiAPI(prompt);

                horoscopes[sign] = horoscope;
                console.log(`✓ ${ZODIAC_MAP[sign]}: "${horoscope.substring(0, 50)}..."\n`);

                // Delay para evitar rate limit
                await new Promise((resolve) => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`✗ Erro ao gerar horóscopo para ${ZODIAC_MAP[sign]}:`, error);
                horoscopes[sign] = 'Horóscopo indisponível. Tente novamente.';
            }
        }

        // Salva todos
        saveAllHoroscopes(horoscopes);
        console.log('\n✨ Horóscopo do dia gerado com sucesso!');
        console.log(`📅 Data: ${new Date().toLocaleDateString('pt-BR')}`);
    } catch (error) {
        console.error('❌ Erro ao carregar módulos:', error);
        console.log('💡 Dica: Este script é melhor executado através da API ou durante o build Next.js');
        process.exit(1);
    }
}

generateDailyHoroscopes().catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
});
