import { useEffect } from "react";
import { IToastItem } from "@/types/toasts.types";
import useToastStore from "@/stores/toast";

export default function ToastItem({
  uniqueId,
  className,
  content,
}: IToastItem) {
  // Global state
  const { deleteToast } = useToastStore();

  // Unmount in 3 seconds
  useEffect(() => {
    const unmountToast = setTimeout(() => {
      deleteToast(uniqueId);
    }, 3000);

    return () => {
      clearTimeout(unmountToast);
    };
  }, []);

  return (
    <div
      className={`py-1 px-2 transition ease-in-out duration-300 ${
        className ?? ""
      }`}
    >
      {content}
    </div>
  );
}
