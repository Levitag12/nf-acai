#!/bin/bash

echo "🔧 Buildando o frontend..."
cd client
npm install
npm run build
cd ..

echo "📦 Copiando frontend para o servidor..."
rm -rf server/client
mkdir -p server/client
cp -r client/dist/* server/client/

echo "📦 Buildando o backend..."
cd server
npm install
npm run build
