'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ZODIAC_SIGNS, ZODIAC_MAP } from '@/lib/geminiService';
import { ZODIAC_ICONS } from '@/lib/zodiacIcons';

const STORAGE_KEY = 'horoscope_indiretas';

export default function WeeeConfigPage() {
    const [indiretas, setIndiretas] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [regeneratedMessage, setRegeneratedMessage] = useState<Record<string, string>>({});

    // Carrega do localStorage ao montar
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setIndiretas(JSON.parse(stored));
            } catch {
                // Se der erro, ignora
            }
        }
    }, []);

    // Salva automaticamente quando muda
    const handleChange = (sign: string, value: string) => {
        const newIndiretas = { ...indiretas, [sign]: value };
        setIndiretas(newIndiretas);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIndiretas));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleClearAll = () => {
        setIndiretas({});
        localStorage.removeItem(STORAGE_KEY);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSave = async (sign: string, content: string) => {
        setSaving(prev => ({ ...prev, [sign]: true }));
        try {
            const response = await fetch(`/api/horoscope/${sign}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ horoscope: content }),
            });

            if (response.ok) {
                // Feedback visual temporário ou apenas sucesso
                const currentMsg = regeneratedMessage[sign];
                setRegeneratedMessage(prev => ({
                    ...prev,
                    [sign]: currentMsg + ' (✅ Salvo com sucesso!)'
                }));
                // Remove a mensagem de sucesso após alguns segundos para limpar a tela ou manter como está
                setTimeout(() => {
                    setRegeneratedMessage(prev => ({
                        ...prev,
                        [sign]: currentMsg
                    }));
                }, 3000);
            } else {
                alert('Erro ao salvar horóscopo');
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao salvar');
        } finally {
            setSaving(prev => ({ ...prev, [sign]: false }));
        }
    };

    const handleRegenerate = async (sign: string) => {
        setRegenerating(prev => ({ ...prev, [sign]: true }));
        setRegeneratedMessage(prev => ({ ...prev, [sign]: '' }));

        try {
            // Chama o endpoint específico para gerar apenas este signo
            const response = await fetch(`/api/horoscope/${sign}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    indireta: indiretas[sign] || undefined
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setRegeneratedMessage(prev => ({
                    ...prev,
                    [sign]: result.horoscope || 'Horóscopo gerado com sucesso!'
                }));
            } else {
                const error = await response.json();
                setRegeneratedMessage(prev => ({
                    ...prev,
                    [sign]: error.error || 'Erro ao gerar horóscopo. Tente novamente.'
                }));
            }
        } catch (error) {
            setRegeneratedMessage(prev => ({
                ...prev,
                [sign]: 'Erro de conexão. Tente novamente.'
            }));
        } finally {
            setRegenerating(prev => ({ ...prev, [sign]: false }));
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="animate-pulse text-purple-300 text-xl">Carregando...</div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Configurar Indiretas | Horoscopo.dev</title>
                <meta name="description" content="Configure indiretas personalizadas para cada signo" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <header className="text-center mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar ao Horóscopo
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            🎯 Configurar Indiretas
                        </h1>
                        <p className="text-lg text-purple-300 max-w-2xl mx-auto">
                            Adicione uma "indireta" pessoal para cada signo. O gerador de horóscopo vai usar isso como inspiração para criar mensagens mais personalizadas!
                        </p>
                    </header>

                    {/* Toast de salvamento */}
                    {saved && (
                        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-pulse z-50">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Salvo automaticamente!
                        </div>
                    )}

                    {/* Botão limpar tudo */}
                    <div className="flex justify-end mb-6 max-w-4xl mx-auto">
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/30"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Limpar Tudo
                        </button>
                    </div>

                    {/* Grid de signos */}
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ZODIAC_SIGNS.map((sign) => {
                            const normalizedSign = sign.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                            const icon = ZODIAC_ICONS[normalizedSign];
                            const value = indiretas[normalizedSign] || '';
                            const isRegenerating = regenerating[normalizedSign];
                            const isSaving = saving[normalizedSign];
                            const regeneratedMsg = regeneratedMessage[normalizedSign];

                            return (
                                <div
                                    key={normalizedSign}
                                    className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-xl hover:border-purple-500/40 transition-all duration-300"
                                >
                                    {/* Cabeçalho do signo */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl">{icon}</span>
                                            <div>
                                                <h2 className="text-xl font-bold text-white">{sign}</h2>
                                                <p className="text-sm text-purple-400">
                                                    {value ? '✨ Indireta configurada' : '💭 Sem indireta'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Botão Gerar Novamente */}
                                        <button
                                            onClick={() => handleRegenerate(normalizedSign)}
                                            disabled={isRegenerating}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isRegenerating
                                                ? 'bg-purple-600/30 text-purple-400 cursor-not-allowed'
                                                : 'bg-purple-600/50 hover:bg-purple-600/70 text-purple-200 hover:text-white'
                                                }`}
                                            title="Gerar horóscopo com esta indireta"
                                        >
                                            {isRegenerating ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Gerando...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Gerar
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Campo de texto */}
                                    <div className="relative">
                                        <textarea
                                            value={value}
                                            onChange={(e) => handleChange(normalizedSign, e.target.value)}
                                            placeholder={`Ex: "Essa pessoa precisa parar de usar var e aprender let/const..."`}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600 rounded-lg text-purple-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                                        />
                                        {value && (
                                            <button
                                                onClick={() => handleChange(normalizedSign, '')}
                                                className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 transition-colors"
                                                title="Limpar"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Contador de caracteres */}
                                    <div className="mt-2 text-right">
                                        <span className={`text-xs ${value.length > 200 ? 'text-yellow-400' : 'text-slate-500'}`}>
                                            {value.length}/200 caracteres
                                        </span>
                                    </div>

                                    {/* Preview do horóscopo gerado */}
                                    {regeneratedMsg && (
                                        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-purple-500/30">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-xs text-purple-400 font-medium">✨ Horóscopo gerado:</p>
                                                {!regeneratedMsg.includes('✅') && !regeneratedMsg.includes('Erro') && (
                                                    <button
                                                        onClick={() => handleSave(normalizedSign, regeneratedMsg)}
                                                        disabled={isSaving}
                                                        className="text-xs bg-green-600/20 hover:bg-green-600/40 text-green-400 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                                    >
                                                        {isSaving ? 'Salvando...' : '💾 Salvar e Substituir'}
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-sm text-purple-200 leading-relaxed whitespace-pre-wrap">{regeneratedMsg}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Dicas */}
                    <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-6 border border-purple-500/30">
                        <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                            <span>💡</span> Dicas para boas indiretas
                        </h3>
                        <ul className="text-purple-200 space-y-2 text-sm">
                            <li>• Mencione situações específicas de trabalho ou código</li>
                            <li>• Faça referências a tecnologias ou práticas de programação</li>
                            <li>• Use humor e ironia (mas sem ofensas graves)</li>
                            <li>• Quanto mais específica, mais personalizado será o horóscopo!</li>
                            <li>• Clique em "Gerar" para ver como fica o horóscopo com sua indireta</li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <footer className="text-center mt-12 text-slate-500 text-sm">
                        <p>Os dados são salvos localmente no seu navegador (localStorage)</p>
                        <p className="mt-1">Nenhum dado é enviado para servidores externos</p>
                    </footer>
                </div>
            </main>
        </>
    );
}

