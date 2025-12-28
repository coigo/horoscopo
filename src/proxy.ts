import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Middleware de segurança para bloquear acessos não autorizados
 */
export function proxy(request: NextRequest) {
    // Bloqueia acesso direto a arquivos sensíveis
    const pathname = request.nextUrl.pathname;

    // Protege arquivos privados
    if (pathname.includes('.env') || pathname.includes('horoscopes.json')) {
        return NextResponse.json({ error: 'Acesso não autorizado' }, { status: 403 });
    }

    // Adiciona headers de segurança
    const response = NextResponse.next();

    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');

    return response;
}

// Apenas aplica middleware em rotas específicas
export const config = {
    matcher: [
        /*
         * Combina todas as rotas excepto:
         * - api (rotas de API são tratadas separadamente)
         * - _next/static (arquivos estáticos)
         * - _next/image (otimização de imagens)
         * - favicon.ico (favicon)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
