import { aplicarMascaraData } from "@/shared/lib/masked";
import React from "react";

export default function EmployeeTable({ funcionarios, onEdit, onDelete }) {
  return (
    <div className="w-full bg-white shadow-sm overflow-hidden">
      {/* CABEÇALHO PRETO */}
      <div className="bg-[#1A1A1A] text-white flex px-6 py-4 text-[10px] font-bold uppercase tracking-wider">
        <div className="w-[25%]">Usuário</div>
        <div className="w-[25%]">E-mail</div>
        <div className="w-[15%]">Telefone</div>
        <div className="w-[15%]">Cargo</div>
        <div className="w-[15%]">Data Nascimento</div>
        <div className="w-[5%] text-center">Ações</div>
      </div>

      {/* LINHAS DA TABELA */}
      <div className="flex flex-col">
        {funcionarios.map((func, index) => (
          <div
            key={func.id}
            className={`flex items-center px-6 py-4 text-sm text-gray-700 ${index !== funcionarios.length - 1 ? "border-b border-gray-100" : ""
              } hover:bg-gray-50 transition-colors`}
          >
            {/* Usuário (Avatar + Nome + ID) */}
            <div className="w-[25%] flex items-center gap-3">
              <img
                src={func.avatar}
                alt={func.nome}
                className="w-10 h-10 object-cover border border-gray-200 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-bold text-gray-900">{func.nome}</span>
                <span className="text-[11px] text-gray-400 font-medium tracking-wide">ID: {func.id}</span>
              </div>
            </div>

            {/* E-mail */}
            <div className="w-[25%] text-gray-500">{func.email}</div>

            {/* Telefone */}
            <div className="w-[15%] text-gray-500">{func.telefone}</div>


            {/* Cargo (Badges) */}
            <div className="w-[15%] flex flex-wrap gap-1">
              {func.cargo.map((c) => (
                <span
                  key={c.Id}
                  className="bg-[#EFEFEF] text-gray-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm whitespace-nowrap"
                >
                  {c.Cargo}
                </span>
              ))}
            </div>

            {/* Data Nascimento */}
            <div className="w-[15%] text-gray-500">{aplicarMascaraData(func.dataNascimento)}</div>

            {/* Ações (Editar / Excluir) */}
            <div className="w-[5%] flex justify-center gap-3 text-gray-500">
              <button onClick={() => onEdit(func.id)} className="hover:text-black transition-colors cursor-pointer" title="Editar">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>

              <button onClick={() => onDelete(func.id)} className=" text-red-500 hover:text-red-800 transition-colors cursor-pointer" title="Excluir">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
}