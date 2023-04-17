import { ReactNode } from "react";

interface ITaskMenuItem {
  className?: string;
  children: ReactNode;
}

export default function TaskMenuItem({ className, children }: ITaskMenuItem) {
  return (
    <div
      className={`p-1 hover:bg-slate-100 cursor-pointer text-xs ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
}
