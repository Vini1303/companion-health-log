# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.


## Preparar ambiente local (quando houver erro de dependências ausentes)

Se aparecer erro como `vite: not found`, `vitest: not found` ou falha de instalação por `403`, execute:

```sh
npm run setup:env
```

Esse script:
- valida Node/npm;
- tenta instalar dependências com `npm install --prefer-offline --no-audit`;
- quando o registry estiver bloqueado, mostra orientação para configurar um registry interno e repetir a instalação.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Fluxo recomendado para atualizar por PR

Se você quiser manter as mudanças organizadas por Pull Request, pode seguir este fluxo:

1. Crie uma branch de trabalho para a alteração.
2. Faça as mudanças e execute os testes locais.
3. Commit com uma mensagem clara sobre o que mudou.
4. Abra uma PR para revisar e acompanhar o histórico.

Exemplo rápido:

```sh
git checkout -b feat/minha-alteracao
npm run test
git add .
git commit -m "feat: descreve a alteração"
git push -u origin feat/minha-alteracao
```


## Template de Pull Request

Para manter as próximas PRs consistentes e fáceis de revisar, este repositório agora inclui um template automático em:

- `.github/pull_request_template.md`

Ao abrir uma nova PR no GitHub, o conteúdo desse template será carregado automaticamente.


## Compilação para iPhone (iOS)

> Requer macOS com Xcode instalado.

1. Instale dependências:
```sh
npm install
```

2. Gere os arquivos web:
```sh
npm run build
```

3. Inicialize iOS (apenas na primeira vez):
```sh
npm run ios:init
```

4. Sincronize o app web com o projeto iOS:
```sh
npm run ios:sync
```

5. Abra no Xcode para compilar/assinar:
```sh
npm run ios:open
```

No Xcode, selecione um simulador/dispositivo iPhone e use **Product > Archive** para gerar build de distribuição.


## Instalar no iPhone 14 Pro Max (sem Xcode no seu iPhone)

Sim, é possível usar no seu iPhone 14 Pro Max, mas com duas opções:

1. **Como app instalado (recomendado)** via **TestFlight**
   - Você precisa compilar em um Mac com Xcode **ou** usar um serviço de build em nuvem (ex.: Codemagic / Appflow).
   - Fluxo resumido:
     1. `npm install`
     2. `npm run ios:init`
     3. `npm run ios:sync`
     4. Compilar/assinar no Xcode (ou pipeline cloud)
     5. Enviar para TestFlight
     6. Instalar no iPhone pelo app TestFlight.

2. **Como atalho na Tela de Início (sem app nativo)**
   - Publique/rode o app web e abra no Safari do iPhone.
   - Toque em **Compartilhar > Adicionar à Tela de Início**.
   - Funciona como “app”, mas não é um binário nativo da App Store.

> Importante: não existe instalação de `.ipa` diretamente no iPhone sem assinatura Apple. Para app nativo, use TestFlight/App Store ou distribuição corporativa.
