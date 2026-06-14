import { Navigate } from "react-router-dom";
import { getUsuario } from "@/shared/api/authToken";
import { env } from "@/shared/config/env";

/**
 * Bloqueia funcionários (exceto Adm) de acessar áreas de clientes.
 * Funcionários não-Adm são redirecionados para /pedidos.
 */
export default function ClientRoute({ children }) {
  const usuario = getUsuario();

  if (!usuario) {
    return children;
  }

  const cnpjUsuario = (usuario.cnpj ?? "").replace(/\D/g, "");
  const isFuncionario = cnpjUsuario === env.cnpjGrafica;

  if (isFuncionario) {
    const isAdm = usuario.acessos?.some(acesso => acesso.role === "Adm");
    if (!isAdm) {
      return <Navigate to="/pedidos" replace />;
    }
  }

  return children;
}
