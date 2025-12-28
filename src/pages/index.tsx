import type { GetStaticProps } from 'next';
import Head from 'next/head';
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
        <title>Horóscopo para Programadores</title>
        <meta name="description" content="Horóscopo divertido e irreverente para programadores" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Horóscopo para Programadores
            </h1>
            <p className="text-xl text-purple-300">
              Mensagens cósmicas especialmente para devs profissionais
            </p>
            {generated && (
              <p className="text-sm text-green-400 mt-2">✓ Conteúdo pré-carregado para o dia de hoje</p>
            )}
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
