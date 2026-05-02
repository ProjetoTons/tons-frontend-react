# Integração Frontend ↔ Backend — Cadastro de Usuário (Cliente)

Guia passo-a-passo para integrar o **fluxo de cadastro do cliente final** (PF) entre o
frontend React/Vite e a API Spring Boot, mantendo a infraestrutura JWT pronta para o
fluxo de login subsequente.

> **Escopo deste documento:** integração do **fluxo completo de cadastro do cliente PF**
> em formato wizard de 3 steps. Empresa (Step 2) é **opcional** e Endereço fica para
> iteração futura (já existe `POST /usuarios/{id}/endereco` no backend, mas exige Bearer
> token — será implementado depois do login).
>
> **Decisão de modelagem:** o `POST /usuarios` acontece **uma única vez no Step 3**
> (tela de confirmação), com todos os dados acumulados via `location.state` do React Router.
> Justificativa em §2.1 abaixo.

---

## 1. Contrato real do backend

Antes de codar qualquer coisa no frontend, fixe o contrato. Estes são os fatos
extraídos do código Java (`UsuarioController.java`, `UsuarioRequestDto.java`,
`SecurityConfiguracao.java`):

### 1.1 Endpoint público de cadastro

| Item            | Valor                                  |
|-----------------|----------------------------------------|
| Método          | `POST`                                 |
| URL             | `/usuarios`                            |
| Autenticação    | **Nenhuma** (rota está em `URLS_PERMITIDAS`) |
| Content-Type    | `application/json`                     |
| Sucesso         | `201 Created` — body texto `"Usuário cadastrado com sucesso!"` |
| Erros possíveis | `400` validação (`MethodArgumentNotValidException`) · `409 Conflict` email duplicado (`EmailJaExisteException` → `@ResponseStatus(CONFLICT)`) |

> **Formato do body de erro:** o backend não tem `@ControllerAdvice` customizado.
> Erros vêm no formato padrão do Spring Boot (JSON):
> ```json
> { "timestamp": "...", "status": 409, "error": "Conflict", "message": "Email já cadastrado!", "path": "/usuarios" }
> ```
> **Não é string** — o tratamento no frontend deve ler `error.response.data.message`.

### 1.2 Body esperado (`UsuarioRequestDto`)

```json
{
  "nome": "João da Silva",
  "cpf": "12345678901",
  "email": "joao@example.com",
  "telefone": "11999998888",
  "senha": "Senha@123",
  "cnpj": null
}
```

**Regras de validação no backend** (todos os campos obrigatórios exceto `cnpj`):

| Campo      | Restrição                                                              |
|------------|------------------------------------------------------------------------|
| `nome`     | `@NotBlank` `@NotNull`                                                 |
| `cpf`      | `@NotNull` `@CPF` (Hibernate Validator BR — valida dígitos verificadores) |
| `email`    | `@Email` `@NotNull`                                                    |
| `telefone` | `@NotNull` `@Size(min=11, max=11)` — **exatamente 11 caracteres, sem máscara** |
| `senha`    | `@NotBlank` (sem regra de complexidade no servidor — frontend valida)  |
| `cnpj`     | `@CNPJ` se enviado (opcional, vincula a uma `Empresa` já existente)    |

> ⚠️ **Telefone:** o `formData.phone` no frontend está mascarado (`(11) 99999-8888`).
> **É obrigatório limpar** para `11999998888` antes de enviar, ou o backend devolve 400.
> O CPF não tem `@Size`, mas convém enviar limpo (11 dígitos) para padronizar.

### 1.3 Login (próximo passo, fora deste doc, mas referência rápida)

| Item     | Valor                                                                        |
|----------|------------------------------------------------------------------------------|
| Método   | `POST /login`                                                                |
| Body     | `{ "email": "...", "senha": "..." }`                                         |
| Resposta | `200` + `UsuarioTokenDto { id, nome, email, telefone, token }`               |

---

## 2. Estratégia de Token JWT — divergência do `JWT.md`

### 2.1 Por que o POST acontece só no Step 3 (e não no Step 1)

