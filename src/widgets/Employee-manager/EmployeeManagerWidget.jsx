import { useState, useEffect, useMemo, useCallback } from "react";
import EmployeeTable from "@/entities/employee/ui/EmployeeTable";
import { employeeApi } from "@/entities/employee/api/employeeApi";
import { Link, useNavigate } from "react-router-dom";

export default function EmployeeManagerWidget() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const recarregar = useCallback(() => {
    setCarregando(true);
    setErro("");
    employeeApi
      .listar()
      .then((lista) => setFuncionarios(Array.isArray(lista) ? lista : []))
      .catch(() => setErro("Falha ao carregar funcionários."))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const funcionariosFiltrados = useMemo(() => {
    if (!searchTerm) return funcionarios;
    const t = searchTerm.toLowerCase();
    return funcionarios.filter(
      (f) =>
        f.nome?.toLowerCase().includes(t) ||
        String(f.id).includes(t) ||
        f.acessos?.some((a) => a.role?.toLowerCase().includes(t))
    );
  }, [funcionarios, searchTerm]);

  const handleEditar = (idDoFuncionario) => {
    navigate(`/funcionario/editar/${idDoFuncionario}`);
  };

  const handleDeletar = async (idDoFuncionario) => {
    if (!window.confirm("Tem certeza que deseja excluir?")) return;
    try {
      await employeeApi.remover(idDoFuncionario);
      recarregar();
    } catch {
      alert("Falha ao excluir funcionário.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER CUSTOMIZADO DO WIDGET */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Quadro de Funcionários
          </h1>
          <p className="text-sm text-gray-500 max-w-lg whitespace-nowrap">
            Gerencie o dados, acessos e perfis técnicos da sua equipe <span className="text-gray-900 font-semibold ">Tons Personalizados</span>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Campo de Busca */}
          <div className="relative w-full sm:w-64">
            <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar funcionário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#EAEAEA] text-sm py-2.5 pl-9 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFE300] transition-all"
            />
          </div>

          {/* Botão Adicionar */}
          <Link
            className="bg-[#FFE300] text-black font-bold py-2.5 px-6 text-[11px] uppercase tracking-wider shadow-[3px_3px_0px_#ccc] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[1px_1px_0px_#ccc] active:translate-y-[3px] active:translate-x-[3px] active:shadow-none transition-all flex items-center justify-center gap-2"
            to={"/funcionario/cadastro"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Adicionar Novo Funcionário
          </Link>
        </div>
      </div>

      {/* ESTADOS */}
      {erro && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-semibold uppercase tracking-wider">
          {erro}
        </div>
      )}

      {carregando ? (
        <div className="w-full bg-white shadow-sm p-10 text-center text-sm text-gray-500">
          Carregando funcionários...
        </div>
      ) : funcionariosFiltrados.length === 0 ? (
        <div className="w-full bg-white shadow-sm p-10 text-center text-sm text-gray-500">
          Nenhum funcionário encontrado.
        </div>
      ) : (
        <EmployeeTable
          funcionarios={funcionariosFiltrados}
          onEdit={handleEditar}
          onDelete={handleDeletar}
        />
      )}
    </div>
  );
}
