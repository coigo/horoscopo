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
 * @param sign - Nome do signo
 * @param indireta - Indireta pessoal opcional para ser incorporada ao horóscopo
 */
export function generatePrompt(sign: string, indireta?: string): string {
    const indiretaSection = indireta
        ? `\n\nIMPORTANTE: Incorpore de forma sutil e bem-humorada a seguinte "indireta pessoal" no horóscopo: "${indireta}". Não use a frase exatamente como foi escrita, mas faça uma referência criativa a ela.`
        : '';

    return `Você é um critico especializado em programação.
Gere um esculacho curto, engraçado e direto.
O esculacho deve: Fazer piadas ou indiretas sobre programação

    ${indiretaSection}
    - Usar como inspiração temas como: código legado, gambiarras, refatorações, bugs misteriosos, CI falhando, prazos irreais, mudanças de requisito, cansaço,  deploys e builds quebrados, diferenças entre ambientes, configurações erradas, dependências quebradas, falta ou excesso de logs, testes falhando, documentação inexistente, problemas de performance e concorrência, PRs gigantes, QA tardio, reuniões inúteis, decisões apressadas
    - IMPORTANTE: Acima de tudo seja criativo! Não use as mesmas 3 piadas. Eu lhe forneci uma lista de sujestões então a use.
    - Ser irreverente e bem-humorado, pode usar insultos leves e zoar a falta de conhecimento alheio
    - Seja informal, agressivo ou passivo-agressivo
    - Ter entre 2-3 linhas
    - NÃO incluir emojis
    - Não ser repetitivo
    - Maneirar no uso de jargões em língua inglesa
    - Não incluir palavras dentro de aspas simples ou formatação especial


Responda APENAS com o esculacho, sem introdução ou formatação extra.`;
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
        if (!keys.includes(key)) {
            keys.push(key)
        }
    }
}
export const resetConsumed = () => {
    consumedKeys = []
}


export async function teste(prompt: string): Promise<string> {
    const keysEnv = process.env.GEMINI_API_KEY;
    if (!keysEnv) {
        throw new Error('GEMINI_API_KEY não está configurada');
    }
    const splitKey = keysEnv.split('/')
    setKeys(splitKey)

    const currentKey = getCurrentKey()
    if (!currentKey) {
        return "Não ha mais chaves"
        throw new Error('Não há mais chaves para serem usadas! ');
    }

    try {
        const result = await callGeminiAPI(prompt, currentKey)
        console.log("_ fim aqui")
        return result
    }
    catch (err: any) {
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


async function callGeminiAPI(prompt: string, apiKey: string): Promise<string> {
    console.log('-> usando chave ', apiKey)

    const genAi = new GoogleGenAI({ apiKey });
    const response = await genAi.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    const result = response.text;
    console.log("-> deu certo")
    return result as string;
}

