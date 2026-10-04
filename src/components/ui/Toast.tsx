import { Check } from 'lucide-react';

interface ToastProps {
  message?: string;
}

export function Toast({ message }: ToastProps) {
  return message ? (
    <div className="toast" role="status">
      <Check size={16} />
      {message}
    </div>
  ) : null;
}
