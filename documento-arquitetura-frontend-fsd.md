# Documento de Arquitetura Frontend — Feature-Sliced Design

**Projeto:** Tons Personalizados — Frontend React  
**Repositório:** `tons-frontend-react` (branch `merge-front`)  
**Arquiteto:** Dennis Wilson Serrano Medrano  
**Data:** 21 de Abril de 2026  
**Versão:** 1.0  
**Status:** Implementado

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Padrão Arquitetural — Feature-Sliced Design](#3-padrão-arquitetural--feature-sliced-design)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Camadas FSD — Detalhamento](#5-camadas-fsd--detalhamento)
6. [Roteamento](#6-roteamento)
7. [Fluxo de Inicialização](#7-fluxo-de-inicialização)
8. [Grafo de Dependências](#8-grafo-de-dependências)
9. [Configuração e Tooling](#9-configuração-e-tooling)
10. [Decisões Arquiteturais (ADRs)](#10-decisões-arquiteturais-adrs)
11. [Convenções e Padrões](#11-convenções-e-padrões)
12. [Evolução Planejada](#12-evolução-planejada)

---

## 1. Visão Geral

### 1.1 Propósito

Este documento descreve a arquitetura do frontend React do sistema Tons Personalizados, estruturado com **Feature-Sliced Design (FSD)** — uma metodologia arquitetural que organiza o código por responsabilidade de negócio em camadas com regras de dependência estritas.

### 1.2 Contexto

O frontend serve dois públicos:

| Público | Funcionalidades | Exemplos de página |
|---|---|---|
| **Cliente** | Catálogo de produtos, cadastro, login, acompanhamento de pedidos | `/portfolio`, `/cadastro/cliente`, `/login` |
| **Gráfica (interno)** | Gestão de pedidos, KPIs, filtros por status | `/pedidos` |

### 1.3 Objetivos da Arquitetura

- **Separação de responsabilidades**: cada camada tem um papel claro e isolado
- **Regra de importação unidirecional**: camadas superiores importam de inferiores, nunca o contrário
- **Escalabilidade**: adicionar novas features/páginas sem impactar o código existente
- **Manutenibilidade**: localizar qualquer funcionalidade pela estrutura de pastas, sem necessidade de busca

---

## 2. Stack Tecnológica

| Tecnologia | Versão | Propósito |
|---|---|---|
| **React** | 19.2.4 | Biblioteca de UI (componentes funcionais + hooks) |
| **React DOM** | 19.2.4 | Renderização para browser |
| **React Router DOM** | 7.14.1 | Roteamento client-side (SPA) |
| **Vite** | 8.0.x | Bundler e dev server (HMR) |
| **Tailwind CSS** | 4.2.2 | Utility-first CSS framework |
| **@tailwindcss/vite** | 4.2.2 | Plugin Vite para Tailwind |
| **ESLint** | 9.39.x | Linting e qualidade de código |

### 2.1 Dependências futuras (planejadas)

| Tecnologia | Propósito | Quando |
|---|---|---|
| **Axios** | Cliente HTTP para comunicação com API Gateway | Integração com backend |
| **React Context / Zustand** | Gerenciamento de estado global | Autenticação + carrinho |

---

## 3. Padrão Arquitetural — Feature-Sliced Design

### 3.1 O que é FSD

Feature-Sliced Design é uma metodologia arquitetural para aplicações frontend que organiza o código em **camadas** (layers) horizontais, cada uma com um nível de abstração específico. Dentro de cada camada, o código é dividido em **slices** (fatias de negócio) e **segments** (ui, model, api, lib).

### 3.2 Camadas (de cima para baixo)

```
┌─────────────────────────────────────────────┐
│  app       → Inicialização, router, estilos │  Camada mais alta
├─────────────────────────────────────────────┤
│  pages     → Composição de telas completas  │
├─────────────────────────────────────────────┤
│  widgets   → Blocos visuais autossuficientes│
├─────────────────────────────────────────────┤
│  features  → Ações do usuário (use cases)   │
├─────────────────────────────────────────────┤
│  entities  → Objetos de negócio (domínio)   │
├─────────────────────────────────────────────┤
│  shared    → Código genérico reutilizável   │  Camada mais baixa
└─────────────────────────────────────────────┘
```

### 3.3 Regra de Importação (Import Rule)

A regra fundamental do FSD:

> **Uma camada só pode importar de camadas ABAIXO dela. Nunca de camadas acima ou da mesma camada.**

```
app     → pode importar de: pages, widgets, features, entities, shared
pages   → pode importar de: widgets, features, entities, shared
widgets → pode importar de: features, entities, shared
features→ pode importar de: entities, shared
entities→ pode importar de: shared
shared  → não importa de nenhuma outra camada
```

**Analogia com backend**: É como a regra de camadas em Spring Boot — Controller chama Service, Service chama Repository. Repository nunca chama Controller.

### 3.4 Combinação com Atomic Design (na camada shared)

A camada `shared/ui` utiliza **Atomic Design** para organizar componentes genéricos:

| Nível | Descrição | Exemplo |
|---|---|---|
| **Atoms** | Elementos HTML estilizados, sem lógica | Button, Input, Badge |
| **Molecules** | Combinação de atoms com lógica simples | FormField (label + input + erro) |
| **Organisms** | Blocos complexos de molecules | — (promovidos a widgets no FSD) |

---

## 4. Estrutura de Pastas

```
tons-frontend-react/
├── index.html                          ← Entry point HTML (aponta para /src/app/main.jsx)
├── vite.config.js                      ← Configuração Vite + alias @/ + Tailwind
├── jsconfig.json                       ← Alias @/ para autocompletar no VS Code
├── package.json
├── eslint.config.js
│
├── public/                             ← Assets estáticos (imagens, ícones, logos)
│   ├── logo-tons/
│   ├── icons/
│   └── product/
│
└── src/
    ├── App.jsx                         ← Root component (renderiza AppRouter)
    │
    ├── app/                            ← [LAYER] Inicialização e configuração
    │   ├── main.jsx                    ← Entry point React (StrictMode + CSS globals)
    │   ├── router/
    │   │   └── AppRouter.jsx           ← Definição de rotas (BrowserRouter + Routes)
    │   └── styles/
    │       ├── index.css               ← Tailwind + Google Fonts + variáveis CSS
    │       └── App.css                 ← Reset global (* { margin: 0; padding: 0 })
    │
    ├── pages/                          ← [LAYER] Páginas (1 por rota)
    │   ├── portfolio/
    │   │   └── PortfolioPage.jsx       ← Catálogo de produtos (cliente)
    │   ├── pedidos/
    │   │   └── PedidosPage.jsx         ← Gestão de pedidos (gráfica)
    │   ├── login/
    │   │   └── LoginPage.jsx           ← Tela de login (placeholder)
    │   └── register/
    │       ├── RegisterClientPage.jsx  ← Cadastro de cliente
    │       └── RegisterEmployeePage.jsx← Cadastro de funcionário (placeholder)
    │
    ├── widgets/                        ← [LAYER] Blocos visuais compostos
    │   ├── topbar-cliente/             ← Barra fixa topo (cliente)
    │   │   ├── topbar-fix.jsx
    │   │   └── topbar-fix.css
    │   ├── navbar-cliente/             ← Navegação principal (cliente)
    │   │   ├── navbar.jsx
    │   │   └── navbar.css
    │   ├── destaque-banner/            ← Banner de destaque
    │   │   ├── destaque-banner.jsx
    │   │   └── destaque-banner.css
    │   ├── section-nome-banner/        ← Seção nome + banner
    │   │   ├── section-nome-banner.jsx
    │   │   └── section-nome-banner.css
    │   ├── faq/                        ← Seção FAQ
    │   │   ├── faq.jsx
    │   │   └── faq.css
    │   ├── footer/                     ← Rodapé
    │   │   ├── footer.jsx
    │   │   └── footer.css
    │   ├── topnav-grafica/             ← Navegação topo (gráfica)
    │   │   └── TopNavBar.jsx
    │   ├── page-header/                ← Cabeçalho de página (gráfica)
    │   │   └── PageHeader.jsx
    │   ├── kpi-grid/                   ← Grid de KPIs
    │   │   ├── KpiCard.jsx
    │   │   └── StatsGrid.jsx
    │   └── order-table/                ← Tabela de pedidos
    │       └── OrderTable.jsx
    │
    ├── features/                       ← [LAYER] Ações do usuário
    │   ├── salvar-produto/             ← Salvar produto nos favoritos
    │   │   ├── model/
    │   │   │   └── useSaveDrawer.js    ← Hook de estado (open/close/items)
    │   │   └── ui/
    │   │       ├── SaveDrawer.jsx
    │   │       └── savedrawer.css
    │   ├── filtrar-produtos/           ← Filtros do catálogo
    │   │   └── ui/
    │   │       ├── filtros.jsx
    │   │       └── filtros.css
    │   ├── auth-login/                 ← Login (placeholder)
    │   │   └── ui/
    │   │       └── LoginForm.jsx
    │   ├── auth-register-client/       ← Cadastro de cliente
    │   │   └── ui/
    │   │       └── RegisterClientForm.jsx  ← Formulário com validação de CPF
    │   └── auth-register-employee/     ← Cadastro de funcionário (placeholder)
    │       └── ui/
    │           └── RegisterEmployeeForm.jsx
    │
    ├── entities/                       ← [LAYER] Objetos de negócio
    │   ├── produto/
    │   │   ├── api/
    │   │   │   ├── mockProdutos.js     ← Dados mock (substituível por API)
    │   │   │   └── getProdutos.js      ← Re-export dos dados
    │   │   └── ui/
    │   │       ├── card/
    │   │       │   ├── card.jsx        ← Card individual de produto
    │   │       │   └── card.css
    │   │       └── list/
    │   │       │   ├── productlist.jsx ← Lista de cards de produto
    │   │           └── list.css
    │   ├── pedido/
    │   │   ├── api/
    │   │   │   └── mockPedidos.js      ← Dados mock + calcularEstatisticas()
    │   │   └── ui/
    │   │       ├── OrderRow.jsx        ← Linha da tabela de pedidos
    │   │       └── StatusBadge.jsx     ← Badge de status do pedido
    │   └── usuario/
    │       └── .gitkeep                ← Placeholder para futuro
    │
    └── shared/                         ← [LAYER] Código genérico reutilizável
        └── ui/
            └── molecules/
                └── FormField/
                    └── FormField.jsx   ← Input genérico (label + input + disabled)
```

---

## 5. Camadas FSD — Detalhamento

### 5.1 app/ — Inicialização

A camada mais alta. Responsável por:
- **Ponto de entrada** (`main.jsx`): monta o React na DOM, carrega CSS global
- **Router** (`AppRouter.jsx`): mapeia URLs para páginas
- **Estilos globais** (`index.css`, `App.css`): variáveis CSS, Tailwind, fontes

```
index.html → src/app/main.jsx → App.jsx → AppRouter.jsx → páginas
```

**Regra**: só app/ conhece o router. Nenhuma outra camada importa de app/.

### 5.2 pages/ — Páginas

Cada arquivo é uma **composição** — a página não tem lógica de negócio própria, ela apenas monta widgets, features e entities.

| Página | Rota | Função |
|---|---|---|
| `PortfolioPage` | `/portfolio` | Monta topbar + navbar + banners + lista de produtos + FAQ + footer + drawer de salvos |
| `PedidosPage` | `/pedidos` | Monta topnav + header + stats + tabela de pedidos com busca e filtro |
| `LoginPage` | `/login` | Placeholder (em construção) |
| `RegisterClientPage` | `/cadastro/cliente` | Renderiza o formulário de cadastro |
| `RegisterEmployeePage` | `/cadastro/funcionario` | Placeholder (em construção) |

**Regra**: pages importam de widgets, features, entities e shared. Nunca entre si.

### 5.3 widgets/ — Blocos Visuais

Componentes visuais **autossuficientes** — têm markup, estilos e podem ter estado interno. Não têm lógica de negócio complexa.

| Widget | Público-alvo | Função |
|---|---|---|
| `topbar-cliente` | Cliente | Barra fixa no topo com informações da loja |
| `navbar-cliente` | Cliente | Menu de navegação com logo e links |
| `destaque-banner` | Cliente | Banner principal em destaque |
| `section-nome-banner` | Cliente | Seção com nome e banner secundário |
| `faq` | Cliente | Seção de perguntas frequentes |
| `footer` | Cliente | Rodapé com informações de contato |
| `topnav-grafica` | Gráfica | Barra de navegação interna |
| `page-header` | Gráfica | Cabeçalho com título e ações |
| `kpi-grid` | Gráfica | Grid de cards com indicadores (KpiCard + StatsGrid) |
| `order-table` | Gráfica | Tabela de pedidos com colunas e ações |

**Regra**: widgets importam de features, entities e shared. Nunca de pages ou app.

### 5.4 features/ — Ações do Usuário

Cada feature encapsula um **caso de uso** completo — o que o usuário faz.

| Feature | Caso de uso | Segmentos |
|---|---|---|
| `salvar-produto` | Salvar/remover produto dos favoritos | `model/useSaveDrawer.js` (hook de estado), `ui/SaveDrawer.jsx` (drawer visual) |
| `filtrar-produtos` | Filtrar catálogo por categoria | `ui/filtros.jsx` (barra de filtros) |
| `auth-login` | Fazer login | `ui/LoginForm.jsx` (placeholder) |
| `auth-register-client` | Cadastrar como cliente | `ui/RegisterClientForm.jsx` (validação CPF, máscara telefone) |
| `auth-register-employee` | Cadastrar como funcionário | `ui/RegisterEmployeeForm.jsx` (placeholder) |

**Segmentos FSD usados**:
- `ui/` — Componentes visuais da feature
- `model/` — Hooks e lógica de estado
- `api/` — (futuro) Chamadas HTTP

**Regra**: features importam de entities e shared. Nunca de widgets ou pages.

### 5.5 entities/ — Objetos de Negócio

Representam os **conceitos do domínio**. Cada entity tem seus dados (api), representação visual (ui) e lógica de negócio (model).

| Entity | Domínio | Conteúdo |
|---|---|---|
| `produto` | Catálogo | `api/mockProdutos.js` (dados), `api/getProdutos.js` (acesso), `ui/card/` (card visual), `ui/list/` (lista de cards) |
| `pedido` | Pedidos | `api/mockPedidos.js` (dados + estatísticas), `ui/OrderRow.jsx` (linha tabela), `ui/StatusBadge.jsx` (badge de status) |
| `usuario` | Usuários | `.gitkeep` (placeholder para futuro) |

**Regra**: entities importam apenas de shared. Nunca de features, widgets ou pages.

### 5.6 shared/ — Código Genérico

Componentes e utilitários que **não sabem nada sobre o negócio**. Poderiam ser usados em qualquer projeto.

| Componente | Tipo | Função |
|---|---|---|
| `FormField` | Molecule (Atomic Design) | Input genérico com label, placeholder, tipo e estado disabled |

**Estrutura interna** (Atomic Design):
```
shared/ui/
├── atoms/        ← (futuro) Button, Input, Badge
├── molecules/    ← FormField
└── organisms/    ← (promovidos a widgets no FSD)
```

**Regra**: shared não importa de nenhuma outra camada. É a base de tudo.

---

## 6. Roteamento

### 6.1 Configuração Atual

Definido em `src/app/router/AppRouter.jsx` usando React Router DOM v7:

| Rota | Componente | Tipo |
|---|---|---|
| `/` | `Navigate → /portfolio` | Redirect |
| `/portfolio` | `PortfolioPage` | Público |
| `/pedidos` | `PedidosPage` | Público (futuro: protegido por role) |
| `/login` | `LoginPage` | Público |
| `/cadastro/cliente` | `RegisterClientPage` | Público |
| `/cadastro/funcionario` | `RegisterEmployeePage` | Público (futuro: protegido) |

### 6.2 Evolução Planejada

Quando a autenticação JWT for integrada:

```jsx
// Futuro: ProtectedRoute em app/router/
<Route path="/pedidos" element={
  <ProtectedRoute roles={['ADMIN', 'VENDEDOR', 'DESIGNER', 'PRODUCAO', 'LOGISTICA']}>
    <PedidosPage />
  </ProtectedRoute>
} />
```

---

## 7. Fluxo de Inicialização

```
index.html
  └── <script src="/src/app/main.jsx">
        └── import './styles/index.css'     ← Tailwind + Google Fonts + variáveis CSS
        └── import './styles/App.css'       ← Reset global
        └── import App from '../App.jsx'
              └── <AppRouter />
                    └── <BrowserRouter>
                          └── <Routes>
                                └── <Route path="/portfolio" element={<PortfolioPage />} />
                                └── ...
```

---

## 8. Grafo de Dependências

### 8.1 Exemplo: PortfolioPage

```
PortfolioPage (pages)
├── TopbarFix          (widgets/topbar-cliente)
├── Navbar             (widgets/navbar-cliente)
├── SectionNomeBanner  (widgets/section-nome-banner)
├── DestaqueBanner     (widgets/destaque-banner)
├── Filtros            (features/filtrar-produtos)
├── ProductList        (entities/produto/ui/list)
│   └── Card           (entities/produto/ui/card)
│   └── SavedDrawer    (features/salvar-produto)
├── FAQ                (widgets/faq)
├── Footer             (widgets/footer)
├── SaveDrawer         (features/salvar-produto)
└── useSaveDrawer()    (features/salvar-produto/model)
    └── getProdutos    (entities/produto/api)
```

### 8.2 Exemplo: PedidosPage

```
PedidosPage (pages)
├── TopNavBar          (widgets/topnav-grafica)
├── PageHeader         (widgets/page-header)
├── StatsGrid          (widgets/kpi-grid)
│   └── KpiCard        (widgets/kpi-grid)
├── OrderTable         (widgets/order-table)
│   └── OrderRow       (entities/pedido/ui)
│       └── StatusBadge(entities/pedido/ui)
└── mockPedidos        (entities/pedido/api)
    └── calcularEstatisticas()
```

### 8.3 Violações Conhecidas

| De | Para | Motivo | Plano |
|---|---|---|---|
| `entities/produto/ui/list/productlist.jsx` | `features/salvar-produto/ui/SaveDrawer.jsx` | Entity importando de feature (inversão) | Será refatorado — mover lógica de save para a page |

---

## 9. Configuração e Tooling

### 9.1 Alias de Importação

Configurado em `vite.config.js` e `jsconfig.json`:

```js
// vite.config.js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

```json
// jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

**Uso**: `import Card from '@/entities/produto/ui/card/card'` em vez de caminhos relativos (`../../../entities/...`).

### 9.2 Entry Point

```html
<!-- index.html -->
<script type="module" src="/src/app/main.jsx"></script>
```

### 9.3 CSS

- **Tailwind CSS 4**: importado via `@import "tailwindcss"` no `index.css`
- **Google Fonts**: Inter, Marvel, Montserrat, Space Grotesk (importados antes do Tailwind)
- **Variáveis CSS**: definidas em `:root` no `index.css` (`--amarelo-base`, `--preto-neutro`, etc.)
- **CSS por componente**: cada widget/feature/entity pode ter seu `.css` co-localizado

### 9.4 Lint

```bash
npm run lint    # ESLint 9 com regras React hooks + React Refresh
```

Erro conhecido (falso positivo): `__dirname is not defined` no `vite.config.js` — ESLint trata como ESM mas `__dirname` é usado pelo Vite internamente.

---

## 10. Decisões Arquiteturais (ADRs)

### ADR-F01: Feature-Sliced Design vs. Estrutura por tipo

**Decisão**: FSD  
**Alternativa descartada**: Estrutura por tipo (`components/`, `hooks/`, `pages/`, `utils/`)  
**Justificativa**:
- Estrutura por tipo não escala — pasta `components/` com 50+ arquivos sem organização
- FSD agrupa por **domínio de negócio**, facilitando localizar qualquer funcionalidade
- Regras de importação previnem acoplamento circular
- Cada dev pode trabalhar em um slice sem conflito

### ADR-F02: Atomic Design na camada shared

**Decisão**: Usar Atomic Design (atoms/molecules) apenas dentro de `shared/ui`  
**Justificativa**:
- Componentes genéricos (Button, Input, FormField) se beneficiam da classificação atômica
- Fora de shared, o FSD já provê a organização necessária (entities/features/widgets)
- Não usar Atomic Design em widgets — widgets são "organismos" no FSD

### ADR-F03: CSS co-localizado (não CSS Modules)

**Decisão**: CSS vanilla co-localizado com cada componente  
**Alternativa descartada**: CSS Modules, Styled Components  
**Justificativa**:
- Projeto acadêmico, equipe familiarizada com CSS vanilla
- Tailwind CSS cobre a maior parte da estilização inline
- CSS co-localizado (`faq.css` junto de `faq.jsx`) mantém a localidade sem tooling extra

### ADR-F04: Dados mock na camada entities/api

**Decisão**: Dados mockados vivem em `entities/{entidade}/api/`  
**Justificativa**:
- Quando o backend estiver pronto, basta substituir o mock por uma chamada HTTP no mesmo local
- A interface de acesso (`getProdutos.js`) não muda — apenas a implementação
- Pages e widgets não precisam saber se os dados são mock ou reais

---

## 11. Convenções e Padrões

### 11.1 Nomenclatura de Arquivos

| Camada | Convenção | Exemplo |
|---|---|---|
| Pages | `PascalCase` + sufixo `Page` | `PortfolioPage.jsx` |
| Widgets | `kebab-case` (pasta) + `PascalCase` ou `kebab-case` (arquivo) | `faq/faq.jsx`, `KpiCard.jsx` |
| Features | `kebab-case` (pasta) + `PascalCase` (arquivo) | `auth-register-client/RegisterClientForm.jsx` |
| Entities | `camelCase` (api) + `PascalCase` (ui) | `mockPedidos.js`, `StatusBadge.jsx` |
| Shared | Atomic Design naming | `FormField/FormField.jsx` |

### 11.2 Segmentos FSD

| Segmento | Conteúdo | Exemplo |
|---|---|---|
| `ui/` | Componentes React + CSS | `SaveDrawer.jsx`, `savedrawer.css` |
| `model/` | Hooks, estado, lógica de negócio | `useSaveDrawer.js` |
| `api/` | Dados, chamadas HTTP, mocks | `mockProdutos.js`, `getProdutos.js` |
| `lib/` | Utilitários puros (sem React) | (futuro) `formatCpf.js` |

### 11.3 Imports

- Sempre usar alias `@/` para imports entre camadas
- Imports relativos (`./`, `../`) apenas dentro do mesmo slice
- Ordem de imports: React → bibliotecas externas → camadas FSD (de baixo para cima) → relativos

---

## 12. Evolução Planejada

### 12.1 Próximos Passos (curto prazo)

| Item | Camada | Descrição |
|---|---|---|
| `shared/api/http.js` | shared | Instância Axios configurada para API Gateway (`:8080`) |
| `app/providers/AuthProvider.jsx` | app | Context de autenticação (JWT, roles) |
| `app/router/ProtectedRoute.jsx` | app | Guard de rota por role |
| `features/auth-login/` | features | Implementar formulário de login funcional |
| `entities/usuario/` | entities | Modelo de usuário com dados do JWT |

### 12.2 Integração com Backend

Quando os microserviços estiverem prontos:

```
entities/produto/api/
├── mockProdutos.js     ← SUBSTITUIR por:
├── getProdutos.js      ← import http from '@/shared/api/http'
│                          export const getProdutos = () => http.get('/api/products/catalogo')
```

### 12.3 Novas Páginas Planejadas

| Rota | Página | Camada | Dependências |
|---|---|---|---|
| `/produto/:id` | ProdutoDetalhePage | pages | entities/produto |
| `/meus-pedidos` | MeusPedidosPage | pages | entities/pedido |
| `/admin/dashboard` | DashboardPage | pages | widgets/kpi-grid, entities/pedido |
| `/admin/producao` | ProducaoPage (Kanban) | pages | features/kanban, entities/pedido |

---

**Documento preparado por:** Dennis Wilson Serrano Medrano  
**Data:** 21 de Abril de 2026  
**Baseado em:** Migração FSD executada em Abril/2026 (Fases 0-7)
