import { http } from "@/shared/api/http";

const BASE = "/usuarios/funcionario";

/**
 * CRUD de Funcionário.
 *
 * Endpoints do backend (UsuarioController):
 *  - POST   /usuarios/funcionario       → cadastrar
 *  - GET    /usuarios/funcionario       → listar
 *  - PUT    /usuarios/funcionario/{id}  → atualizar
 *  - DELETE /usuarios/{id}              → soft-delete (não há rota dedicada de funcionário)
 *
 * Observação: enquanto o backend não expõe GET /usuarios/funcionario/{id},
 * `buscarPorId` usa a listagem como workaround.
 */
export const employeeApi = {
  listar: () => http.get(BASE).then((r) => r.data),

  criar: (payload) => http.post(BASE, payload).then((r) => r.data),

  atualizar: (id, payload) =>
    http.put(`${BASE}/${id}`, payload).then((r) => r.data),

  remover: (id) => http.delete(`/usuarios/${id}`).then((r) => r.data),

  buscarPorId: async (id) => {
    const lista = await http.get(BASE).then((r) => r.data);
    const idNum = Number(id);
    return lista.find((f) => f.id === idNum) ?? null;
  },
};

/**
 * Converte o estado do formulário React num formato (DTO) que o Backend em Spring Boot entende.
 * @param {Object} form - Os dados provenientes do estado do formulário React.
 * @returns {Object} payload - O objeto formatado pronto a ser enviado pela API.
 */
export function toFuncionarioRequest(form) {
  return {
    nome: (form.nome ?? "").trim(),
    email: (form.email ?? "").trim(),
    telefone: String(form.telefone ?? "").replace(/\D/g, ""),
    senha: form.senha,
    dataNascimento: form.dataNascimento,
    acessos: (form.cargo ?? []).map((v) => Number(v)),
    fotoUrl: form.fotoUrl ? form.fotoUrl : null
  }
};
