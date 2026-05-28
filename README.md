# Kanban SESE — Aplicativo PWA

Sistema Kanban em tempo real com Firebase, agora instalável como **aplicativo** no celular e desktop, **totalmente responsivo** para mobile, e organizado em três níveis: **Área › Projeto › Quadro**.

---

## 🧭 Telas de visão geral (consulta)

Além dos seletores no topo, o app tem duas telas de "hub" para navegar e consultar tudo de relance:

- **Todas as áreas** — mostra cada área em um cartão com a quantidade de projetos, quadros e cards, o progresso médio e quem pode ver/editar. Acesse pelo botão **Áreas** no cabeçalho, clicando na logo, ou pelo menu ☰ no celular.
- **Projetos da área** — ao abrir uma área, mostra todos os projetos dela em cartões com quadros, cards e progresso. Acesse clicando numa área na tela anterior, no nome da área no caminho (breadcrumb), ou pelo menu ☰.

A navegação fica registrada num caminho clicável no topo de cada quadro: **Áreas › [Área] › [Projeto]** — toque em qualquer nível para voltar. Tudo se adapta à tela: no computador os cartões ficam lado a lado; no celular, empilhados em coluna única.

---



O app tem um seletor de tema para trocar a cor do layout na hora, com três opções:

- **Azul** (padrão) — fundo escuro neutro com destaques azuis.
- **Verde** — fundo escuro esverdeado com destaques verdes.
- **Preto** — monocromático, fundo preto puro com destaques em prata/branco.

O seletor fica no canto direito do cabeçalho (no desktop) e no topo do menu ☰ (no celular). A escolha é salva no próprio aparelho (cada pessoa pode usar um tema diferente) e a barra de status do app instalado também acompanha a cor escolhida. As cores próprias de áreas, projetos e quadros são independentes do tema.

---

## 🗂️ Hierarquia Área › Projeto › Quadro

A organização agora tem três níveis:

- **Área** — o nível mais alto (ex: Planejamento, RH, TI). Cada área controla permissões (quem vê / quem edita por departamento).
- **Projeto** — agrupa vários quadros dentro de uma área (ex: "App Mobile", "Migração ERP"). Tem nome e cor próprios.
- **Quadro (Kanban)** — o board com colunas e cards. Cada quadro pertence a um projeto.

No topo do app aparecem três seletores em sequência: `Área › Projeto › Quadro`. No celular, o menu (☰) traz a navegação completa entre projetos e quadros.

Os dados antigos migram automaticamente: cada área existente recebe um "Projeto principal" e todos os quadros são movidos para dentro dele — nada se perde.

---

## 📦 O que mudou

### 1. App instalável (PWA)
O Kanban agora pode ser **instalado como aplicativo nativo** no celular (Android/iOS) e no desktop (Chrome, Edge, Brave). Quando aberto, roda em tela cheia sem barra do navegador, com ícone próprio na tela inicial.

- ✅ `manifest.json` configurado com nome, ícones e cores do tema
- ✅ Service Worker (`sw.js`) com cache inteligente do app shell — abre rápido mesmo com internet ruim
- ✅ Firebase **nunca é cacheado** — sincronização em tempo real sempre na rede
- ✅ Suporte a **iOS** (Apple touch icon, status bar translúcida, safe-area do notch)
- ✅ Suporte a **Android** (maskable icons, theme color, shortcuts)
- ✅ Botão automático de "Instalar" no drawer do mobile quando o navegador suporta

