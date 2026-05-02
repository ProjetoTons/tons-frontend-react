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
 * Converte o estado do formulário em FuncionarioRequestDto aceito pelo backend.
 * - telefone: somente dígitos (back valida tamanho 11)
 * - dataNascimento: já vem em yyyy-MM-dd do <input type="date">
 * - acessos: lista de IDs numéricos (ex.: [1, 3])
 */
export function toFuncionarioRequest(form) {
  return {
    nome: (form.nome ?? "").trim(),
    email: (form.email ?? "").trim(),
    telefone: String(form.telefone ?? "").replace(/\D/g, ""),
    senha: form.senha,
    dataNascimento: form.dataNascimento,
    acessos: (form.cargo ?? []).map((v) => Number(v)),
  };
}
