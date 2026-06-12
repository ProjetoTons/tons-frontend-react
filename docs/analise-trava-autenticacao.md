# Análise: Como Funciona a Trava de Autenticação nas Páginas

## 📊 Resumo da Proteção

| Página | Frontend | Backend | Resultado |
|--------|----------|---------|-----------|
| **Meus Pedidos** | ❌ Sem verificação | ✅ JWT obrigatório | Usuário deslogado vê spinner, depois redireciona |
| **Lista de Interesse** | ⚠️ Parcial | ✅ JWT obrigatório | Usuário deslogado vê lista vazia |
| **Configurações** | ❌ Sem verificação | ✅ JWT obrigatório | Usuário deslogado vê spinner, depois redireciona |

---

## 🔐 Como a Proteção Funciona

### 1️⃣ **Meus Pedidos** — A "Trava" Que Você Viu

**Arquivo:** `src/pages/meus-pedidos/MeusPedidosPage.jsx`

```jsx
export default function MeusPedidosPage() {
  return (
    <MeusPedidosWidget />  // ← Sem proteção aqui
  );
}
```

**A proteção real está em:** `src/widgets/meus-pedidos/MeusPedidosWidget.jsx` (linha 74)

```jsx
useEffect(() => {
  fetchMeusPedidos()  // ← Faz requisição sem verificar token
    .then((data) => { setPedidos(data); })
    .catch((err) => { setErro("Não foi possível carregar os pedidos."); });
}, []);
```

**A requisição vai para:** `src/entities/pedido/api/pedidosApi.js`

```javascript
export async function fetchMeusPedidos() {
  const { data } = await http.get("/pedidos/meus");  // ← GET sem token = 401
  return Array.isArray(data) ? data.map(toFrontend) : [];
}
```

**⚡ O que acontece quando não tem token:**

1. Frontend chama `http.get("/pedidos/meus")` sem verificar autenticação
2. Backend retorna **401 Unauthorized** (não tem JWT)
3. **Interceptor global** detecta o 401 (`src/shared/api/http.js`, linha 27):
   ```javascript
   if (error.response?.status === 401) {
     clearSession()
     window.location.href = '/login'  // ← REDIRECIONA AQUI
   }
   ```
4. Usuário é levado para `/login`

---

### 2️⃣ **Lista de Interesse** — A "Sem Trava"

**Arquivo:** `src/widgets/lista-interesse/ListaInteresseWidget.jsx`

```jsx
const isLogado = Boolean(getToken());  // ← Verifica aqui

useEffect(() => {
  async function carregar() {
    if (!getToken()) {  // ← PROTEÇÃO NO FRONTEND
      setItemsSalvos([]);
      setIsLoading(false);
      return;  // ← Para aqui, não faz requisição
    }
    // Se tiver token, faz requisição
    const itens = await listarProdutosInteresse();
  }
}, []);
```

**Resultado:** Usuário deslogado **vê a página normalmente, mas com lista vazia**. Não redireciona.

---

### 3️⃣ **Configurações** — A "Também Sem Trava"

**Arquivo:** `src/widgets/configuracoes/ConfiguracoesWidget.jsx`

```jsx
export default function ConfiguracoesWidget() {
  // ← Sem verificação de token
  const [form, setForm] = useState({ /* ... */ });

  useEffect(() => {
    // Presumo que chama buscarUsuarioPorId() aqui
    // Se não tiver token → 401 → redireciona (como em Meus Pedidos)
  }, []);

  return ( /* form/UI */ );
}
```

**Mas isso depende se há verificação em tempo de carregamento!**

---

## 🎯 O Fluxo de Proteção por JWT

```
┌─────────────────────────────────────────────────────────┐
│ Usuário clica em "Meus Pedidos"                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Página renderiza MeusPedidosWidget                      │
│ (sem verificação no front, sem proteção de rota)       │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ useEffect chama fetchMeusPedidos()                      │
│ que faz: http.get("/pedidos/meus")                     │
└──────────────────┬──────────────────────────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
         ▼                    ▼
    ✅ TEM TOKEN         ❌ SEM TOKEN
         │                    │
         ▼                    ▼
    200 OK + dados      401 Unauthorized
    Mostra pedidos           │
                             ▼
                      Interceptor detecta 401
                      clearSession()
                             │
                             ▼
                      window.location = '/login'
                      🔴 REDIRECIONA
```

---

## 💡 Por Que "Meus Pedidos" Redireciona, Mas "Lista de Interesse" Não?

### Proteção em Frontend (Lista de Interesse)

```javascript
if (!getToken()) {
  setItemsSalvos([]);
  return;  // ← Para tudo, não redireciona
}
```

**Vantagem:** UX melhor, não interrompe
**Desvantagem:** Usuário deslogado vê página, mas vazia

---

### Proteção em Backend (Meus Pedidos)

```javascript
// Backend: se não tiver JWT, retorna 401
GET /pedidos/meus
Authorization: Bearer <token>  // ← Obrigatório

// Se vazio:
401 Unauthorized
```

**Frontend intercepta 401 e redireciona**

**Vantagem:** Segurança garantida no servidor
**Desvantagem:** Redireciona bruscamente

---

## 🛠️ Onde Está Configurado

**Proteção Global:**
- `src/shared/api/http.js` — Interceptor que redireciona em 401

**Proteção Individual:**
- `src/widgets/lista-interesse/ListaInteresseWidget.jsx` — Check `if (!getToken())`

**Proteção por Backend:**
- Endpoints da API Spring Boot que requerem JWT

---

## 📝 Recomendações

Para ser **consistente** com as outras páginas, você pode:

### Opção 1: Adicionar Proteção no Frontend em Meus Pedidos
```jsx
// MeusPedidosWidget.jsx
import { getToken } from "@/shared/api/authToken";

export default function MeusPedidosWidget() {
  const [pedidos, setPedidos] = useState([]);
  const isLogado = Boolean(getToken());

  if (!isLogado) {
    return <p>Faça login para ver seus pedidos.</p>;
  }

  // Resto do código...
}
```

### Opção 2: Remover Proteção do Frontend em Lista de Interesse
```jsx
// ListaInteresseWidget.jsx
// Remover: if (!getToken()) { return; }
// Deixar apenas a API proteger
```

### Opção 3: Usar PrivateRoute (Documentado mas não implementado)
```jsx
// AppRouter.jsx
<Route path="/meus-pedidos" element={
  <PrivateRoute>
    <MeusPedidosPage />
  </PrivateRoute>
} />
```

---

## 📍 Arquivos Chave

```
src/
├── app/router/
│   └── AppRouter.jsx          # Rotas (SEM PrivateRoute)
├── shared/api/
│   ├── authToken.js           # getToken(), getUsuario()
│   └── http.js                # Interceptor que redireciona 401
├── pages/
│   ├── meus-pedidos/
│   │   └── MeusPedidosPage.jsx
│   ├── lista-interesse/
│   │   └── ListaInteressePage.jsx
│   └── configuracoes/
│       └── ConfiguracoesPage.jsx
├── widgets/
│   ├── meus-pedidos/
│   │   └── MeusPedidosWidget.jsx    # 🔴 Sem check de token
│   ├── lista-interesse/
│   │   └── ListaInteresseWidget.jsx # ✅ Com check de token
│   └── configuracoes/
│       └── ConfiguracoesWidget.jsx  # 🔴 Sem check de token
└── entities/pedido/api/
    └── pedidosApi.js          # Chama /pedidos/meus (JWT)
```