O backend `UsuarioService.cadastrar` foi desenhado para receber **tudo de uma vez**
(nome + cpf + email + senha + telefone + cnpj opcional) e persistir numa única transação.
Não existe endpoint público para "cadastrar agora e adicionar CNPJ depois" — o
`PUT /usuarios/{id}` exige Bearer token, e o usuário ainda não logou nesse momento.

Se o POST acontecesse no Step 1:

- O usuário iria para o Step 2 já cadastrado, mas sem CNPJ — sem como vincular
  empresa sem auto-login (que adiciona complexidade desnecessária).
- Se fechasse a aba no Step 2, ficaria com cadastro órfão no banco. Ao retornar,
  receberia 409 ("e-mail já cadastrado") sem conseguir completar a vinculação.
- A semântica do botão "Confirmar Cadastro" do Step 3 ficaria fake (já estaria cadastrado).

**Solução adotada (wizard clássico):**

```
Step 1: /cadastro/cliente   → valida dados pessoais + propaga via state
Step 2: /cadastro/empresa   → valida CNPJ (opcional) + propaga via state
Step 3: /cadastro/sucesso   → POST /usuarios com TODOS os dados
                              ✅ sucesso → mostra confirmação
                              ❌ erro    → mostra mensagem, usuário pode voltar
```

**Trade-off:** o usuário só descobre que o e-mail/CPF já existe no fim. Para feedback
antecipado seria preciso um endpoint público tipo `GET /usuarios/disponivel?email=X`
ou `?cpf=Y` no backend — fica como melhoria futura.

### 2.2 Estratégia do token JWT

O `docs/JWT.md` descreve **Cookie HttpOnly** como melhor prática (e está correto em
termos de segurança). Porém o **backend deste projeto já está implementado** com a
estratégia clássica de **Bearer token no header `Authorization`**:

- `SecurityConfiguracao` usa `SessionCreationPolicy.STATELESS` + filtro JWT (`AutenticacaoFilter`).
- O endpoint de login retorna o token **dentro do JSON** (`UsuarioTokenDto.token`), não via `Set-Cookie`.
- Não há endpoint `/usuarios/logout` que limpe cookie no servidor.

**Decisão prática para esta integração:**

| Aspecto             | Estratégia adotada                                          |
|---------------------|-------------------------------------------------------------|
| Onde guardar token  | `sessionStorage` (limpa ao fechar aba — limita janela XSS)  |
| Como enviar         | Header `Authorization: Bearer <token>` via interceptor axios|
| Logout              | `sessionStorage.removeItem(...)` + redirect para `/login`   |
| `withCredentials`   | **Não usar** — backend não emite cookie de sessão           |

> **Para o cadastro em si, o token nem entra em cena** — o endpoint é público.
> A infra de token será usada **logo depois** quando o cliente fizer login.
> Vamos preparar o `http.js` já com o interceptor pronto, para reaproveitar.

> **Caminho de evolução** (não escopo agora): se o time decidir migrar para Cookie
> HttpOnly conforme `JWT.md`, basta alterar (a) o `LoginController` para escrever
> `Set-Cookie` em vez de retornar token no JSON e (b) remover o interceptor de
> request do axios — o `withCredentials: true` cuida do envio.

---

## 3. Estrutura de arquivos a criar/alterar

Seguindo a Feature-Sliced Design já adotada no projeto:

```
src/
├── shared/
│   ├── api/
│   │   ├── http.js              ← NOVO  Axios instance + interceptors
│   │   └── authToken.js         ← NOVO  Helpers para token (get/set/clear)
│   ├── config/
│   │   └── env.js               ← NOVO (opcional)  Centraliza VITE_API_URL
│   └── lib/
│       └── masked.js            ← ALTERAR  adicionar `apenasDigitos`
├── entities/
│   └── usuario/
│       └── api/
│           └── usuarioApi.js    ← NOVO  cadastrarUsuario({ ... })
└── features/
    ├── auth-register-client/
    │   └── model/
    │       └── RegisterClientFeatureModel.js  ← ALTERAR  remover mock; só valida + navega
    └── Register-Success/
        └── ui/
            └── RegistrationSuccessFeature.jsx ← ALTERAR  chama cadastrarUsuario aqui
```

