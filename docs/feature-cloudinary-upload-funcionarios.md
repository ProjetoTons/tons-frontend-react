# Feature: Upload de Foto com Cloudinary — Cadastro de Funcionários

**Projeto:** Ton's Personalizados — Frontend React  
**Data:** 14 de Maio de 2026  
**Status:** A Implementar  
**Elaborado por:** Analista & Dev (via BMad Master)

---

## Índice

1. [Resumo da Feature](#1-resumo-da-feature)
2. [Front ou Back? Qual API?](#2-front-ou-back-qual-api)
3. [Configuração do Cloudinary](#3-configuração-do-cloudinary)
4. [Implementação — Passo a Passo](#4-implementação--passo-a-passo)
5. [Caso de Uso 1 — Cadastro de Funcionário](#5-caso-de-uso-1--cadastro-de-funcionário)
6. [Caso de Uso 2 — Edição de Funcionário](#6-caso-de-uso-2--edição-de-funcionário)
7. [Resumo de Arquivos](#7-resumo-de-arquivos)
8. [Considerações de Segurança](#8-considerações-de-segurança)

---

## 1. Resumo da Feature

Ao cadastrar ou editar um funcionário, a foto selecionada no formulário será enviada ao **Cloudinary** (serviço de hospedagem de imagens na nuvem). A URL retornada será incluída no payload enviado ao backend Spring Boot, que a salva como `String` no banco de dados.

**Problema atual:** O formulário captura a foto (`formData.foto`), mas a função `toFuncionarioRequest()` **descarta** esse campo. A foto nunca é salva.

**Solução:** Upload da imagem para o Cloudinary antes de salvar o funcionário → inclui a URL no payload.

---

## 2. Front ou Back? Qual API?

| Pergunta | Resposta |
|----------|----------|
| **Onde roda o upload?** | **Frontend** — chamada direta do browser para o Cloudinary |
| **Qual API?** | **Cloudinary Upload API** (unsigned preset) |
| **Precisa de SDK?** | **Não** — é um `POST` com `FormData` via `fetch` ou `axios` |
| **Precisa mudar o backend?** | **Sim** — adicionar campo `fotoUrl` (String) no DTO e na entidade |
| **Tem custo?** | **Free tier**: 25 créditos/mês (~25GB de armazenamento ou ~25k transformações) |

### Endpoint do Cloudinary

```
POST https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload
```

| Campo do FormData | Valor | Obrigatório |
|-------------------|-------|-------------|
| `file` | O arquivo (File do input) | ✅ |
| `upload_preset` | Nome do preset unsigned | ✅ |
| `folder` | Ex: `tons/funcionarios` | Opcional |

### Resposta do Cloudinary (resumida)

```json
{
  "secure_url": "https://res.cloudinary.com/SEU_CLOUD/image/upload/v123/tons/funcionarios/abc123.jpg",
  "public_id": "tons/funcionarios/abc123",
  "width": 800,
  "height": 800,
  "format": "jpg"
}
```

> O campo `secure_url` é a URL HTTPS da imagem hospedada. É isso que salvamos no banco.

---

## 3. Configuração do Cloudinary

### 3.1 Criar conta (se ainda não tem)

1. Acesse [cloudinary.com](https://cloudinary.com/) e crie uma conta gratuita
2. No **Dashboard**, copie o **Cloud Name** (ex: `dxyzabc12`)

### 3.2 Criar um Upload Preset (unsigned)

1. Vá em **Settings** → **Upload** → **Upload presets**
2. Clique em **Add upload preset**
3. Configure:
   - **Preset name:** `tons_funcionarios` (ou outro nome)
   - **Signing Mode:** `Unsigned` ⚠️ (obrigatório para upload direto do frontend)
   - **Folder:** `tons/funcionarios`
   - **Allowed formats:** `jpg, png, webp`
   - **Max file size:** `5MB` (recomendado)
   - **Transformation (eager):** *(Opcional)* `c_fill,w_400,h_400,g_face` — recorta 400x400 focando no rosto
4. Salve

### 3.3 Adicionar variáveis no `.env.local`

**Arquivo:** `.env.local` (raiz do projeto)

Adicionar:

```env
VITE_CLOUDINARY_CLOUD_NAME=SEU_CLOUD_NAME_AQUI
VITE_CLOUDINARY_UPLOAD_PRESET=tons_funcionarios
```

> **⚠️ IMPORTANTE:** Nunca coloque `API_SECRET` no frontend. O preset unsigned não precisa de secret.

---

## 4. Implementação — Passo a Passo

### 4.1 Criar o serviço de upload

**Arquivo a criar:** `src/shared/api/cloudinaryUpload.js`

```js
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Faz upload de uma imagem para o Cloudinary.
 * @param {File} file - Arquivo de imagem do input
 * @param {string} folder - Pasta no Cloudinary (ex: "tons/funcionarios")
 * @returns {Promise<string>} URL segura (HTTPS) da imagem hospedada
 */
export async function uploadImagem(file, folder = "tons/funcionarios") {
  if (!file) throw new Error("Nenhum arquivo fornecido para upload.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro?.error?.message || "Falha no upload da imagem.");
  }

  const data = await response.json();
  return data.secure_url;
}
```

### 4.2 Atualizar `toFuncionarioRequest` para incluir `fotoUrl`

**Arquivo:** `src/entities/employee/api/employeeApi.js`

Alterar a função `toFuncionarioRequest`:

```js
/**
 * Converte o estado do formulário em FuncionarioRequestDto aceito pelo backend.
 * - telefone: somente dígitos (back valida tamanho 11)
 * - dataNascimento: já vem em yyyy-MM-dd do <input type="date">
 * - acessos: lista de IDs numéricos (ex.: [1, 3])
 * - fotoUrl: URL da imagem hospedada no Cloudinary (opcional)
 */
export function toFuncionarioRequest(form) {
  const payload = {
    nome: (form.nome ?? "").trim(),
    email: (form.email ?? "").trim(),
    telefone: String(form.telefone ?? "").replace(/\D/g, ""),
    senha: form.senha,
    dataNascimento: form.dataNascimento,
    acessos: (form.cargo ?? []).map((v) => Number(v)),
  };

  // Inclui fotoUrl apenas se existir (evita enviar null/undefined)
  if (form.fotoUrl) {
    payload.fotoUrl = form.fotoUrl;
  }

  return payload;
}
```

### 4.3 Atualizar o hook de cadastro

**Arquivo:** `src/features/auth-register-employee/model/RegisterEmployeFeatureModel.js`

**Mudanças:**

1. Importar `uploadImagem`
2. No `handleSubmit`, antes de chamar `employeeApi.criar()`:
   - Se `formData.foto` existir → fazer upload → obter URL
   - Incluir `fotoUrl` no form antes de converter com `toFuncionarioRequest`

**Trecho a alterar no `handleSubmit`:**

```js
import { uploadImagem } from "@/shared/api/cloudinaryUpload";

// ... dentro de handleSubmit, ANTES de "const payload = toFuncionarioRequest(formData)":

try {
    let fotoUrl = null;

    // Upload da foto para o Cloudinary (se selecionada)
    if (formData.foto) {
        fotoUrl = await uploadImagem(formData.foto);
    }

    const payload = toFuncionarioRequest({ ...formData, fotoUrl });
    await employeeApi.criar(payload);

    // ... resto do código (notificações, navigate, etc.)
```

**Versão completa do `handleSubmit` atualizado:**

```js
const handleSubmit = async (e) => {
    e.preventDefault();

    const erroNome = obterErroNomeCompleto(formData.nome);
    if (erroNome) return setErrorMessage(erroNome);

    const erroEmail = obterErroEmail(formData.email);
    if (erroEmail) return setErrorMessage(erroEmail);

    const erroTelefone = obterErroTelefone(formData.telefone);
    if (erroTelefone) return setErrorMessage(erroTelefone);

    if (!formData.dataNascimento) return setErrorMessage("Por favor, informe a data de nascimento.");

    if (!formData.cargo || formData.cargo.length === 0) return setErrorMessage("Por favor, selecione ao menos um cargo para o funcionário.");

    setIsLoading(true);

    try {
        // 1. Upload da foto para o Cloudinary (se selecionada)
        let fotoUrl = null;
        if (formData.foto) {
            fotoUrl = await uploadImagem(formData.foto);
        }

        // 2. Monta payload com a URL da foto
        const payload = toFuncionarioRequest({ ...formData, fotoUrl });
        await employeeApi.criar(payload);

        // 3. Notificações
        const primeiroNome = formData.nome.trim().split(" ")[0];
        const telefoneComDDI = "55" + String(formData.telefone).replace(/\D/g, "");

        await Promise.allSettled([
            http.post("/notificacao/enviar-email", {
                destinatario: formData.email.trim(),
                assunto: "Cadastro confirmado - Tons Personalizados",
                corpo: `Olá ${primeiroNome}!\n\nSeu cadastro na Tons foi confirmado.`,
            }, { skipAuth: true }),
            http.post(`/whatsapp/confirmar-cadastro/${telefoneComDDI}?nome=${encodeURIComponent(primeiroNome)}`, null, { skipAuth: true }),
        ]);

        navigate("/funcionario");
    } catch (error) {
        const msg = error?.response?.data ?? error?.message;
        setErrorMessage(
            typeof msg === "string" && msg.length
                ? msg
                : "Ocorreu um erro ao tentar salvar o funcionário."
        );
    } finally {
        setIsLoading(false);
    }
};
```

---

## 5. Caso de Uso 1 — Cadastro de Funcionário

### 5.1 Fluxo Completo

```
1. Admin acessa /funcionario/cadastro
2. Preenche nome, email, senha, telefone, cargo, data de nascimento
3. Clica em "Foto do Perfil" → seleciona imagem do computador
4. Clica em "CADASTRAR"
5. Frontend valida campos
6. Se há foto:
   → POST para Cloudinary (upload unsigned)
   → Recebe secure_url (ex: https://res.cloudinary.com/.../foto.jpg)
7. Monta payload JSON incluindo fotoUrl
8. POST /usuarios/funcionario → backend salva no banco
9. Envia notificações (email + WhatsApp)
10. Redireciona para /funcionario
```

### 5.2 Diagrama de Sequência

```
[Browser]                    [Cloudinary]               [Backend Spring Boot]
    |                              |                              |
    |--- POST /image/upload ------>|                              |
    |    (FormData: file+preset)   |                              |
    |                              |                              |
    |<--- { secure_url } ---------|                              |
    |                              |                              |
    |--- POST /usuarios/funcionario ----------------------------->|
    |    { nome, email, ..., fotoUrl: "https://..." }            |
    |                              |                              |
    |<--- 201 Created ------------------------------------------|
```

---

## 6. Caso de Uso 2 — Edição de Funcionário

### 6.1 Fluxo

```
1. Admin acessa /funcionario/editar/:id
2. Formulário carrega com dados atuais (incluindo fotoUrl existente)
3. Se quiser trocar a foto → seleciona nova imagem
4. Clica em "SALVAR"
5. Se há nova foto (File object):
   → Upload para Cloudinary
   → Usa nova URL
6. Se não trocou a foto:
   → Mantém fotoUrl existente
7. PUT /usuarios/funcionario/:id com payload atualizado
```

### 6.2 Implementação no hook de edição

**Arquivo:** `src/features/Edit-Employee/model/EditEmployeeFeatureModel.js`

**Mudanças necessárias:**

1. Adicionar `fotoUrl` e `foto` ao estado inicial
2. Ao carregar dados do funcionário, preencher `fotoUrl` com o valor do backend
3. Adicionar `handleFileChange`
4. No submit, fazer upload se houver nova foto

**Estado atualizado:**

```js
const [formData, setFormData] = useState({
    nome: "",
    cargo: [],
    email: "",
    telefone: "",
    senha: "",
    dataNascimento: "",
    status: "",
    desde: "",
    fotoUrl: "",  // URL existente (vinda do backend)
    foto: null,   // Novo arquivo selecionado (File)
});
```

**Ao carregar dados do funcionário (dentro do useEffect):**

```js
setFormData((prev) => ({
    ...prev,
    nome: func.nome ?? "",
    email: func.email ?? "",
    telefone: func.telefone ?? "",
    cargo: (func.acessos ?? []).map((a) => a.id),
    dataNascimento: func.dataNascimento ?? "",
    status: func.ativo != null ? (func.ativo ? "Ativo" : "Inativo") : "",
    desde: func.dataCriacao ? new Date(func.dataCriacao).toLocaleDateString("pt-BR") : "",
    fotoUrl: func.fotoUrl ?? "",  // ← NOVO: carrega URL existente
}));
```

**handleFileChange:**

```js
const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, foto: e.target.files[0] }));
};
```

**No submit:**

```js
import { uploadImagem } from "@/shared/api/cloudinaryUpload";

// Dentro do handleSubmit:
let fotoUrl = formData.fotoUrl; // mantém URL atual por padrão

if (formData.foto) {
    // Nova foto selecionada → faz upload
    fotoUrl = await uploadImagem(formData.foto);
}

const payload = toFuncionarioRequest({ ...formData, fotoUrl });
await employeeApi.atualizar(id, payload);
```

### 6.3 Exibir preview da foto no formulário de edição

*(Opcional mas recomendado)* — Mostrar a foto atual ou a nova selecionada:

```jsx
{/* Preview da foto */}
{(formData.foto || formData.fotoUrl) && (
    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
        <img
            src={formData.foto ? URL.createObjectURL(formData.foto) : formData.fotoUrl}
            alt="Preview"
            className="w-full h-full object-cover"
        />
    </div>
)}
```

> **Nota:** Lembre de chamar `URL.revokeObjectURL()` no cleanup para evitar memory leaks.

---

## 7. Resumo de Arquivos

### Arquivos a CRIAR

| # | Arquivo | Descrição |
|---|---------|-----------|
| 1 | `src/shared/api/cloudinaryUpload.js` | Função `uploadImagem(file, folder)` — upload direto para Cloudinary |

### Arquivos a MODIFICAR

| # | Arquivo | O que mudar |
|---|---------|-------------|
| 1 | `.env.local` | Adicionar `VITE_CLOUDINARY_CLOUD_NAME` e `VITE_CLOUDINARY_UPLOAD_PRESET` |
| 2 | `src/entities/employee/api/employeeApi.js` | Incluir `fotoUrl` em `toFuncionarioRequest()` |
| 3 | `src/features/auth-register-employee/model/RegisterEmployeFeatureModel.js` | Importar `uploadImagem`, fazer upload antes de criar o funcionário |
| 4 | `src/features/Edit-Employee/model/EditEmployeeFeatureModel.js` | Adicionar `fotoUrl`/`foto` ao estado, upload no submit, `handleFileChange` |

### Backend (Spring Boot) — necessário

| # | O que fazer |
|---|-------------|
| 1 | Adicionar campo `fotoUrl` (String, nullable) na entidade `Usuario`/`Funcionario` |
| 2 | Adicionar `fotoUrl` no DTO de request (`FuncionarioRequestDto`) |
| 3 | Retornar `fotoUrl` no DTO de response (para o frontend exibir na edição) |

---

## 8. Considerações de Segurança

| Risco | Mitigação |
|-------|-----------|
| **Upload preset exposed** | Preset é `unsigned` — aceita uploads de qualquer origem. Mitigação: configurar `Allowed formats` (jpg/png/webp), `Max file size` (5MB), e `Folder` fixo no preset |
| **Arquivos maliciosos** | Cloudinary valida e sanitiza automaticamente (rejeita executáveis, scripts). Configurar `Resource type: image` no preset |
| **Excesso de uploads** | Configurar `Rate limit` no Cloudinary e validar no frontend (desabilitar botão, limitar tentativas) |
| **API Secret** | **NUNCA** colocar no frontend. O preset unsigned não precisa de secret |
| **URLs previsíveis** | Cloudinary gera IDs aleatórios. Não é possível enumerar imagens |
| **Custo** | Free tier = 25 créditos/mês. Para uma gráfica com poucos funcionários, suficiente por anos |

### Boas práticas implementadas

- ✅ Upload direto do browser (não passa pelo backend — reduz carga)
- ✅ Variáveis de ambiente via `VITE_` (não commitadas no git)
- ✅ Validação de formato e tamanho no preset do Cloudinary
- ✅ `secure_url` (HTTPS) sempre
- ✅ Pasta organizada (`tons/funcionarios`) para fácil gestão

---

## Apêndice: `.env.local` final

```env
VITE_API_URL=http://localhost:8080
VITE_CNPJ_GRAFICA=27228085000116
VITE_WHATSAPP_NUMERO=5511959823726
VITE_CLOUDINARY_CLOUD_NAME=SEU_CLOUD_NAME
VITE_CLOUDINARY_UPLOAD_PRESET=tons_funcionarios
```

---

*Documento elaborado pelo BMad Master com consultoria do Analista e do Dev — 14/05/2026.*
