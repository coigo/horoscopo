import type { NextApiRequest, NextApiResponse } from 'next';
import { resetConsumed, ZODIAC_MAP } from '@/lib/geminiService';
import { teste, generatePrompt } from '@/lib/geminiService';
import { getTodayHoroscopes, isTodayHoroscopeGenerated, saveHoroscope } from '@/lib/horoscopeCache';

/**
 * Endpoint para gerar horóscopo para um signo específico
 * POST /api/horoscope
 * Body opcional: { indiretas: { signo: "indireta personalizada" } }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apenas POST é permitido
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { sign } = req.query;
        // Obtém as indiretas do body (se fornecidas)
        const { indiretas } = req.body || {};

        // Se já foram gerados todos os horóscopo hoje E não tem indiretas personalizadas, retorna do cache
        if (isTodayHoroscopeGenerated() && !indiretas) {
            const horoscopes = getTodayHoroscopes();
            return res.status(200).json(horoscopes);
        }

        // Gera horóscopo para todos os signos
        const horoscopes: Record<string, string> = {};
        const zodiacSigns = Object.keys(ZODIAC_MAP);

        // Gera sequencialmente para evitar rate limit
        for (const zodiacSign of zodiacSigns) {
            console.log("tentando", zodiacSign)

            // Obtém a indireta para este signo (se existir)
            const indireta = indiretas?.[zodiacSign] || undefined;

            const prompt = generatePrompt(ZODIAC_MAP[zodiacSign], indireta);
            // const horoscope = await teste(prompt);
            // horoscopes[zodiacSign] = horoscope || `Não há previsões para ${zodiacSign}`;
            // Pequeno delay entre requisições
            // if (!indireta) {
            //     saveHoroscope(zodiacSign, horoscope);
            // }
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Salva todos no cache (apenas se não houver indiretas personalizadas)
        resetConsumed()

        return res.status(200).json(horoscopes);
    } catch (error) {
        console.error('Erro ao gerar horóscopo:', error);
        return res.status(500).json({
            error: 'Erro ao gerar horóscopo. Verifique se a API key está configurada.',
        });
    }
}
