# 🎧 Trainee Spotify — Frontend

Clone da interface do Spotify construído em **React 19 + TypeScript + Vite + Tailwind CSS v4**. É a camada de apresentação de um projeto full-stack: consome uma API REST em Spring Boot que serve músicas, álbuns, artistas e playlists.

> 🎯 Foco: fidelidade visual ao Spotify (layout, comportamentos de hover, transições) e uma arquitetura de estado enxuta sem bibliotecas externas de gerenciamento de estado — só React Context, hooks e um punhado de helpers.

---

## 🚀 Como rodar

### 📋 Pré-requisitos

- **Node.js** 20+ (recomendado LTS)
- **npm** 10+ (já vem com o Node)
- O **backend Spring Boot** rodando localmente na porta padrão (o proxy do Vite espera `http://localhost:8080` em `/api/*`)

### ⚙️ Passo a passo

```bash
# 1. Instale as dependências
npm install

# 2. Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# 3. (Opcional) Ajuste VITE_API_BASE no .env
#    - Deixe vazio em dev para usar o proxy do Vite (evita CORS)
#    - Em produção, aponte para a URL completa do backend

# 4. Suba o servidor de desenvolvimento
npm run dev
```

O Vite abre em **http://localhost:5173** com HMR (hot module replacement) ativado. 🔥

### 🛠️ Scripts disponíveis