### 2. Logo do aplicativo
Logo nova representando o conceito visual do Kanban:
- 3 colunas (Backlog → Em andamento → Concluído)
- Card final com check verde indicando conclusão
- Barra de progresso na base
- Gradiente azul (#3b5cff → #1e3a8a)
- Cantos arredondados estilo iOS/Android

Disponível em todos os tamanhos necessários: 16, 32, 180, 192, 512, e versões maskable para Android.

### 3. Responsividade mobile
Layout completamente adaptado para telas pequenas:

- **Header mobile**: ícone compacto + indicador de status + atalho dashboard + menu hamburguer
- **Drawer lateral**: abre da direita com busca, importar/exportar, dashboard e botão de instalar app
- **Colunas Kanban**: largura 86vw no mobile (uma coluna por tela, com scroll horizontal natural)
- **Modais full-screen** no celular (sem perder padding no notch)
- **Dashboard**: KPI cards em 2 colunas, gráficos empilhados verticalmente
- **Inputs com font-size ≥ 16px** (evita o zoom automático do iOS)
- **Safe-area insets** para iPhones com notch/dynamic island
- **touch-action: manipulation** em todos os botões (sem delay de 300ms)

---

## 📁 Arquivos

```
kanban-app/
├── index.html                  ← App principal (modificado)
├── manifest.json               ← Configuração PWA
├── sw.js                       ← Service Worker
├── favicon.ico
├── icon-16.png
├── icon-32.png
├── icon-180.png                ← Apple touch icon
├── icon-192.png                ← PWA padrão
├── icon-512.png                ← PWA padrão (high-res)
├── icon-maskable-192.png       ← Android adaptive icon
├── icon-maskable-512.png       ← Android adaptive icon
└── logo.svg                    ← Arquivo fonte da logo
```

---

## 🚀 Como hospedar

A aplicação precisa ser servida via **HTTPS** para o PWA funcionar (Service Worker exige HTTPS, exceto em `localhost`).

### Opção 1 — Firebase Hosting (recomendado, já tem o Firebase do projeto)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting          # escolha o projeto kanban-99a99
# diretório público: a pasta que contém index.html
firebase deploy
```

### Opção 2 — Vercel / Netlify
Arraste a pasta inteira na interface web de qualquer um dos dois e está pronto.

### Opção 3 — Servidor próprio
Sirva a pasta com qualquer servidor estático. Certifique-se de:
- Usar HTTPS
- `Content-Type` correto para `manifest.json` (`application/manifest+json` ou `application/json`)
- `Service-Worker-Allowed: /` se o `sw.js` não estiver na raiz

### Teste local rápido
```bash
cd kanban-app
python3 -m http.server 8000
# abra http://localhost:8000 (PWA funciona em localhost mesmo sem HTTPS)
```

---

## 📲 Como instalar como app

### Android (Chrome / Edge / Brave)
1. Abra a URL no navegador
2. Toque no menu (⋮) → **Instalar aplicativo** *ou* **Adicionar à tela inicial**
3. O ícone do Kanban aparece como qualquer outro app
4. Também aparece um botão "Instalar no dispositivo" dentro do drawer mobile do próprio app

### iOS (Safari)
1. Abra a URL no Safari
2. Toque no botão de compartilhar (▢↑)
3. Role para baixo e toque em **Adicionar à Tela de Início**
4. O ícone do Kanban aparece como app nativo
*(O iOS não dá o prompt automático — sempre via Safari → Compartilhar)*

### Desktop (Chrome / Edge)
1. Abra a URL
2. Aparece um ícone de instalação na barra de endereço (lado direito)
3. Clique → **Instalar**
4. O Kanban abre em janela própria, sem abas

---

## 🔧 Compatibilidade

| Recurso | Chrome/Edge | Firefox | Safari iOS | Safari macOS |
|---|---|---|---|---|
| Instalar como app | ✅ | ⚠️ (limitado) | ✅ (Adic. tela inicial) | ✅ 17+ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Notificações push | ✅ | ✅ | ✅ 16.4+ | ✅ |
| Manifest icons | ✅ | ✅ | ✅ | ✅ |

---

## 🔄 Atualização do app

Quando você publicar uma nova versão do `index.html`, mude o `CACHE_VERSION` no `sw.js` (ex: `'kanban-sese-v2'`). O Service Worker antigo será descartado e o cache renovado automaticamente.
