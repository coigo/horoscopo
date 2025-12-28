/**
 * Funções utilitárias da aplicação
 */

/**
 * Normaliza um texto para remover acentos e converter para minúsculas
 * Útil para comparações de signos
 */
export function normalizeText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Valida se uma string é um signo válido
 */
export function isValidZodiacSign(sign: string): boolean {
    const validSigns = [
        'aries',
        'touro',
        'gemeos',
        'cancer',
        'leao',
        'virgem',
        'libra',
        'escorpiao',
        'sagitario',
        'capricornio',
        'aquario',
        'peixes',
    ];
    return validSigns.includes(sign.toLowerCase());
}

/**
 * Obtem o formato de data YYYY-MM-DD
 */
export function getFormattedDate(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Valida se duas datas são o mesmo dia
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return getFormattedDate(date1) === getFormattedDate(date2);
}

/**
 * Sanitiza strings para evitar XSS
 * (Tailwind CSS já previne a maioria dos ataques, mas é bom ter)
 */
export function sanitizeString(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
