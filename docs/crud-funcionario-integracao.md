# CRUD Funcionário — Guia de Integração Front × Back

> **Alvo:** rota `/funcionario` (lista + ações) + `/funcionario/cadastro` (formulário) + `/funcionario/editar/:id`.
> **Backend base URL:** `http://localhost:8080` (`VITE_API_URL`)
> **Autenticação:** todas as rotas de funcionário exigem `Bearer` (já tratado por [src/shared/api/http.js](src/shared/api/http.js)).

---

## 1. Mapa do Backend (já existente)

Controller: [`UsuarioController`](../../PI-Benificiario/tons-backend/src/main/java/br/com/tonspersonalizados/controller/usuarios/UsuarioController.java)

| Método | Endpoint                       | Auth | Body / Param                    | Resposta                          |
| ------ | ------------------------------ | ---- | ------------------------------- | --------------------------------- |
| POST   | `/usuarios/funcionario`        | ✅   | `FuncionarioRequestDto`          | `201 "Funcionário cadastrado..."` |
| GET    | `/usuarios/funcionario`        | ✅   | —                               | `FuncionarioResponseDto[]`        |
| PUT    | `/usuarios/funcionario/{id}`   | ✅   | `FuncionarioRequestDto`          | `200 "Funcionário atualizado..."` |
| DELETE | `/usuarios/{id}` *(soft)*      | ✅   | —                               | `200 "Usuário deletado..."`       |
| GET    | `/acessos`                     | ✅   | —                               | `Acesso[]` para popular o select  |

### 1.1 `FuncionarioRequestDto` (POST/PUT)

```json
{
  "nome": "Roberto Almeida",
  "email": "roberto@inkiron.com",
  "telefone": "11930391700",        // exatamente 11 dígitos, SEM máscara
  "senha": "Senha@123",             // @NotNull mesmo no PUT (ver §5.2)
  "dataNascimento": "1990-05-12",   // ISO yyyy-MM-dd
  "acessos": [1, 3]                 // List<Long> com IDs de /acessos
}
```

### 1.2 `FuncionarioResponseDto` (GET)

```json
{
  "id": 7,
  "nome": "Roberto Almeida",
  "telefone": "11930391700",
  "dataNascimento": "1990-05-12",
  "acessos": [{ "id": 1, "role": "DESIGN" }, ...]
}
```

> ⚠️ **Gaps conhecidos do backend** (impactam o front):
> 1. **GET não devolve `email`** → coluna “E-mail” da tabela ficará vazia até backend adicionar.
> 2. **Não existe `GET /usuarios/funcionario/{id}`** → na edição buscamos a lista e filtramos por id (workaround MVP).
> 3. **`senha` é `@NotNull` no PUT** → ao editar precisamos mandar a senha (ver estratégia §5.2).
> 4. **DELETE usa `/usuarios/{id}`**, não `/usuarios/funcionario/{id}`.
> 5. **Sem upload de foto** → ignorar `foto` no payload.

---

## 2. Mapa do Frontend (estado atual)

| Camada FSD | Arquivo | Estado |
| ---------- | ------- | ------ |
| page       | [pages/employee/EmployeePage.jsx](src/pages/employee/EmployeePage.jsx) | OK (apenas monta widget) |
| page       | [pages/employee/EmployeeEditPage.jsx](src/pages/employee/EmployeeEditPage.jsx) | OK |
| widget     | [widgets/Employee-manager/EmployeeManagerWidget.jsx](src/widgets/Employee-manager/EmployeeManagerWidget.jsx) | ❌ usa `mockEmployee`, delete só faz `console.log` |
| feature    | [features/auth-register-employee/model/RegisterEmployeFeatureModel.js](src/features/auth-register-employee/model/RegisterEmployeFeatureModel.js) | ❌ `handleSubmit` faz `console.log` |
| feature    | [features/Edit-Employee/model/EditEmployeeFeatureModel.js](src/features/Edit-Employee/model/EditEmployeeFeatureModel.js) | ❌ usa `mockEmployee` + `opcoesCargo` hardcoded |
| entity api | [entities/employee/api/acessoApi.js](src/entities/employee/api/acessoApi.js) | ✅ pronto |
| entity api | [entities/employee/api/mockEmployee.js](src/entities/employee/api/mockEmployee.js) | 🗑️ a remover ao final |
| entity ui  | [entities/employee/ui/EmployeeTable.jsx](src/entities/employee/ui/EmployeeTable.jsx) | ❌ shape `cargo:[{Id,Cargo}]` + `avatar` — adaptar |
| shared     | [shared/api/http.js](src/shared/api/http.js) | ✅ Bearer + 401 globais |

