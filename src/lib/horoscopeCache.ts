import { Horoscope, Horoscopes } from '@/types';
import * as fs from 'fs';
import * as path from 'path';
import { client } from './redis';

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
function readHoroscopeFile(): Horoscopes {
    try {
        const data = fs.readFileSync(HOROSCOPE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err){
        console.log('tentando ler o arquivo', err)
        return { };
    }
}

/**
 * Escreve dados no arquivo de cache
 */
function writeHoroscopeFile(data: Horoscopes): void {
    fs.writeFileSync(HOROSCOPE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Verifica se o horóscopo de hoje já foi gerado
 */
export function isTodayHoroscopeGenerated(): boolean {
    // const data = readHoroscopeFile();
    // return data.date === getCurrentDate() && Object.keys(data.horoscopes).length === 12;
    return false
}

/**
 * Obtém todos os horóscopo do dia
 */
export async function getTodayHoroscopes(): Promise<Horoscopes> {
    const horoscope = await client.get("horoscope")
    console.log("weee", horoscope)
    if ( !horoscope ) {
        return {}
    }

    return JSON.parse(horoscope)
}

/**
 * Salva um horóscopo para o dia
 */
export async function saveHoroscope(sign: string, content: string): Promise<void> {
    const data = readHoroscopeFile();
    const today = getCurrentDate();

    const horoscope: Horoscope = {
        data: today,
        value: content
    }
    const currentHoroscope = await getTodayHoroscopes()

    currentHoroscope[sign] = horoscope;

    await client.set("horoscope", JSON.stringify(currentHoroscope))

    data[sign] = horoscope;
    writeHoroscopeFile(data);
}
