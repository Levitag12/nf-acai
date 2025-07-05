#!/usr/bin/env bash
# Build script para Render

# 1. Instalar e buildar o frontend
cd client
npm install
npm run build
cd ..

# 2. Instalar o backend
cd server
npm install
