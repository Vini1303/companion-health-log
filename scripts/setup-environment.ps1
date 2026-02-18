$ErrorActionPreference = "Stop"

$RootDir = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $RootDir

if (!(Test-Path (Join-Path $RootDir "package.json"))) {
  Write-Host "[setup] Erro: package.json não encontrado em $RootDir"
  Write-Host "[setup] Entre na pasta do projeto e tente novamente."
  exit 1
}

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "[setup] Erro: node não encontrado."
  exit 1
}

if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
  Write-Host "[setup] Erro: npm não encontrado."
  exit 1
}

Write-Host "[setup] Node: $(node -v)"
Write-Host "[setup] npm:  $(npm -v)"

if ($env:NPM_REGISTRY_URL) {
  Write-Host "[setup] Configurando registry customizado: $($env:NPM_REGISTRY_URL)"
  npm config set registry $env:NPM_REGISTRY_URL
}

Write-Host "[setup] Instalando dependências (tentativa 1: prefer-offline)..."
try {
  npm install --prefer-offline --no-audit
}
catch {
  Write-Host "[setup] Tentativa 1 falhou. Tentando instalação padrão..."
  npm install --no-audit
}

$missing = @()
if (!(Test-Path "node_modules/.bin/vite")) { $missing += "vite" }
if (!(Test-Path "node_modules/.bin/vitest")) { $missing += "vitest" }
if (!(Test-Path "node_modules/.bin/eslint")) { $missing += "eslint" }

if ($missing.Count -gt 0) {
  Write-Host "[setup] Dependências incompletas: $($missing -join ', ')"
  Write-Host "[setup] Configure um registry interno e rode novamente:"
  Write-Host '        $env:NPM_REGISTRY_URL="<URL>"; npm run setup:env:win'
  exit 1
}

Write-Host "[setup] Ambiente base pronto com sucesso."
Write-Host "[setup] Próximo passo: npm run verify:env"
