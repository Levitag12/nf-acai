#!/usr/bin/env bash

# Instala as dependências do back-end
npm install

# Instala as dependências do front-end
cd client
npm install

# Builda o front-end
npm run build

# Volta para a raiz
cd ..

# Agora sim, pode buildar o backend (se necessário)
