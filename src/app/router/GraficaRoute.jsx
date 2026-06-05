import { Navigate } from "react-router-dom";
import { getUsuario } from "@/shared/api/authToken";
import { env } from "@/shared/config/env";

/**
 * Permite acesso apenas a usuários vinculados ao CNPJ da gráfica.
 * Se a prop `requireAdmin` for true, barra qualquer perfil que não contenha 'Adm' nos acessos.
 */
export default function GraficaRoute({ children, requireAdmin = false }) {
  const usuario = getUsuario();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const cnpjUsuario = (usuario.cnpj ?? "").replace(/\D/g, "");

  if (cnpjUsuario !== env.cnpjGrafica) {
    return <Navigate to="/portfolio" replace />;
  }

  // 👇 NOVA LÓGICA: Valida a trava de administrador varrendo a lista de objetos de acesso 👇
  if (requireAdmin) {
    const isAdm = usuario.acessos?.some(acesso => acesso.role === 'Adm');
    if (!isAdm) {
      return <Navigate to="/pedidos" replace />;
    }
  }

  return children;
}