E na raiz:

```
.env.local                       ← NOVO  VITE_API_URL=http://localhost:8080
```

---

## 4. Passo-a-passo

### Passo 1 — Variável de ambiente

Crie `.env.local` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

> Vite expõe apenas variáveis prefixadas com `VITE_`. `.env.local` já está no
> `.gitignore` por padrão do template Vite — confira se está antes de commitar.

(Opcional) Criar `src/shared/config/env.js`:

```js
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
}
```

### Passo 2 — Helpers de token (`src/shared/api/authToken.js`)

```js
const TOKEN_KEY = 'tons:authToken'
const USER_KEY  = 'tons:usuario'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setSession({ token, usuario }) {
  if (token)   sessionStorage.setItem(TOKEN_KEY, token)
  if (usuario) sessionStorage.setItem(USER_KEY, JSON.stringify(usuario))
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function getUsuario() {
  const raw = sessionStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}
```

### Passo 3 — Cliente HTTP (`src/shared/api/http.js`)

```js
import axios from 'axios'
import { env } from '@/shared/config/env'
import { getToken, clearSession } from '@/shared/api/authToken'

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// REQUEST: anexa Bearer quando existir token
http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// RESPONSE: trata 401 globalmente (token expirado/inválido)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession()
      // evita loop se já estiver na tela de login
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
```

### Passo 4 — API da entidade Usuário (`src/entities/usuario/api/usuarioApi.js`)

Crie a pasta `src/entities/usuario/api/` e dentro o arquivo:

```js
import { http } from '@/shared/api/http'

/**
 * Cadastra um usuário cliente (pessoa física).
 * Endpoint público — não exige token.
 *
 * @param {Object} payload
 * @param {string} payload.nome       Nome completo
 * @param {string} payload.cpf        Apenas dígitos (11)
 * @param {string} payload.email
 * @param {string} payload.telefone   Apenas dígitos (11) — DDD + número
 * @param {string} payload.senha
 * @param {string} [payload.cnpj]     Opcional — vincula a uma Empresa existente
 * @returns {Promise<{ status: number, message: string }>}
 */
export async function cadastrarUsuario(payload) {
  const response = await http.post('/usuarios', payload)
  return { status: response.status, message: response.data }
}
```

### Passo 5 — Sanitização: máscara → dígitos

A view envia tudo mascarado (`formData.phone = "(11) 99999-8888"`, `cpf = "123.456.789-01"`).
O backend exige **somente dígitos**. Crie uma função utilitária ou faça inline:

```js
const apenasDigitos = (str) => (str ?? '').replace(/\D/g, '')
```

> Você pode adicionar isso em `src/shared/lib/masked.js` (já existe nesse arquivo
> a lógica de aplicar máscaras — agora adiciona-se a inversa).

### Passo 6 — Step 1: remover mock e apenas propagar dados

Arquivo: `src/features/auth-register-client/model/RegisterClientFeatureModel.js`

O Step 1 **não chama mais a API**. Só valida e navega para o Step 2 carregando os
dados pessoais via `state` do router. Toda a infra de `cadastrarUsuario` será
importada no Step 3.

**Substituir o bloco do `try` dentro do `handleSubmit`** (e remover `setIsLoading`,
já que não há mais operação assíncrona neste step):

```js
// Sem chamada à API neste step. Os dados pessoais são apenas validados
// e propagados via router state. O cadastro real (POST /usuarios) acontece
// no último step (RegistrationSuccessFeature) com todos os dados acumulados.
navigate("/cadastro/empresa", {
    state: {
        dadosPessoais: formData,
        cpfSalvo: cpf,
        dadosEmpresa: dadosEmpresaRecuperados
    }
});
```

**Remover** a função `simularVerificacaoBancoDeDados` e a chamada a ela.

> Note que **`confirmPassword` continua existindo** apenas no `formData` para
> validação local. Não será enviado ao backend (não consta no DTO).

### Passo 7 — Step 3: chamar `cadastrarUsuario` na confirmação final