---

## 3. Plano de implementação (passo a passo)

> Execute na ordem. Cada passo compila e roda isoladamente.

### Passo 0 — Pré-requisitos
1. Subir o backend (`mvn spring-boot:run` em `tons-backend/`).
2. Garantir `.env` com `VITE_API_URL=http://localhost:8080` (ou usar default).
3. Estar logado como usuário da gráfica (rota é protegida por [GraficaRoute](src/app/router/GraficaRoute.jsx)) — sem isso o `Bearer` não vai existir.

---

### Passo 1 — Criar `entities/employee/api/employeeApi.js`

Centraliza todas as chamadas HTTP do recurso funcionário.

**Arquivo novo:** `src/entities/employee/api/employeeApi.js`

```js
import { http } from "@/shared/api/http";

const BASE = "/usuarios/funcionario";

export const employeeApi = {
  // GET /usuarios/funcionario
  listar: () => http.get(BASE).then((r) => r.data),

  // POST /usuarios/funcionario
  criar: (payload) => http.post(BASE, payload).then((r) => r.data),

  // PUT /usuarios/funcionario/{id}
  atualizar: (id, payload) => http.put(`${BASE}/${id}`, payload).then((r) => r.data),

  // DELETE /usuarios/{id}  (soft-delete)
  remover: (id) => http.delete(`/usuarios/${id}`).then((r) => r.data),

  // Workaround enquanto não existe GET /usuarios/funcionario/{id}
  buscarPorId: async (id) => {
    const lista = await http.get(BASE).then((r) => r.data);
    const idNum = Number(id);
    return lista.find((f) => f.id === idNum) ?? null;
  },
};
```

> Quando o back adicionar `GET /usuarios/funcionario/{id}`, basta substituir `buscarPorId`.

---

### Passo 2 — Função utilitária de mapeamento

Para evitar duplicação entre cadastro/edição, adicione um helper de payload.

**No mesmo arquivo** `src/entities/employee/api/employeeApi.js`, exporte:

```js
/** Limpa máscara e monta o body aceito pelo backend. */
export function toFuncionarioRequest(form) {
  return {
    nome: form.nome.trim(),
    email: form.email.trim(),
    telefone: String(form.telefone).replace(/\D/g, ""), // back exige 11 dígitos
    senha: form.senha,                                  // pode ser placeholder no PUT
    dataNascimento: form.dataNascimento,                // já vem yyyy-MM-dd do <input type="date">
    acessos: (form.cargo ?? []).map((v) => Number(v)),  // SelectForm devolve string
  };
}
```

---

### Passo 3 — Adaptar `EmployeeTable.jsx` ao shape do backend

O backend devolve `acessos: [{id, role}]` (não `cargo: [{Id, Cargo}]`) e **não tem** `email`/`avatar`.

**Editar** [src/entities/employee/ui/EmployeeTable.jsx](src/entities/employee/ui/EmployeeTable.jsx):

- Trocar `func.avatar` por placeholder (ex.: ícone SVG ou `https://i.pravatar.cc/150?u=${func.id}`).
- Trocar `func.cargo.map((c) => c.Cargo)` por `func.acessos.map((a) => a.role)`.
- Trocar `func.email` por `func.email ?? "—"` (até backend devolver).
- `key={func.id}` segue válido (id é Long).

---

### Passo 4 — Cadastro: ligar `RegisterEmployeFeatureModel.js` ao POST

**Editar** [src/features/auth-register-employee/model/RegisterEmployeFeatureModel.js](src/features/auth-register-employee/model/RegisterEmployeFeatureModel.js):

