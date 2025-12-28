import * as fs from 'fs';
import * as path from 'path';

const HOROSCOPE_FILE = path.join(process.cwd(), 'horoscopes.json');

interface HoroscopeData {
    date: string;
    horoscopes: Record<string, string>;
}

/**
 * Obtém a data atual no formato YYYY-MM-DD
 */
function getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
}

/**
 * Lê o arquivo de cache de horóscopo
 */
function readHoroscopeFile(): HoroscopeData {
    try {
        const data = fs.readFileSync(HOROSCOPE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return { date: '1970-01-01', horoscopes: {} };
    }
}

/**
 * Escreve dados no arquivo de cache
 */
function writeHoroscopeFile(data: HoroscopeData): void {
    fs.writeFileSync(HOROSCOPE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Verifica se o horóscopo de hoje já foi gerado
 */
export function isTodayHoroscopeGenerated(): boolean {
    const data = readHoroscopeFile();
    return data.date === getCurrentDate() && Object.keys(data.horoscopes).length === 12;
}

/**
 * Obtém todos os horóscopo do dia
 */
export function getTodayHoroscopes(): Record<string, string> {
    const data = readHoroscopeFile();
    if (data.date === getCurrentDate()) {
        return data.horoscopes;
    }
    return {};
}

/**
 * Salva um horóscopo para o dia
 */
export function saveHoroscope(sign: string, content: string): void {
    const data = readHoroscopeFile();
    const today = getCurrentDate();

    // Se mudou o dia, reseta
    if (data.date !== today) {
        data.date = today;
        data.horoscopes = {};
    }

    data.horoscopes[sign] = content;
    writeHoroscopeFile(data);
}

/**
 * Salva todos os horóscopo do dia de uma vez
 */
export function saveAllHoroscopes(horoscopes: Record<string, string>): void {
    const data: HoroscopeData = {
        date: getCurrentDate(),
        horoscopes,
    };
    writeHoroscopeFile(data);
}
