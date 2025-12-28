#!/bin/bash

# Script para testar a Gemini API
# Uso: bash test-gemini.sh

echo "🔮 Testando Gemini API..."
echo ""

# Verifica se a chave está configurada
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ Erro: GEMINI_API_KEY não está definida"
    echo ""
    echo "Configure com:"
    echo "  export GEMINI_API_KEY=sua_chave_aqui"
    echo ""
    echo "Ou adicione ao .env.local:"
    echo "  GEMINI_API_KEY=sua_chave_aqui"
    exit 1
fi

echo "✓ Chave API encontrada"
echo ""

# Faz a chamada ao Gemini
echo "Fazendo requisição ao Gemini..."
echo ""

curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Você é um astrólogo cômico. Gere um horóscopo curto e engraçado para o signo Áries hoje, com piadas sobre programação. Responda em 2-3 linhas."
          }
        ]
      }
    ]
  }' | jq '.candidates[0].content.parts[0].text'

echo ""
echo "✓ Teste concluído"
