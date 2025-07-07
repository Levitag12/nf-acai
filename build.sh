#!/usr/bin/env bash
set -e
cd client
npm install
cd ..
npm run build:client
npm run build:server