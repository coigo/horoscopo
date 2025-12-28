import Link from 'next/link';

export default function Custom404() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center px-4">
            <div className="text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        404
                    </h1>
                </div>

                <h2 className="text-4xl font-bold mb-4">Página não encontrada</h2>

                <p className="text-xl text-purple-300 mb-8 max-w-md">
                    As estrelas e planetas não conseguem encontrar esta página. Talvez você digitou errado ou as coordenadas cósmicas estão desalinhadas.
                </p>

                <div className="space-y-4">
                    <p className="text-lg text-purple-200">
                        🔮 Volte para ler seu horóscopo do dia!
                    </p>

                    <Link
                        href="/"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
                    >
                        Voltar para Horóscopo
                    </Link>
                </div>

                <div className="mt-12 text-slate-400 text-sm">
                    <p>Mensagem do universo: O destino nem sempre segue um caminho linear ✨</p>
                </div>
            </div>
        </div>
    );
}
