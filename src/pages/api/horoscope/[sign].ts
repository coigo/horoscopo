import type { NextApiRequest, NextApiResponse } from 'next';
import { ZODIAC_MAP, generatePrompt, teste, resetConsumed } from '@/lib/geminiService';
import { saveHoroscope } from '@/lib/horoscopeCache';

/**
 * Endpoint para gerar ou salvar horóscopo para um signo específico
 * POST /api/horoscope/[sign] -> Gera horóscopo
 * PUT /api/horoscope/[sign] -> Salva horóscopo
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { sign } = req.query;
    const normalizedSign = typeof sign === 'string' ? sign.toLowerCase() : '';

    // Valida o signo
    if (!normalizedSign || !ZODIAC_MAP[normalizedSign]) {
        return res.status(400).json({
            error: 'Signo inválido',
            validSigns: Object.keys(ZODIAC_MAP)
        });
    }

    // Salvar horóscopo (PUT)
    if (req.method === 'PUT') {
        try {
            const { horoscope } = req.body;

            if (!horoscope) {
                return res.status(400).json({ error: 'Conteúdo do horóscopo é obrigatório' });
            }

            saveHoroscope(normalizedSign, horoscope);

            return res.status(200).json({
                success: true,
                message: `Horóscopo de ${ZODIAC_MAP[normalizedSign]} salvo com sucesso`
            });
        } catch (error) {
            console.error('Erro ao salvar horóscopo:', error);
            return res.status(500).json({ error: 'Erro ao salvar horóscopo' });
        }
    }

    // Gerar horóscopo (POST)
    if (req.method === 'POST') {
        try {
            // Obtém a indireta do body (se fornecida)
            const { indireta } = req.body || {};

            console.log(`Gerando horóscopo para ${normalizedSign}${indireta ? ' com indireta' : ''}`);

            // Gera o prompt e chama a API
            const prompt = generatePrompt(ZODIAC_MAP[normalizedSign], indireta);
            const horoscope = await teste(prompt);

            // Reset das chaves consumidas
            resetConsumed();

            return res.status(200).json({
                sign: normalizedSign,
                signDisplay: ZODIAC_MAP[normalizedSign],
                horoscope: horoscope || `Não há previsões para ${ZODIAC_MAP[normalizedSign]}`,
                hadIndireta: !!indireta
            });
        } catch (error) {
            console.error('Erro ao gerar horóscopo:', error);
            return res.status(500).json({
                error: 'Erro ao gerar horóscopo. Verifique se a API key está configurada.',
            });
        }
    }

    return res.status(405).json({ error: 'Método não permitido' });
}
