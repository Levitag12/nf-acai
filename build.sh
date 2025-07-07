#!/usr/bin/env bash
set -e
cd client
npm run build
cd ..
npm run build:client
npm run build:server