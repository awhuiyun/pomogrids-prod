export interface IOptions {
  label: string;
  value: string | number;
}

export interface IBaseDropdown {
  label: string;
  id: string;
  value: string | number;
  className: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required: boolean;
  disabled: boolean;
  options: IOptions[];
}

export default function BaseDropdown({
  label,
  id,
  value,
  className,
  onChange,
  required,
  disabled,
  options,
}: IBaseDropdown) {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">{label}</label>
      <select
        id={id}
        value={value}
        className={`focus:outline-0 border rounded border-slate-900 px-2 py-1 ${className}`}
        onChange={onChange}
        required={required}
        disabled={disabled}
      >
        {options.map((option) => {
          return (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
