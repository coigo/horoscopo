import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { HoroscopeClient } from '@/components/HoroscopeClient';
import { ZODIAC_MAP } from '@/lib/geminiService';
import { getTodayHoroscopes, isTodayHoroscopeGenerated } from '@/lib/horoscopeCache';

interface HomeProps {
  horoscopes: Record<string, string>;
  generated: boolean;
}

export default function Home({ horoscopes, generated }: HomeProps) {
  return (
    <>
      <Head>
        <title>Horoscopo.dev</title>
        <meta name="description" content="Horóscopo divertido e irreverente para programadores" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r text-gray-300 to-pink-600 bg-clip-text">
              Horoscopo.dev
            </h1>
            <p className="text-xl text-purple-300">
              Mensagens cósmicas especialmente para devs profissionais
            </p>
            {generated && (
              <p className="text-sm text-green-400 mt-2">✓ Conteúdo pré-carregado para o dia de hoje</p>
            )}
            <Link
              href="/weee"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-200 border border-purple-500/30"
            >
              <span>🎯</span>
              Configurar Indiretas (esconde esse botão depois)
            </Link>
          </header>

          <HoroscopeClient initialData={horoscopes} />
        </div>
      </main>
    </>
  );
}

/**
 * Pré-carrega os horóscopo do servidor
 * Se não estiverem gerados, faz uma chamada à API
 */
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  let horoscopes: Record<string, string> = {};
  let generated = false;

  // Verifica se já foram gerados
  if (isTodayHoroscopeGenerated()) {
    horoscopes = getTodayHoroscopes();
    generated = true;
  } else {
    // Tenta gerar chamando a API interna
    try {
      const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

      const response = await fetch(`${baseUrl}/api/horoscope`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // console.log(response)
      if (response.ok) {
        horoscopes = await response.json();
        generated = true;
      }
    } catch (error) {
      console.error('Erro ao gerar horóscopo durante build:', error);
      // Mesmo com erro, fornece um horóscopo padrão para não quebrar a página
      for (const sign of Object.keys(ZODIAC_MAP)) {
        horoscopes[sign] = 'Horóscopo indisponível. Tente novamente mais tarde.';
      }
    }
  }

  return {
    props: {
      horoscopes,
      generated,
    },
    // Revalida a cada 1 hora (3600 segundos)
    revalidate: 3600,
  };
};
