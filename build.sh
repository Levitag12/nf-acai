#!/usr/bin/env bash
set -o errexit

# FRONTEND
cd client
npm install
npm run build

# BACKEND
cd ../server
npm install
npm run build