1. Importar:
   ```js
   import { employeeApi, toFuncionarioRequest } from "@/entities/employee/api/employeeApi";
   ```
2. No `handleSubmit`, substituir o `console.log` por:
   ```js
   const payload = toFuncionarioRequest(formData);
   await employeeApi.criar(payload);
   navigate("/funcionario");
   ```
3. No `catch`, refinar mensagem com `error.response?.data ?? "Erro ao salvar funcionário."`.
4. `formData.foto` continua ignorado no payload (sem endpoint).

---

### Passo 5 — Edição: ligar `EditEmployeeFeatureModel.js` ao GET + PUT

**Editar** [src/features/Edit-Employee/model/EditEmployeeFeatureModel.js](src/features/Edit-Employee/model/EditEmployeeFeatureModel.js):

#### 5.1 Carregar dados reais

- Remover `import { mockEmployee }`.
- Remover `opcoesCargo` hardcoded — usar [acessoApi](src/entities/employee/api/acessoApi.js):
  ```js
  import { acessoApi, acessoToOption } from "@/entities/employee/api/acessoApi";
  import { employeeApi, toFuncionarioRequest } from "@/entities/employee/api/employeeApi";
  ```
- No `useEffect([id])`:
  ```js
  Promise.all([acessoApi.listar(), employeeApi.buscarPorId(id)])
    .then(([acessos, func]) => {
      setOpcoesCargo(acessos.map(acessoToOption));
      if (!func) { setErrorMessage("Funcionário não encontrado"); return; }
      setFormData({
        nome: func.nome ?? "",
        email: func.email ?? "",                // ainda virá vazio (gap §1)
        telefone: func.telefone ?? "",
        cargo: (func.acessos ?? []).map((a) => String(a.id)),
        dataNascimento: func.dataNascimento ?? "",
      });
    })
    .catch(() => setErrorMessage("Falha ao carregar funcionário."));
  ```
- Trocar `opcoesCargo` para um `useState([])`.

#### 5.2 Submeter PUT (contornando exigência de `senha`)

Como o DTO do back exige `senha`, três opções:

| Opção | Pró | Contra |
| ----- | --- | ------ |
| **A** Adicionar campo opcional “Nova senha” no form e só enviar se preenchido (mas back não aceita null) | UX correta | Exige ajuste no backend (relaxar `@NotNull`) |
| **B** Front sempre envia uma senha placeholder no PUT (ex.: `"__keep__"`) | Funciona já | **Sobrescreve a senha do funcionário** ❌ |
| **C** Pedir ao back para criar `FuncionarioUpdateDto` sem `senha` obrigatória | Correto | Requer mudança no back (recomendado) |

> **Recomendação:** abrir issue no backend para criar `FuncionarioUpdateDto` (Opção C). Enquanto isso, **adicionar campo “Nova senha (opcional)”** no form e, se vazio, **bloquear o submit com aviso** explicando que a alteração depende do backend — nunca enviar placeholder.

No `handleSubmit`:
```js
if (!formData.senha) {
  return setErrorMessage("Informe uma senha para confirmar a edição (limitação atual do backend).");
}
const payload = toFuncionarioRequest(formData);
await employeeApi.atualizar(id, payload);
navigate("/funcionario");
```

#### 5.3 Botão “Excluir Conta”

```js
const handleDeactivate = async () => {
  if (!window.confirm("Tem certeza que deseja excluir este funcionário?")) return;
  try {
    await employeeApi.remover(id);
    navigate("/funcionario");
  } catch {
    setErrorMessage("Não foi possível excluir o funcionário.");
  }
};
```

---

### Passo 6 — Lista: ligar `EmployeeManagerWidget.jsx` ao GET + DELETE

**Editar** [src/widgets/Employee-manager/EmployeeManagerWidget.jsx](src/widgets/Employee-manager/EmployeeManagerWidget.jsx):

