/**
 * Tipagem global da aplicação
 */

/**
 * Tipo para os 12 signos do zodíaco
 */
export type ZodiacSignType =
    | 'aries'
    | 'touro'
    | 'gemeos'
    | 'cancer'
    | 'leao'
    | 'virgem'
    | 'libra'
    | 'escorpiao'
    | 'sagitario'
    | 'capricornio'
    | 'aquario'
    | 'peixes';

/**
 * Estrutura do cache de horóscopo
 */
export interface HoroscopeCache {
    date: string;
    horoscopes: Record<ZodiacSignType, string>;
}

/**
 * Resposta da API do horóscopo
 */
export interface HoroscopeResponse {
    [key: string]: string;
}

/**
 * Props do componente client de horóscopo
 */
export interface HoroscopeClientProps {
    initialData: Record<string, string>;
}

/**
 * Props da página inicial
 */
export interface HomePageProps {
    horoscopes: Record<string, string>;
    generated: boolean;
}

export type Horoscope = {
    value: string
    data: Date | string
}

export type Horoscopes = {
    [key: string]: Horoscope
}