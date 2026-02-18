#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[setup] Verificando Node e npm..."
node -v
npm -v

echo "[setup] Tentando instalar dependências via cache local (--prefer-offline)..."
if npm install --prefer-offline --no-audit; then
  echo "[setup] Dependências instaladas com sucesso."
  exit 0
fi

echo

echo "[setup] Não foi possível instalar dependências automaticamente."
echo "[setup] Isso normalmente acontece quando o ambiente bloqueia acesso ao registry NPM (erro 403)."
echo

echo "Próximos passos sugeridos:"
echo "1) Configurar um registry interno liberado e executar:"
echo "   npm config set registry <URL_DO_REGISTRY_INTERNO>"
echo "2) Reexecutar:"
echo "   npm install"
echo "3) Validar ambiente:"
echo "   npm run lint && npm run test && npm run build"

exit 1