1. Remover `import { mockEmployee }`.
2. Importar `employeeApi`.
3. Trocar o `useState/useMemo` por:
   ```js
   const [funcionarios, setFuncionarios] = useState([]);
   const [carregando, setCarregando] = useState(true);
   const [erro, setErro] = useState("");

   const recarregar = useCallback(() => {
     setCarregando(true);
     employeeApi.listar()
       .then(setFuncionarios)
       .catch(() => setErro("Falha ao carregar funcionários."))
       .finally(() => setCarregando(false));
   }, []);

   useEffect(() => { recarregar(); }, [recarregar]);

   const funcionariosFiltrados = useMemo(() => {
     if (!searchTerm) return funcionarios;
     const t = searchTerm.toLowerCase();
     return funcionarios.filter((f) =>
       f.nome?.toLowerCase().includes(t) ||
       String(f.id).includes(t) ||
       f.acessos?.some((a) => a.role?.toLowerCase().includes(t))
     );
   }, [funcionarios, searchTerm]);
   ```
4. Implementar delete real:
   ```js
   const handleDeletar = async (id) => {
     if (!window.confirm("Tem certeza que deseja excluir?")) return;
     try {
       await employeeApi.remover(id);
       recarregar();
     } catch {
       alert("Falha ao excluir funcionário.");
     }
   };
   ```
5. Renderizar estados `carregando` e `erro` acima da `<EmployeeTable>`.

---

### Passo 7 — Limpeza

- Apagar `src/entities/employee/api/mockEmployee.js`.
- Rodar `grep` por `mockEmployee` para confirmar que não há mais referências.

---

## 4. Checklist de teste manual (ordem sugerida)

| # | Cenário | Esperado |
| - | ------- | -------- |
| 1 | Login como usuário da gráfica → abrir `/funcionario` | Tabela carrega via `GET /usuarios/funcionario` (Network) |
| 2 | Clicar “Adicionar Novo Funcionário” → preencher e salvar | `POST /usuarios/funcionario` → 201 → redirect → novo item na lista |
| 3 | Tentar cadastrar sem cargo / com telefone < 11 dígitos | Validação client bloqueia, sem chamar API |
| 4 | Buscar pelo nome no input | Filtra localmente |
| 5 | Clicar editar de um funcionário | Form pré-preenchido com dados reais; select de cargos marcado |
| 6 | Alterar nome/cargo + senha + Salvar | `PUT /usuarios/funcionario/{id}` → 200 → volta à lista atualizada |
| 7 | Clicar “Excluir Conta” na edição | `DELETE /usuarios/{id}` → 200 → volta à lista sem o item |
| 8 | Excluir direto pela linha da tabela | mesmo `DELETE` → tabela recarrega |
| 9 | Sessão expirar (token inválido) | Interceptor 401 redireciona para `/login` |

---

## 5. Pendências para abrir no backend

1. Adicionar `email` em `FuncionarioResponseDto` (e popular no `listarFuncionarios`).
2. Criar `GET /usuarios/funcionario/{id}` retornando `FuncionarioResponseDto`.
3. Criar `FuncionarioUpdateDto` com `senha` opcional, ou aceitar `senha == null` no PUT mantendo a senha atual.
4. (Opcional) Endpoint dedicado `DELETE /usuarios/funcionario/{id}` para coerência REST.
5. (Opcional) Upload de foto de perfil (`/usuarios/funcionario/{id}/foto`).

---

## 6. Resumo de arquivos tocados

**Criar:**
- `src/entities/employee/api/employeeApi.js`

**Editar:**
- `src/entities/employee/ui/EmployeeTable.jsx`
- `src/widgets/Employee-manager/EmployeeManagerWidget.jsx`
- `src/features/auth-register-employee/model/RegisterEmployeFeatureModel.js`
- `src/features/auth-register-employee/ui/RegisterEmployeFeatureUi.jsx` *(opcional: ajuste de placeholders)*
- `src/features/Edit-Employee/model/EditEmployeeFeatureModel.js`
- `src/features/Edit-Employee/ui/EditEmployeeFeatureUi.jsx` *(adicionar campo “Nova senha”)*

**Remover (último passo):**
- `src/entities/employee/api/mockEmployee.js`
