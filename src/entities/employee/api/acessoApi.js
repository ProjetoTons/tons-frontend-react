import { http } from "@/shared/api/http";

/**
 * GET /acessos
 * Retorna todos os papéis cadastrados na tabela `acessos`.
 * Resposta esperada: [{ id, role, descricao }]
 */
export const acessoApi = {
  listar: () => http.get("/acessos").then((r) => r.data),
};

/**
 * Converte um Acesso do backend em option do <SelectForm>.
 * - value: id numérico (será enviado em `acessos: Long[]` no POST/PUT)
 * - label: nome legível, capitalizado a partir do `role` (ou `descricao` se houver)
 */
export function acessoToOption(acesso) {
  const raw = acesso.role ?? "";
  const label = raw
    .toLowerCase()
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { value: acesso.id, label };
}
