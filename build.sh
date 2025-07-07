#!/usr/bin/env bash
# Build completo para Render

# 1. Instala e builda o frontend
cd client
npm install
npm run build
cd ..

# 2. Instala dependências do backend
cd server
npm install
cd ..

# 3. Builda o backend (gera dist/index.js com esbuild)
npm run build
