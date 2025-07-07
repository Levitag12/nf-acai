#!/usr/bin/env bash
set -e
cd client
npm run build
cd ..
npm run build:server