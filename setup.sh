#!/bin/bash

# ============================================
# GUIA COMPLETO: Como configurar e usar
# ============================================

echo "🔮 Guia de Setup - Horóscopo para Programadores"
echo ""

# ============================================
# PASSO 1: OBTER CHAVE GEMINI
# ============================================
echo "📋 PASSO 1: Obter chave da API Gemini"
echo "---"
echo "1. Acesse: https://aistudio.google.com/app/apikey"
echo "2. Faça login com sua conta Google"
echo "3. Clique em 'Create API Key'"
echo "4. Copie a chave gerada (começa com AIza...)"
echo ""
read -p "Pressione Enter quando tiver a chave..."
echo ""

# ============================================
# PASSO 2: CONFIGURAR .env.local
# ============================================
echo "⚙️  PASSO 2: Configurar variáveis de ambiente"
echo "---"

# Verifica se .env.local existe
if [ -f ".env.local" ]; then
    echo "✓ Arquivo .env.local já existe"
    echo ""
    echo "Conteúdo atual:"
    cat .env.local
    echo ""
else
    echo "Criando .env.local..."
    echo "# Chave privada do servidor (NUNCA exponha ao cliente)" > .env.local
    echo "GEMINI_API_KEY=sua_chave_aqui" >> .env.local
    echo ""
    echo "✓ Arquivo .env.local criado"
fi

echo ""
echo "Edite o arquivo .env.local e coloque sua chave:"
echo "  nano .env.local"
echo ""
read -p "Pressione Enter quando tiver editado o arquivo..."
echo ""

# ============================================
# PASSO 3: INSTALAR DEPENDÊNCIAS
# ============================================
echo "📦 PASSO 3: Instalar dependências"
echo "---"
echo "Executando: npm install"
npm install
echo "✓ Dependências instaladas"
echo ""

# ============================================
# PASSO 4: TESTAR A CHAVE
# ============================================
echo "🧪 PASSO 4: Testar a chave Gemini"
echo "---"

# Carrega a chave do .env.local
source .env.local

if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ Erro: GEMINI_API_KEY não está configurada"
    exit 1
fi

echo "Testando API..."
RESPONSE=$(curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Teste: O que é Lorem Ipsum em uma linha?"
          }
        ]
      }
    ]
  }')

# Verifica se obteve resposta
if echo "$RESPONSE" | grep -q '"text"'; then
    echo "✓ API Gemini está funcionando!"
    echo ""
    echo "Resposta:"
    echo "$RESPONSE" | jq '.candidates[0].content.parts[0].text'
else
    echo "❌ Erro ao testar API"
    echo "Resposta:"
    echo "$RESPONSE" | jq '.'
    exit 1
fi

echo ""

# ============================================
# PASSO 5: INICIAR DESENVOLVIMENTO
# ============================================
echo "🚀 PASSO 5: Iniciar o servidor de desenvolvimento"
echo "---"
echo "Executando: npm run dev"
echo ""
echo "A aplicação estará disponível em: http://localhost:3000"
echo ""

npm run dev
