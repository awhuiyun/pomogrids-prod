export interface IBaseButton {
  type: "button" | "submit";
  label: string;
  className?: string;
}

export default function BaseButton({ type, label, className }: IBaseButton) {
  return (
    <button className={`rounded ${className ?? ""}`} type={type}>
      {label}
    </button>
  );
}
