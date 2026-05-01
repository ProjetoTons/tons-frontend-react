import React from "react";

export default function FileInputForm({
    label,
    name,
    onChange,
    fileName,
    placeholder = "Upload Imagem",
    accept = "image/*",
    disabled = false
}) {
    const labelClass = "block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider";
    const customInputClass = "w-full py-2 px-4 text-sm bg-[#EFEFEF] text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#FFE300] transition-all";

    return (
        <div className="w-full">
            {label && <label className={labelClass}>{label}</label>}
            
            <div className={`${customInputClass} !py-0 h-[36px] border border-dashed border-gray-300 hover:bg-[#EAEAEA] cursor-pointer flex items-center justify-center group overflow-hidden relative ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                    type="file"
                    name={name}
                    onChange={onChange}
                    accept={accept}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                
                <div className="flex items-center gap-2 text-gray-500 group-hover:text-black transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[120px]">
                        {fileName || placeholder}
                    </span>
                </div>
            </div>
        </div>
    );
}