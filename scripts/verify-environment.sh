#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f package.json ]]; then
  echo "[verify] Erro: package.json não encontrado em $ROOT_DIR"
  exit 1
fi

echo "[verify] Rodando lint..."
npm run lint

echo "[verify] Rodando testes..."
npm run test

echo "[verify] Rodando build..."
npm run build

echo "[verify] Ambiente validado com sucesso."
