import React from 'react';

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  options = []
}) => {
  const baseClasses = "w-full rounded-lg border border-slate-800 bg-mystic-900/40 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-cosmic-500 focus:bg-mystic-900/80 focus:shadow-glow-sm";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {label} {required && <span className="text-gem-ruby">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
        >
          {placeholder && <option value="" className="bg-mystic-950">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-mystic-950">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={baseClasses}
        />
      )}

      {error && <span className="text-xs text-gem-ruby font-medium">{error}</span>}
    </div>
  );
};

export default InputField;
