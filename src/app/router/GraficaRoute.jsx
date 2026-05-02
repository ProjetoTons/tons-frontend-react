import { Navigate } from "react-router-dom";
import { getUsuario } from "@/shared/api/authToken";
import { env } from "@/shared/config/env";

/**
 * Permite acesso apenas a usuários autenticados e vinculados ao CNPJ
 * da gráfica (configurado em `VITE_CNPJ_GRAFICA`). Usuários comuns
 * (cliente final) são redirecionados para `/portfolio`. Usuários não
 * logados vão para `/login`.
 */
export default function GraficaRoute({ children }) {
  const usuario = getUsuario();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  const cnpjUsuario = (usuario.cnpj ?? "").replace(/\D/g, "");

  if (cnpjUsuario !== env.cnpjGrafica) {
    return <Navigate to="/portfolio" replace />;
  }

  return children;
}
