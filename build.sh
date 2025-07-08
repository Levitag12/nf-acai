#!/bin/bash
echo "Instalando dependências e construindo frontend..."
cd client
npm install
npm run build
cd ..
