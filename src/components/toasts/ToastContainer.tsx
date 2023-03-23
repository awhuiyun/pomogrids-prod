import ToastItem from "./ToastItem";
import useToastStore from "@/stores/toast";

export default function ToastContainer() {
  // Global states: useToastStore
  const { toasts } = useToastStore();

  return (
    <div className="h-fit w-fit mx-auto text-center space-y-4 inset-0 fixed z-50 top-8">
      {toasts.map((toast) => {
        return <ToastItem key={toast.uniqueId} {...toast} />;
      })}
    </div>
  );
}
