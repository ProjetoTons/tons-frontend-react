export default function InputForm({ label, type = "text", placeholder, name, disabled, value, onChange }) {
  const inputId = `input-${name}`;

  return (
    <div className={`w-full ${disabled ? 'opacity-40' : 'opacity-100'}`}>
      <label htmlFor={inputId} className="block text-[10px] text-gray-500 uppercase font-semibold mb-1 tracking-wider">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        value={value}
        className="w-full bg-[#EFEFEF] text-gray-800 text-sm py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#FFE300] disabled:cursor-not-allowed"
      />
    </div>
  );
}