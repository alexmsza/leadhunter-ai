import React from 'react';
import { useToast } from '../hooks/use-toast';

const Toast = ({ id, title, description, variant, onOpenChange }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 min-w-80 ${getVariantStyles()}`}>
      <div className="flex justify-between items-start">
        <div>
          {title && <div className="font-semibold mb-1">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="ml-4 text-white hover:text-gray-300"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </>
  );
}