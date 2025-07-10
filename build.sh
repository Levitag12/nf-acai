#!/usr/bin/env bash
# exit on error
set -o errexit

# 1. Instala todas as dependências do backend listadas no package.json
echo "Instalando dependências do backend..."
npm install

# 2. Compila o código TypeScript para JavaScript (usando o script 'build' do package.json)
echo "Compilando o servidor..."
npm run build
