import { createContext, useContext, useState, ReactNode } from "react";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "default";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolve, setResolve] = useState<(value: boolean) => void>(() => () => {});
  const [isOpen, setIsOpen] = useState(false);

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((res) => {
      setResolve(() => res);
    });
  };

  const handleConfirm = () => {
    resolve(true);
    setIsOpen(false);
    setOptions(null);
  };

  const handleCancel = () => {
    resolve(false);
    setIsOpen(false);
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 max-w-sm shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-2">{options.title}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {typeof options.description === "string"
                ? options.description
                : JSON.stringify(options.description)}
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded">
                {options.cancelText || "Cancelar"}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded text-white ${
                  options.variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-black"
                }`}
              >
                {options.confirmText || "Aceptar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used within a ConfirmProvider");
  return context.confirm;
};