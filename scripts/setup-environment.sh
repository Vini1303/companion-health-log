#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f package.json ]]; then
  echo "[setup] Erro: package.json não encontrado em $ROOT_DIR"
  echo "[setup] Entre na pasta do projeto e tente novamente."
  exit 1
fi

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[setup] Erro: comando '$1' não encontrado."
    exit 1
  fi
}

require_cmd node
require_cmd npm

echo "[setup] Node: $(node -v)"
echo "[setup] npm:  $(npm -v)"

if [[ -n "${NPM_REGISTRY_URL:-}" ]]; then
  echo "[setup] Configurando registry customizado: $NPM_REGISTRY_URL"
  npm config set registry "$NPM_REGISTRY_URL"
fi

echo "[setup] Instalando dependências (tentativa 1: prefer-offline)..."
if ! npm install --prefer-offline --no-audit; then
  echo "[setup] Tentativa 1 falhou. Tentando instalação padrão..."
  npm install --no-audit
fi

echo "[setup] Verificando binários locais..."
if [[ ! -x node_modules/.bin/vite ]] || [[ ! -x node_modules/.bin/vitest ]] || [[ ! -x node_modules/.bin/eslint ]]; then
  echo "[setup] Dependências incompletas (vite/vitest/eslint não encontrados em node_modules/.bin)."
  echo "[setup] Se houver bloqueio de rede/proxy, configure um registry interno e rode novamente:"
  echo "        NPM_REGISTRY_URL=<URL> npm run setup:env"
  exit 1
fi

echo "[setup] Ambiente base pronto com sucesso."
echo "[setup] Próximo passo: npm run verify:env"
