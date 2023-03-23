export interface IBaseInput {
  label: string;
  placeholder?: string;
  type: "number" | "text";
  id: string;
  value: string | number;
  className?: string;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  required: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

export default function BaseInput({
  label,
  placeholder,
  type,
  id,
  value,
  className,
  onChange,
  required,
  disabled,
  min,
  max,
  step,
}: IBaseInput) {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        id={id}
        value={value}
        className={`focus:outline-0 border rounded border-slate-900 px-2 py-1 ${className}`}
        onChange={onChange}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