Arquivo: `src/features/Register-Success/ui/RegistrationSuccessFeature.jsx`

Esse componente já recebe `dadosPessoais`, `cpfSalvo` e `dadosEmpresa` via
`location.state`. O botão "Confirmar Cadastro" hoje simula com `setTimeout` —
vamos trocar pela chamada real e adicionar tratamento de erro.

**Adicionar imports no topo:**

```js
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { cadastrarUsuario } from "@/entities/usuario/api/usuarioApi"
import { apenasDigitos } from "@/shared/lib/masked"
```

**Adicionar state de erro e guard** (logo após os states existentes):

```js
const navigate = useNavigate()
const [errorMessage, setErrorMessage] = useState("")

// Guard: se cair direto em /cadastro/sucesso sem ter passado pelos steps,
// volta para o início do fluxo.
useEffect(() => {
  if (!dadosPessoais || !cpfSalvo) {
    navigate("/cadastro/cliente", { replace: true })
  }
}, [dadosPessoais, cpfSalvo, navigate])

// Limpa erro após 8s
useEffect(() => {
  if (errorMessage) {
    const t = setTimeout(() => setErrorMessage(""), 8000)
    return () => clearTimeout(t)
  }
}, [errorMessage])
```

**Substituir `handleConfirmarCadastro`:**

```js
const handleConfirmarCadastro = async () => {
  setIsSubmitting(true)
  setErrorMessage("")

  try {
    await cadastrarUsuario({
      nome:     dadosPessoais.fullName,
      cpf:      apenasDigitos(cpfSalvo),
      email:    dadosPessoais.email,
      telefone: apenasDigitos(dadosPessoais.phone),
      senha:    dadosPessoais.password,
      // CNPJ só entra se o Step 2 foi preenchido
      ...(dadosEmpresa?.cnpj && { cnpj: apenasDigitos(dadosEmpresa.cnpj) }),
    })

    setIsConfirmed(true)
  } catch (error) {
    const status = error.response?.status
    const apiMsg = error.response?.data?.message

    if (!error.response) {
      setErrorMessage("Não foi possível conectar ao servidor. Verifique sua conexão.")
    } else if (status === 409) {
      setErrorMessage("Este e-mail já está cadastrado.")
    } else if (status === 400) {
      setErrorMessage(apiMsg || "Dados inválidos. Verifique os campos do cadastro.")
    } else {
      setErrorMessage("Erro ao finalizar cadastro. Tente novamente em instantes.")
    }
  } finally {
    setIsSubmitting(false)
  }
}
```

**Renderizar a mensagem de erro** acima do botão (na FASE 1 da UI):

```jsx
{errorMessage && (
  <div className="w-full mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-semibold uppercase tracking-wider text-center">
    {errorMessage}
  </div>
)}
```

**Trocar `window.history.back()` por `navigate(-1)`** no botão "Voltar e editar
dados" — fica idiomático do React Router e mantém o `state` que carrega os dados
entre os steps.

> **Notas importantes:**
>
> - **CPF duplicado:** o backend hoje só lança `EmailJaExisteException`. CPF duplicado
>   provavelmente cai em violação de unique constraint do banco → **500 Internal Server Error**
>   (sem mensagem amigável). Se isso for requisito, peça ao time de backend para tratar e
>   devolver 409.
> - **Validação client-side de CPF:** o `cpfValido` é uma checagem de dígitos verificadores
>   no Step 1 (`validarCPF`). O backend revalida via `@CPF` no momento do POST (Step 3).

### Passo 8 — Verificar CORS no backend

O `SecurityConfiguracao.corsConfigurationSource()` usa `applyPermitDefaultValues()`
que já libera **qualquer origem** (`Access-Control-Allow-Origin: *`) para os métodos
configurados. Em dev, `http://localhost:5173` (Vite) → `http://localhost:8080` (Spring)
**deve funcionar sem alteração**.

Só será necessário tocar o backend se:

- Aparecer erro CORS no DevTools (improvável neste setup), **ou**
- Você migrar para Cookie HttpOnly — aí o `*` deixa de ser válido com
  `withCredentials` e o backend precisará especificar a origem:
  ```java
  configuracao.setAllowedOrigins(List.of("http://localhost:5173"));
  configuracao.setAllowCredentials(true);
  ```

