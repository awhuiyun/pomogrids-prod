import { useState, ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";

export interface IBaseAccordian {
  isOpenOnMount: boolean;
  label: string;
  children: ReactNode;
}

export default function BaseAccordian({
  isOpenOnMount,
  label,
  children,
}: IBaseAccordian) {
  const [isOpen, setIsOpen] = useState(isOpenOnMount);

  // Function to toggle accordian
  function toggleAccordian() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="w-full border border-slate-400 rounded">
      <button
        className={`font-bold text-lg bg-slate-50 hover:bg-slate-100 w-full p-6 text-left rounded-t ${
          !isOpen && "rounded-b"
        } ${isOpen && "border-b border-slate-400"}`}
        onClick={toggleAccordian}
      >
        {isOpen ? (
          <FontAwesomeIcon icon={faSortUp} className="mr-4 w-fit my-auto" />
        ) : (
          <FontAwesomeIcon icon={faSortDown} className="mr-4 w-fit my-auto" />
        )}
        {label}
      </button>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  );
}
