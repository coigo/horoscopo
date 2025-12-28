import { GoogleGenAI } from "@google/genai";


// Constantes dos signos
export const ZODIAC_SIGNS = [
    'Áries',
    'Touro',
    'Gêmeos',
    'Câncer',
    'Leão',
    'Virgem',
    'Libra',
    'Escorpião',
    'Sagitário',
    'Capricórnio',
    'Aquário',
    'Peixes',
] as const;

export const ZODIAC_SIGNS_LOWERCASE = ZODIAC_SIGNS.map((sign) =>
    sign.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
);

type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export const ZODIAC_MAP: Record<string, ZodiacSign> = {
    'aries': 'Áries',
    'touro': 'Touro',
    'gemeos': 'Gêmeos',
    'cancer': 'Câncer',
    'leao': 'Leão',
    'virgem': 'Virgem',
    'libra': 'Libra',
    'escorpiao': 'Escorpião',
    'sagitario': 'Sagitário',
    'capricornio': 'Capricórnio',
    'aquario': 'Aquário',
    'peixes': 'Peixes',
};

/**
 * Gera um prompt para o Gemini gerar um horóscopo divertido para programadores
 */
export function generatePrompt(sign: string): string {
    return `Você é um astrólogo cômico especializado em horóscopo para programadores profissionais.
Gere um horóscopo curto, engraçado e direto para o signo ${sign} HOJE.

O horóscopo deve:

Fazer piadas ou indiretas sobre programação, bugs, código, deadlines e rotina dev

    - Usar como inspiração temas como:  código legado, gambiarras, refatorações, bugs misteriosos, CI falhando, prazos irreais, mudanças de requisito, cansaço,  deploys e builds quebrados, diferenças entre ambientes, configurações erradas, dependências quebradas, falta ou excesso de logs, testes falhando, documentação inexistente, problemas de performance e concorrência, PRs gigantes, QA tardio, reuniões inúteis,  café e decisões apressadas
    - Ser irreverente e bem-humorado
    - Ter entre 3-4 linhas
    - Parecer um horóscopo real, mas com referências técnicas
    - NÃO incluir emojis
    - Ser relevante para programadores
    - Não ser repetitivo
    -Maneirar no uso de jargões em língua inglesa
    -Não incluir palavras dentro de aspas simples ou formatação especial

Responda APENAS com o horóscopo, sem introdução ou formatação extra.`;
}

/**
 * Chama a API do Gemini para gerar um horóscopo
 */

    let keys: string[] = []
    let consumedKeys: string[] = []

    const useKey = () => {
        const current = getCurrentKey()
        consumedKeys.push(current)
    }

    const getCurrentKey = () => {
        const current = keys.filter(k => !consumedKeys.includes(k))[0]
        return current
    }

    const setKeys = (we: string[]) => {
        if (keys.length) return

        for (const key of we) {
            if ( !keys.includes(key)) {
                keys.push(key)
            }
        }
    }
    export const resetConsumed = () => {
        consumedKeys = []
    }


export async function teste (prompt: string): Promise<string> {
    const keysEnv = process.env.GEMINI_API_KEY;
    if (!keysEnv) {
        throw new Error('GEMINI_API_KEY não está configurada');
    }
    const splitKey = keysEnv.split('/')
    setKeys(splitKey)
    
    const currentKey = getCurrentKey()
    if ( !currentKey ) {
        return "Não ha mais chaves"
        throw new Error('Não há mais chaves para serem usadas! ');
    }

    try {
        const result = await callGeminiAPI(prompt, currentKey) 
        console.log("_ fim aqui")
        return result
    }
    catch (err: any ) {
        console.log("___ code", JSON.parse(err.message).error)
        console.log("___ code")
        const error = JSON.parse(err.message).error
        // console.log("___ code", err.error.code)
        if (error.code == 429) {  
            useKey()
            const result = await teste(prompt)
            return result
        }
        return "errinho aqui"
        // throw err
    }
}


// async function teste2 (prompt: string, apiKey: string) {
//     console.log("chave que chegou",  apiKey)
//     console.log("chaves invalidas",  consumedKeys.length)
    
//     const chance = Math.random()
//     if ( chance >= 0.8 || consumedKeys.includes(apiKey) ) {
//         throw {code: 429}
//     }
//     return "Testando 123"
// }

async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
    console.log('-> usando chave ', apiKey)

    const genAi = new GoogleGenAI({apiKey});
    const response = await genAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    const result = response.text;
    console.log("-> deu certo")
    return result as string;
}

