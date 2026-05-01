import React from "react";

export default function EtapaVisual({ NomeEstapa, faseInicial, faseFinal }) {

    const etapaSegura = Math.min(faseInicial, faseFinal);

    const progressoPorcentagem = faseFinal > 0 ? (etapaSegura / faseFinal) * 100 : 0;

    return (
        <>
            <div className="flex justify-between items-end mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <span>{NomeEstapa}</span>
                {/* 3. Mostramos a etapaSegura na tela para o texto não ficar bugado */}
                <span className="text-black">Etapa {etapaSegura} de {faseFinal}</span>
            </div>

            <div className="w-full h-1 bg-gray-200 mb-5 overflow-hidden">
                <div
                    className="h-full bg-[#FFE300] transition-all duration-500 ease-in-out"
                    style={{ width: `${progressoPorcentagem}%` }}
                >
                </div>
            </div>
        </>
    );
}