---

## 5. Teste manual de ponta a ponta

1. **Suba o backend Spring Boot** em `http://localhost:8080`.
2. **Suba o frontend:** `npm run dev` (Vite sobe em `http://localhost:5173`).
3. Abra `http://localhost:5173/cadastro/cliente`.
4. **Step 1:** preencha CPF válido + nome + e-mail novo + telefone + senha + confirmar senha.
   Clique "Cadastrar Usuário". **Não deve haver chamada de rede aqui** — verifique no
   DevTools → Network. Apenas navega para `/cadastro/empresa`.
5. **Step 2:** preencha CNPJ válido (ou pule se a UI permitir). Avance para `/cadastro/sucesso`.
6. **Step 3:** clique "Confirmar Cadastro". **DevTools → Network → XHR**: deve aparecer
   `POST http://localhost:8080/usuarios` com status `201`. Tela muda para o checkmark verde.
7. **Repita o fluxo com o mesmo e-mail.** No Step 3, deve aparecer mensagem
   "Este e-mail já está cadastrado." e a tela permanecer no estado de confirmação.

### Casos de borda para validar

| Cenário                                            | Comportamento esperado                                |
|----------------------------------------------------|-------------------------------------------------------|
| Acessar `/cadastro/sucesso` direto na URL          | Redireciona para `/cadastro/cliente` (guard do useEffect) |
| Backend desligado (Step 3)                         | `errorMessage` = "Não foi possível conectar..."       |
| Telefone com 10 dígitos                            | Backend devolve 400 com mensagem do `@Size(min=11)`   |
| E-mail malformado (Step 1)                         | Validação client-side bloqueia antes de avançar       |
| Senha fraca (Step 1)                               | Validação client-side bloqueia antes de avançar       |
| E-mail repetido                                    | Mensagem "Este e-mail já está cadastrado." no Step 3  |
| Pular Step 2 (CNPJ vazio)                          | POST sem campo `cnpj` → cadastra usuário sem empresa  |

---

## 6. Checklist de conclusão

- [ ] `.env.local` criado com `VITE_API_URL`
- [ ] `src/shared/config/env.js` criado
- [ ] `src/shared/api/authToken.js` criado
- [ ] `src/shared/api/http.js` criado com interceptors de request e response
- [ ] `src/shared/lib/masked.js` ganhou `apenasDigitos`
- [ ] `src/entities/usuario/api/usuarioApi.js` criado
- [ ] `RegisterClientFeatureModel.js` (Step 1) limpo — mock removido, sem chamada à API
- [ ] `RegistrationSuccessFeature.jsx` (Step 3) chama `cadastrarUsuario` com tudo acumulado
- [ ] CORS validado no DevTools (sem erro de origem)
- [ ] Step 1 → Step 2 → Step 3 testado sem network requests até o botão final
- [ ] Cadastro 201 testado manualmente no Step 3
- [ ] Cadastro com e-mail duplicado testado e tratado no Step 3

---

## 7. O que vem depois (fora deste doc)

1. **Login** (`POST /login`) — guardar `token` via `setSession()` e redirecionar.
2. **PrivateRoute** — checar `getToken()` em `src/shared/lib` e proteger rotas.
3. **Step Endereço** (opcional) — `POST /usuarios/{id}/endereco` (requer Bearer,
   então só faz sentido depois do login).
4. **Endpoint de pré-validação** (melhoria UX) — pedir ao backend
   `GET /usuarios/disponivel?email=X` para feedback antecipado já no Step 1,
   evitando descobrir e-mail duplicado só no Step 3.
5. **Tratamento de CPF duplicado no backend** — hoje cai em 500 silencioso.
6. **Avaliar migração para Cookie HttpOnly** conforme `JWT.md` quando for produção.
7. **Também no `RegisterEnterpriseFeatureModel.js`** existe um
   `simularVerificacaoBancoDeDados` que precisa ser removido — nessa modelagem o
   Step 2 também só valida e propaga, sem chamar API.
