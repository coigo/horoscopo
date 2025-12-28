'use client';

import { useState, useMemo } from 'react';
import { ZODIAC_SIGNS, ZODIAC_MAP } from '@/lib/geminiService';

interface HoroscopeClientProps {
    initialData: Record<string, string>;
}

/**
 * Componente cliente que exibe os horóscopo
 * Todos os dados já estão pré-carregados, não faz requisições
 */
export function HoroscopeClient({ initialData }: HoroscopeClientProps) {
    const [selectedSign, setSelectedSign] = useState<string>('aries');
    console.log('selectedSign', selectedSign)

    // Memoiza os dados para evitar re-renders desnecessários
    const horoscopes = useMemo(() => initialData, [initialData]);

    // Obtém o horóscopo selecionado
    const currentHoroscope = useMemo(() => {
        return horoscopes[selectedSign] || 'Horóscopo não disponível';
    }, [horoscopes, selectedSign]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Grid de botões dos signos */}
                <div className="lg:col-span-1">
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                        {ZODIAC_SIGNS.map((sign) => {
                            const normalizedSign = sign.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                            const isSelected = selectedSign === normalizedSign;

                            return (
                                <button
                                    key={normalizedSign}
                                    onClick={() => setSelectedSign(normalizedSign)}
                                    className={`
                    px-4 py-3 rounded-lg font-semibold transition-all duration-200
                    ${isSelected
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                                            : 'bg-slate-700 text-purple-200 hover:bg-slate-600 hover:text-white'
                                        }
                  `}
                                    aria-pressed={isSelected}
                                >
                                    {sign}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Área de exibição do horóscopo */}
                <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-8 shadow-2xl border border-purple-500 border-opacity-30">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                                {ZODIAC_MAP[selectedSign] || selectedSign}
                            </h2>
                            <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
                        </div>

                        <div className="min-h-32">
                            <p className="text-lg leading-relaxed text-purple-100 whitespace-pre-wrap">
                                {currentHoroscope}
                            </p>
                        </div>

                        {/* Rodapé informativo */}
                        <div className="mt-8 pt-6 border-t border-slate-600">
                            <p className="text-sm text-slate-400">
                                ✨ Horóscopo pré-carregado • Atualizado diariamente à meia-noite
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
