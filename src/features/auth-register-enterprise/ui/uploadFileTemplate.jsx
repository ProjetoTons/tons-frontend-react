

{/* ÁREA DE UPLOAD DE LOGO - Acho que não vou usar no projeto*/ }
<div className="flex items-center gap-6 mb-10" disabled={!cnpjValido}>
    {/* Box Cinza de Upload */}
    <div className="w-24 h-24 bg-[#EFEFEF] flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-200 transition-colors">
        <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
        </svg>
        <span className="text-[10px] font-bold text-gray-500 uppercase">Logo</span>
        {/* Botão flutuante amarelo (+) */}
        <div className="absolute -bottom-2 -right-2 bg-[#FFE300] w-6 h-6 flex items-center justify-center text-black font-bold text-lg shadow-sm">
            +
        </div>
    </div>

    {/* Textos explicativos do Upload */}
    <div>
        <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-1">
            Upload Company Logo
        </h3>
        <p className="text-[10px] text-gray-500 max-w-[220px] leading-relaxed">
            Formatos suportados: PNG, SVG ou JPG. Recomendado: 400x400px com fundo transparente.
        </p>
    </div>
</div>