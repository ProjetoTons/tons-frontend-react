# Feature: Redirecionamento WhatsApp com Produtos — v2

**Projeto:** Ton's Personalizados — Frontend React  
**Data:** 14 de Maio de 2026  
**Status:** A Implementar  
**Elaborado por:** Analista & Dev (via BMad Master)  
**Substitui:** `feature-whatsapp-redirect.md` (v1 — 05/05/2026)

---

## Índice

1. [Resumo da Feature](#1-resumo-da-feature)
2. [Front ou Back? Qual API?](#2-front-ou-back-qual-api)
3. [Pré-requisitos](#3-pré-requisitos)
4. [Caso de Uso 1 — Carrinho → WhatsApp com Lista de Produtos](#4-caso-de-uso-1--carrinho--whatsapp-com-lista-de-produtos)
5. [Caso de Uso 2 — Falar Direto com Atendente](#5-caso-de-uso-2--falar-direto-com-atendente)
6. [Resumo de Arquivos](#6-resumo-de-arquivos)
7. [Limitações e Cuidados](#7-limitações-e-cuidados)

---

## 1. Resumo da Feature

O cliente navega no portfólio, salva produtos no "carrinho" (SaveDrawer) e, ao finalizar, clica para ser redirecionado ao WhatsApp do atendente com a lista de produtos no corpo da mensagem. Alternativamente, pode falar diretamente com o atendente a qualquer momento via botão flutuante ou topbar.

---

## 2. Front ou Back? Qual API?

| Pergunta | Resposta |
|----------|----------|
| **É frontend ou backend?** | **100% Frontend** — não precisa de backend |
| **Qual API?** | API gratuita do WhatsApp Web: `https://wa.me/` |
| **Precisa de token?** | **Não** |
| **Precisa de servidor?** | **Não** |
| **Tem custo?** | **Não** — é a API pública oficial |

### Como a API funciona

```
https://wa.me/{NUMERO}?text={MENSAGEM_CODIFICADA}
```

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `{NUMERO}` | Número com DDI, sem `+`, espaços ou traços | `5511959823726` |
| `{MENSAGEM_CODIFICADA}` | Texto codificado com `encodeURIComponent()` | `Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento` |

> Em **desktop** abre o WhatsApp Web. Em **mobile** abre o app. Comportamento automático.

---

## 3. Pré-requisitos

### 3.1 Adicionar número no `.env.local`

**Arquivo:** `.env.local` (raiz do projeto)

Adicionar a linha:

```env
VITE_WHATSAPP_NUMERO=5511959823726
```

> O arquivo já possui `VITE_API_URL` e `VITE_CNPJ_GRAFICA`. Basta adicionar esta nova linha.

### 3.2 Criar funções utilitárias

**Arquivo a criar:** `src/shared/lib/whatsapp.js`

```js
/**
 * Gera a URL de redirecionamento para o WhatsApp.
 * @param {string} mensagem - Texto pré-preenchido na conversa
 * @returns {string} URL completa do WhatsApp
 */
export function gerarLinkWhatsApp(mensagem = "") {
  const numero = import.meta.env.VITE_WHATSAPP_NUMERO;
  const mensagemCodificada = encodeURIComponent(mensagem);
  return `https://wa.me/${numero}?text=${mensagemCodificada}`;
}

/**
 * Redireciona o usuário para o WhatsApp em uma nova aba.
 * @param {string} mensagem - Texto pré-preenchido
 */
export function redirecionarWhatsApp(mensagem = "") {
  const url = gerarLinkWhatsApp(mensagem);
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Formata um array de itens em uma mensagem para WhatsApp.
 * @param {Array} itens - Array de objetos com { title, category }
 * @returns {string} Mensagem formatada
 */
export function formatarListaWhatsApp(itens) {
  if (!itens || itens.length === 0) return "";

  const cabecalho =
    "📋 *Lista de Interesse — Ton's Personalizados*\n\nOlá! Gostaria de solicitar um orçamento para os seguintes itens:\n";

  const listaFormatada = itens
    .map((item, index) => `${index + 1}. ${item.title} — ${item.category}`)
    .join("\n");

  const rodape = `\n\nTotal de itens: ${itens.length}\n\nAguardo retorno! 😊`;

  return cabecalho + "\n" + listaFormatada + rodape;
}

/**
 * Redireciona para o WhatsApp com uma lista de itens formatada.
 * @param {Array} itens - Array de objetos com { title, category }
 */
export function enviarListaWhatsApp(itens) {
  const mensagem = formatarListaWhatsApp(itens);
  redirecionarWhatsApp(mensagem);
}
```

---

## 4. Caso de Uso 1 — Carrinho → WhatsApp com Lista de Produtos

### 4.1 Fluxo do Usuário

```
1. Usuário navega no portfólio (logado)
2. Clica no ícone bookmark nos produtos que gosta
3. Produtos são salvos no estado (itemsSalvos via useSaveDrawer)
4. Clica no ícone bookmark na navbar → abre SaveDrawer
5. Visualiza todos os itens salvos
6. Clica em "ENVIAR LISTA VIA WHATSAPP"
7. enviarListaWhatsApp(savedItems) é chamada
8. formatarListaWhatsApp() monta a mensagem com todos os itens
9. redirecionarWhatsApp() abre nova aba com wa.me/...
10. WhatsApp abre com a mensagem pré-preenchida
11. Usuário só precisa clicar "Enviar" no WhatsApp
```

### 4.2 Mensagem gerada (exemplo)

```
📋 *Lista de Interesse — Ton's Personalizados*

Olá! Gostaria de solicitar um orçamento para os seguintes itens:

1. Cartões de Visita — Papelaria Premium
2. Banners & Lonas — Grandes Formatos
3. Canecas Custom — Brindes Corporativos

Total de itens: 3

Aguardo retorno! 😊
```

### 4.3 Implementação — Modificar SaveDrawerFeatureUi.jsx

**Arquivo:** `src/features/salvar-produto/ui/SaveDrawerFeatureUi.jsx`

**O que mudar:**

O componente atualmente possui um **bug**: ignora a prop `savedItems` e usa dados mock internos (`savedItemsMock`). Precisamos:

1. **Corrigir o bug** — remover `savedItemsMock` e usar a prop `savedItems` que já é passada pelo `PortfolioPage`
2. **Trocar o botão** amarelo "ENVIAR PARA LISTA DE INTERESSE" por um botão verde do WhatsApp
3. **Importar** a função `enviarListaWhatsApp`

**Código atual do botão (REMOVER):**

```jsx
<button className="w-full py-4 bg-[#F7D708] hover:bg-[#e5c607] text-black font-black text-[12px] tracking-[2px] transition-colors uppercase shadow-md">
  ENVIAR PARA LISTA DE INTERESSE
</button>
```

**Código novo do botão (INSERIR NO LUGAR):**

```jsx
<button
  onClick={() => enviarListaWhatsApp(savedItems)}
  disabled={savedItems.length === 0}
  className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-[12px] tracking-[2px] transition-colors uppercase shadow-md flex items-center justify-center gap-2"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
  ENVIAR LISTA VIA WHATSAPP
</button>
```

### 4.4 SaveDrawerFeatureUi.jsx — Versão Final Completa

```jsx
import React from "react";
import { enviarListaWhatsApp } from "@/shared/lib/whatsapp";

export default function SaveDrawer({ isOpen, onClose, savedItems = [] }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[10000] transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[350px] bg-[#E0E0E0] z-[10001] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="p-8 pb-4">
          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black transition-colors"
          >
            ✕
          </button>
          <h3 className="mt-6 font-black text-lg tracking-wide text-black uppercase">
            ITENS SALVOS
          </h3>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest leading-tight">
            Sua seleção industrial curada
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
          {savedItems.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum item salvo ainda.</p>
          ) : (
            savedItems.map((item) => (
              <div
                key={item.id}
                className="bg-white flex items-center p-4 mb-4 gap-4 rounded-sm shadow-sm relative group cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-[60px] h-[60px] bg-gray-100 flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.title}
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-[13px] font-bold text-black uppercase leading-tight">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-gray-500 uppercase tracking-tighter">
                    {item.category}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-8 pt-4">
          <button
            onClick={() => enviarListaWhatsApp(savedItems)}
            disabled={savedItems.length === 0}
            className="w-full py-4 bg-[#25D366] hover:bg-[#1DA851] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-[12px] tracking-[2px] transition-colors uppercase shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            ENVIAR LISTA VIA WHATSAPP
          </button>
        </div>
      </aside>
    </>
  );
}
```

> **Nota importante:** Este componente agora usa a prop `savedItems` real em vez do mock interno. O `PortfolioPage.jsx` já passa essa prop corretamente — não precisa de nenhuma alteração lá.

---

## 5. Caso de Uso 2 — Falar Direto com Atendente

### 5.1 Fluxo do Usuário

```
1. Usuário está em qualquer lugar do site (logado ou não)
2. Precisa de ajuda ou quer falar direto com atendente
3. Opção A: Clica na topbar amarela ("ORÇAMENTOS VIA WHATSAPP")
4. Opção B: Clica no botão flutuante verde (canto inferior direito)
5. WhatsApp abre com mensagem genérica de saudação
6. Usuário digita sua dúvida e envia
```

### 5.2 Mensagem gerada (exemplo)

```
Olá! Vim pelo site da Ton's Personalizados e gostaria de falar com um atendente.
```

### 5.3 Implementação — Componente WhatsAppButton (reutilizável)

**Arquivo a criar:** `src/shared/ui/atoms/WhatsAppButton.jsx`

```jsx
import { redirecionarWhatsApp } from "@/shared/lib/whatsapp";

export default function WhatsAppButton({
  mensagem = "Olá! Gostaria de solicitar um orçamento.",
  className = "",
}) {
  const handleClick = () => {
    redirecionarWhatsApp(mensagem);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 px-6 uppercase text-xs tracking-wider transition-colors cursor-pointer ${className}`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Falar no WhatsApp
    </button>
  );
}
```

### 5.4 Implementação — Botão Flutuante (WhatsApp FAB)

**Arquivo a criar:** `src/shared/ui/atoms/WhatsAppFab.jsx`

Botão flutuante fixo no canto inferior direito, visível em **todas as páginas**, para **todos os usuários** (logados ou não).

```jsx
import { redirecionarWhatsApp } from "@/shared/lib/whatsapp";

export default function WhatsAppFab() {
  return (
    <button
      onClick={() =>
        redirecionarWhatsApp(
          "Olá! Vim pelo site da Ton's Personalizados e gostaria de falar com um atendente."
        )
      }
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-[#25D366] hover:bg-[#1DA851] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
      aria-label="Falar no WhatsApp"
    >
      <svg className="w-7 h-7" fill="white" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </button>
  );
}
```

### 5.5 Onde colocar o WhatsAppFab

**Arquivo a modificar:** `src/App.jsx`

```jsx
import { AppRouter } from "./app/router/AppRouter";
import WhatsAppFab from "@/shared/ui/atoms/WhatsAppFab";

function App() {
  return (
    <>
      <AppRouter />
      <WhatsAppFab />
    </>
  );
}

export default App;
```

> Assim o botão flutuante aparece em **todas** as páginas do site automaticamente, sem precisar importar em cada página.

### 5.6 Topbar clicável (opcional mas recomendado)

**Arquivo a modificar:** `src/widgets/topbar-cliente/topbar-fix.jsx`

A topbar amarela já diz "ORÇAMENTOS VIA WHATSAPP". Torná-la clicável faz todo sentido:

```jsx
import { redirecionarWhatsApp } from "@/shared/lib/whatsapp";

function TopbarFix() {
  return (
    <section
      onClick={() => redirecionarWhatsApp("Olá! Gostaria de solicitar um orçamento.")}
      className="w-full bg-[var(--amarelo-base)] py-[0.5%] cursor-pointer hover:brightness-95 transition-all"
    >
      <h1 className="font-[var(--fonte-inter)] text-center text-[11px] font-bold tracking-[3px]">
        ORÇAMENTOS VIA WHATSAPP. NÃO EXIBIMOS PREÇOS NO SITE.
      </h1>
    </section>
  );
}

export default TopbarFix;
```

---

## 6. Resumo de Arquivos

### Arquivos a CRIAR

| # | Arquivo | Descrição |
|---|---------|-----------|
| 1 | `src/shared/lib/whatsapp.js` | Funções: `gerarLinkWhatsApp`, `redirecionarWhatsApp`, `formatarListaWhatsApp`, `enviarListaWhatsApp` |
| 2 | `src/shared/ui/atoms/WhatsAppButton.jsx` | Botão reutilizável inline (para usar em qualquer lugar) |
| 3 | `src/shared/ui/atoms/WhatsAppFab.jsx` | Botão flutuante fixo (canto inferior direito, todas as páginas) |

### Arquivos a MODIFICAR

| # | Arquivo | O que mudar |
|---|---------|-------------|
| 1 | `.env.local` | Adicionar `VITE_WHATSAPP_NUMERO=5511959823726` |
| 2 | `src/features/salvar-produto/ui/SaveDrawerFeatureUi.jsx` | Corrigir bug do mock → usar prop `savedItems` real + trocar botão amarelo por botão verde WhatsApp + importar `enviarListaWhatsApp` |
| 3 | `src/App.jsx` | Adicionar `<WhatsAppFab />` para botão flutuante global |
| 4 | `src/widgets/topbar-cliente/topbar-fix.jsx` | *(Opcional)* Tornar clicável → redireciona WhatsApp |

### Arquivos que NÃO precisam mudar

| Arquivo | Motivo |
|---------|--------|
| `PortfolioPage.jsx` | Já passa `savedItems` corretamente para o SaveDrawer |
| `useSaveDrawerFeatureModel.js` | Hook já funciona (toggle, open, close) |
| `mockProdutos.js` | Dados já possuem `title` e `category` — formato compatível |
| `card.jsx` / `productlist.jsx` | Bookmark já funciona, sem alteração necessária |
| `AppRouter.jsx` | Nenhuma rota nova é necessária |

---

## 7. Limitações e Cuidados

| Limitação | Descrição | Solução |
|-----------|-----------|---------|
| **Tamanho da URL** | URLs > 2000 chars podem falhar em alguns navegadores | Limitar lista a ~20 itens ou truncar mensagem |
| **Sem confirmação** | Não há callback do WhatsApp confirmando envio | Exibir toast/feedback: "Redirecionado para o WhatsApp!" |
| **Desktop vs Mobile** | Desktop abre WhatsApp Web; mobile abre o app | Comportamento nativo da API `wa.me` — automático |
| **Número fixo** | Apenas 1 número de atendente | Se precisar rotacionar, criar array no `.env` |
| **Usuário não logado** | Bookmark e SaveDrawer só aparecem para logados (`getUsuario()` na navbar) | Botão flutuante (FAB) e topbar ficam visíveis para **todos** |
| **Bloqueador de pop-up** | Alguns navegadores bloqueiam `window.open` | Usar `window.location.href` como fallback |

---

*Documento elaborado pelo BMad Master com consultoria do Analista e do Dev — v2 (14/05/2026).*
