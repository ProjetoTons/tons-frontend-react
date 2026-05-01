import React, { useState, useRef, useEffect } from "react";

export default function SelectForm({
    label,
    name,
    value = [],
    onChange,
    options = [],
    placeholder = "Selecione as funções",
    disabled = false,
    required = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const labelClass = "block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider";
    const customInputClass = "w-full py-2 px-4 text-sm bg-[#EFEFEF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FFE300] transition-all";

    // Lógica para fechar o dropdown ao clicar fora dele
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Função que adiciona ou remove o item do array
    const handleToggleOption = (optionValue) => {
        let novosValores;
        if (value.includes(optionValue)) {
            novosValores = value.filter((v) => v !== optionValue); // Remove se já tem
        } else {
            novosValores = [...value, optionValue]; // Adiciona se não tem
        }

        // Simulamos o formato exato do evento (e.target) para que o seu 
        // handleChange lá no Model continue funcionando sem precisar alterar nada nele!
        onChange({ target: { name, value: novosValores } });
    };

    // Texto dinâmico para mostrar no botão quando fechado
    const getDisplayText = () => {
        if (!value || value.length === 0) return <span className="text-gray-400">{placeholder}</span>;
        
        if (value.length === 1) {
            const selectedOption = options.find(opt => opt.value === value[0]);
            return selectedOption ? selectedOption.label : placeholder;
        }

        if (value.length <= 2) {
            return options
                .filter(opt => value.includes(opt.value))
                .map(opt => opt.label)
                .join(", ");
        }

        return `${value.length} funções selecionadas`;
    };

    return (
        <div className="w-full relative" ref={dropdownRef}>
            {label && <label className={labelClass}>{label}</label>}
            
            {/* "Select" Falso (Botão que abre o dropdown) */}
            <div 
                className={`${customInputClass} flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isOpen ? 'ring-1 ring-[#FFE300]' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="truncate pr-4">
                    {getDisplayText()}
                </div>
                
                {/* Ícone customizado da setinha */}
                <div className="text-gray-500 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Caixa do Dropdown */}
            {isOpen && !disabled && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 shadow-lg z-50 max-h-48 overflow-y-auto">
                    {options.map((opt) => (
                        <label 
                            key={opt.value} 
                            className="flex items-center px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                        >
                            <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    checked={value.includes(opt.value)}
                                    onChange={() => handleToggleOption(opt.value)}
                                    className="w-4 h-4 text-[#FFE300] bg-gray-100 border-gray-300 rounded focus:ring-[#FFE300] focus:ring-2"
                                />
                            </div>
                            <div className="ml-3 text-sm text-gray-700">
                                {opt.label}
                            </div>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}