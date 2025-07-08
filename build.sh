#!/usr/bin/env bash
set -e  # Faz o script parar imediatamente se ocorrer qualquer erro

echo "🔧 Instalando dependências do backend..."
npm install

echo "📁 Entrando na pasta client..."
cd client

echo "🔧 Instalando dependências do frontend..."
npm install

echo "⚙️ Buildando o frontend com Vite..."
npm run build

echo "🔙 Voltando para a raiz do projeto..."
cd ..

echo "✅ Build finalizado com sucesso."