| Comando           | O que faz                                                                            |
| ----------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`     | 🚀 Sobe o servidor de desenvolvimento do Vite com HMR                                |
| `npm run build`   | 📦 Roda `tsc -b` (type-check com project references) e gera o bundle em `dist/`      |
| `npm run lint`    | 🧹 Executa o ESLint em todo o repositório                                            |
| `npm run preview` | 👀 Serve o build de produção localmente para um smoke test do `dist/`                |

> ℹ️ Não há suíte de testes automatizados configurada ainda.

---

## 🏗️ Stack

- ⚛️ **React 19** — biblioteca de UI
- 🟦 **TypeScript** com project references (`tsconfig.app.json` para o app, `tsconfig.node.json` para tooling)
- ⚡ **Vite 8** — build tool e dev server (com proxy `/api/*` → backend)
- 🎨 **Tailwind CSS v4** via `@tailwindcss/vite` (sem `tailwind.config.js`, sem PostCSS — customização de tema mora inline em `@theme { ... }` no CSS)
- 🔠 **Poppins** (via `@fontsource/poppins`) como fonte padrão
- 🧹 **ESLint** com flat config + `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`

---

## 📂 Estrutura de pastas

```
trainee-spotify-frontend/
├── 📄 index.html              # Ponto de entrada HTML — monta #root
├── 📄 vite.config.ts          # Configuração do Vite (plugins React + Tailwind, proxy /api)
├── 📄 tsconfig*.json          # Solution file + configs para app e Node
├── 📄 eslint.config.js        # Flat config do ESLint
├── 📄 .env.example            # Template das variáveis de ambiente
├── 📁 public/                 # Assets servidos como estão (favicon, etc.)
├── 📁 dist/                   # 📦 Build de produção (gerado por `npm run build`)
└── 📁 src/                    # 🧠 Todo o código-fonte da aplicação
```

### 🧠 `src/` — código da aplicação

```
src/
├── 📄 main.tsx                # Bootstrap: monta <App /> e envolve nos Providers globais
├── 📄 App.tsx                 # "Router" caseiro em useState + orquestração de página/entidades
├── 📄 index.css               # Único CSS global — só `@import "tailwindcss";`
├── 📄 vite-env.d.ts           # Tipos de ambiente do Vite
├── 📁 assets/                 # 🖼️ Imagens e ícones estáticos
├── 📁 components/             # 🧩 Componentes de UI
├── 📁 lib/                    # 🔧 Lógica de negócio, contextos, API e hooks
└── 📁 pages/                  # 📄 Componentes de página (Home, Playlist, Album, ...)
```

---

### 🖼️ `src/assets/` — recursos estáticos

Imagens (`.png`, `.svg`) e ícones consumidos por `import`. O Vite processa e serve com fingerprint no build.

```
assets/
├── 📁 icons/    # SVGs importados como React components ou como URL
└── 📁 images/   # Capas padrão (playlist_default.png, favorites_default.png, NoCoverPlaylist.png, etc.)
```

---

### 🧩 `src/components/` — componentes reutilizáveis

Dividida por **função** dentro da UI, não por página. Isso deixa claro o "papel" de cada peça.

#### 🏠 `components/chrome/` — a moldura da aplicação

Componentes que compõem a **estrutura visual persistente** do app, sempre presentes independente da página.

| Arquivo               | Papel                                                                                                          |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| 🖼️ `Frame.tsx`         | Layout de três colunas: `Library` + `MainSection` + `SongPanel`                                                |
| 📚 `Library.tsx`       | Biblioteca lateral esquerda — busca normalizada (sem acento), filtros por aba, sort por pin + `lastPlayedAt`   |
| 🧭 `Navbar.tsx`        | Barra superior com busca; controla o `SearchDropdown` e o breakpoint mobile via `matchMedia`                   |
| 🔎 `SearchDropdown.tsx`| Dropdown de resultados rápidos da busca (debounce de 250ms)                                                    |
| 🎼 `MainSection.tsx`   | Contêiner rolável do meio, onde as páginas são renderizadas                                                    |
| ▶️ `Player.tsx`         | Player inferior — controles de reprodução, barra de progresso e volume com math de ponteiro (drag)             |
| 🎶 `SongPanel.tsx`     | Painel direito com detalhes da música atual, "próximas" e info do artista                                      |

#### 🍽️ `components/menus/` — menus de contexto

Menus de clique direito (e "…") para cada tipo de entidade. Todos compartilham a `ContextMenuShell` para dismissão, posicionamento e viewport-flip.

| Arquivo                     | Papel                                                                          |
| --------------------------- | ------------------------------------------------------------------------------ |
| 🧱 `ContextMenuShell.tsx`    | Base compartilhada — posicionamento, viewport-flip, ESC/click-outside          |
| 🎵 `SongContextMenu.tsx`     | Adicionar/remover de playlist, curtir, ver artista/álbum, com submenu de hover |
| 📋 `PlaylistContextMenu.tsx` | Editar, excluir, tornar privada, fixar (pin)                                   |
| 🎤 `ArtistContextMenu.tsx`   | Seguir, fixar, ir para o artista                                               |
| 💿 `AlbumContextMenu.tsx`    | Salvar, fixar, ir para o álbum                                                 |

#### 🪟 `components/modals/` — janelas modais

Modais empilháveis com `ModalShell` cuidando de overlay, ESC e trap de foco.

| Arquivo                            | Papel                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------ |
| 🧰 `ModalShell.tsx`                 | Base compartilhada de modal (overlay, header, largura configurável)      |
| ✏️ `EditPlaylistDetailsModal.tsx`   | Editar nome/descrição/privacidade da playlist                            |
| 🗑️ `ConfirmDeletePlaylistModal.tsx` | Confirmação de exclusão de playlist                                      |
| 🔁 `ConfirmDuplicateSongModal.tsx`  | Confirma adicionar música que já existe na playlist                      |
| 👥 `CreditsModal.tsx`               | Modal de créditos da música                                              |

#### 🎛️ `components/ui/` — primitivos visuais

Peças pequenas e reutilizáveis, sem lógica de negócio.

| Arquivo               | Papel                                                                             |
| --------------------- | --------------------------------------------------------------------------------- |
| 🟢 `FollowButton.tsx`  | Botão de seguir/deixar de seguir (artista)                                        |
| 💊 `Pill.tsx`          | "Chip" arredondado usado como filtro (ex.: "Tudo · Músicas · Artistas · Álbuns")  |
| 🔊 `PlayingBars.tsx`   | Animação de barras verdes que indica "está tocando"                               |
| ➕ `ShowAllButton.tsx` | Botão "Mostrar tudo" das seções da Home                                            |
| 🧱 `Tile.tsx`          | Card retangular (usado em Home, seções de artistas/álbuns/playlists)               |

---

### 📄 `src/pages/` — páginas roteáveis

Cada arquivo corresponde a um valor de `Page` no `App.tsx`. As páginas fazem seus próprios `useApi(...)` para buscar dados; a navegação é feita por callbacks (`onArtistClick`, `onPlaylistClick`, `onAlbumClick`) que atualizam o estado do `App`.

| Arquivo                | O que renderiza                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| 🏠 `Home.tsx`           | Página inicial — recentes, artistas populares, playlists sugeridas                                     |
| 🔍 `SearchResults.tsx`  | Resultados da busca (debounce 250ms + filtro por tipo via `Pill`)                                      |
| 👤 `Profile.tsx`        | Perfil do usuário — top 3 artistas via Fisher-Yates shuffle em `useMemo` + playlists públicas         |
| 🎤 `Artist.tsx`         | Página do artista — populares (top 5 com "mostrar tudo") + discografia                                 |
| 📋 `Playlist.tsx`       | Página de playlist — lista de faixas com drag-and-drop reorder (flush debounced a cada 3s)             |
| 💿 `Album.tsx`          | Página do álbum — faixas + duração total (`reduce`)                                                    |
| 🎵 `PlayingSong.tsx`    | Tela cheia do player (usada quando o usuário abre o modo fullscreen)                                   |

---

### 🔧 `src/lib/` — lógica, dados e infra

Toda a "inteligência" da aplicação — o que não é UI vive aqui.

```
lib/
├── 📄 format.ts    # Formatadores puros (duração, plays, datas em pt-BR)
├── 📁 api/         # 🌐 Camada de acesso ao backend
├── 📁 contexts/    # 🧠 Estados globais via React Context
└── 📁 hooks/       # 🪝 Custom hooks reutilizáveis
```

#### 🌐 `lib/api/`

| Arquivo         | Papel                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------- |
| 📡 `client.ts`   | `apiFetch<T>` (wrapper de `fetch`), `resolveImageUrl`, tratamento de erro via `ApiError`          |
| 🔌 `endpoints.ts`| Funções finas, uma por endpoint (`getRecentMusics`, `getPlaylist`, `reorderPlaylist`, ...)         |
| 📐 `types.ts`    | DTOs (`Music`, `Album`, `Playlist`, `Artist`, `SearchResponse`, ...) — refletem o retorno da API  |

> 💡 **Nota sobre DTOs**: os objetos vêm "achatados" com `artistId`/`albumId` (ids), não objetos embutidos. A resolução (id → objeto) acontece no frontend via `EntityCacheContext` e sidecars como `SearchResponse.musicArtists`.

#### 🧠 `lib/contexts/` — estado global

Sem Redux, sem Zustand — só React Context com providers aninhados no `main.tsx`:

```
EntityCacheProvider
└── PlayerProvider
    └── LibraryProvider
        └── App
```

| Arquivo                            | Escopo                                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ▶️ `PlayerContext.tsx`              | Motor de reprodução — fila, histórico, próxima faixa, `isPlaying`, `position` (via `requestAnimationFrame`), `stampRecency`      |
| 📚 `LibraryContext.tsx`             | Músicas salvas, álbuns salvos, artistas seguidos, playlists fixadas (com pins persistidos em `localStorage`)                     |
| 🗂️ `EntityCacheContext.tsx`         | Cache compartilhado de artistas/álbuns; resolve ids em faixas via `ensureTracksResolved` com single-flight dedup                 |
| 🎵 `SongContextMenuContext.tsx`     | Estado do menu de contexto de música (posição, item aberto)                                                                      |
| 📋 `PlaylistContextMenuContext.tsx` | Estado do menu de contexto de playlist                                                                                           |
| 🎤 `ArtistContextMenuContext.tsx`   | Estado do menu de contexto de artista                                                                                            |
| 💿 `AlbumContextMenuContext.tsx`    | Estado do menu de contexto de álbum                                                                                              |

#### 🪝 `lib/hooks/`

| Arquivo                      | Papel                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| 🌐 `useApi.ts`                | Hook genérico `useApi<T>(fetcher)` com padrão `cancelled` para evitar setState em componente desmontado  |
| 🕘 `useRecentSearches.ts`     | LRU com cap 6 (chave `${kind}:${id}`), persistido em `localStorage`                                      |
| 📜 `useAutoHideScrollbar.ts`  | Adiciona/remove classe `is-scrolling` para mostrar a barra só enquanto o usuário rola                    |

#### 📐 `lib/format.ts`

Formatadores puros, sem estado:
- ⏱️ `formatDuration` — `m:ss`
- ⏳ `formatPlaylistDuration` — `1h05min` / `45min`
- 🔢 `formatPlays` — usa `Intl.NumberFormat('pt-BR')`
- 📅 `formatPtDate` — meses abreviados em português (jan, fev, mar…)

---

## 🔌 Comunicação com o backend

- Em **desenvolvimento**, o Vite faz proxy de `/api/*` para o backend (definido em `vite.config.ts`), evitando CORS.
- Em **produção**, defina `VITE_API_BASE` no `.env` apontando para a URL completa do backend.
- O cliente HTTP (`src/lib/api/client.ts`) prefixa a URL base automaticamente, lida com respostas vazias e converte erros em `ApiError`.

Para servir imagens hospedadas pelo backend, use `resolveImageUrl(path)` — ela adiciona a base corretamente.

---

## 🧭 Roteamento

Não usamos `react-router`. O `App.tsx` mantém `page: Page` em `useState` e funções `goHome / goSearch / goArtist(...) / goPlaylist(...) / goAlbum(...)` mudam o estado. O `Frame.tsx` faz o render condicional com base no `page`.

Simples, direto, sem URL. 🚦

---

## 🎨 Estilos

Tailwind v4 direto no JSX (classes utilitárias). Não há CSS modular por componente — o único arquivo CSS é `src/index.css` com um `@import "tailwindcss";`. Se precisar customizar o tema, use `@theme { ... }` inline (não crie `tailwind.config.js`).

---

## 🧪 Type-checking e Lint

- `npm run build` roda `tsc -b` (project references) antes de gerar o bundle — falha em qualquer erro de tipo.
- `npm run lint` roda o ESLint na base inteira. A config está em `eslint.config.js` (flat config).

---

## 🙋 Dúvidas comuns

- **🔴 "Meus requests estão dando CORS!"** → deixe `VITE_API_BASE` vazio em desenvolvimento e garanta que o backend está na porta que o `vite.config.ts` proxya.
- **🖼️ "As imagens não carregam"** → confirme que o backend está servindo os assets e que você está usando `resolveImageUrl(...)` (não o path cru).
- **🟡 "`tsc` reclama de coisas que não existem"** → use `tsc -b`, não `tsc`. O projeto usa project references.
- **🌀 "Fiz mudança no Tailwind e nada mudou"** → v4 não precisa de `tailwind.config.js`. Se estiver esperando por um, delete e use `@theme` inline.

---

Bom trabalho! 🚀🎧
