import { ReactNode } from 'react';

import toast, { ToastPosition } from 'react-hot-toast';

import Alert from '../../components/Alert/Alert';

export interface CustomToastOptions {
  id?: string;
  isDismissible?: boolean;
  position?: ToastPosition;
  duration?: number;
}

const DEFAULT_POSITION = 'top-right';
const DEFAULT_DURATION = 5000;

export default function useToast() {
  const toasts = {
    success: (message: string | ReactNode, options?: CustomToastOptions) =>
      toast.custom(
        (t) => (
          <Alert
            type="success"
            isToast={true}
            isDismissible={options?.isDismissible}
            autoClose={!options?.isDismissible}
            autoCloseDelay={options?.duration ?? DEFAULT_DURATION}
            onClose={() => toast.dismiss(t.id)}
            className="mb-12"
          >
            {message}
          </Alert>
        ),
        {
          id: options?.id,
          duration: Infinity,
          position: options?.position ?? DEFAULT_POSITION,
        },
      ),
    error: (message: string | ReactNode, options?: CustomToastOptions) =>
      toast.custom(
        (t) => (
          <Alert
            type="danger"
            isToast={true}
            isDismissible={options?.isDismissible}
            autoClose={!options?.isDismissible}
            autoCloseDelay={options?.duration ?? DEFAULT_DURATION}
            onClose={() => toast.dismiss(t.id)}
            className="mb-12"
          >
            {message}
          </Alert>
        ),
        {
          id: options?.id,
          duration: Infinity,
          position: options?.position ?? DEFAULT_POSITION,
        },
      ),
    info: (message: string | ReactNode, options?: CustomToastOptions) =>
      toast.custom(
        (t) => (
          <Alert
            type="info"
            isToast={true}
            isDismissible={options?.isDismissible}
            autoClose={!options?.isDismissible}
            autoCloseDelay={options?.duration ?? DEFAULT_DURATION}
            onClose={() => toast.dismiss(t.id)}
            className="mb-12"
          >
            {message}
          </Alert>
        ),
        {
          id: options?.id,
          duration: Infinity,
          position: options?.position ?? DEFAULT_POSITION,
        },
      ),
    warning: (message: string | ReactNode, options?: CustomToastOptions) =>
      toast.custom(
        (t) => (
          <Alert
            type="warning"
            isToast={true}
            isDismissible={options?.isDismissible}
            autoClose={!options?.isDismissible}
            autoCloseDelay={options?.duration ?? DEFAULT_DURATION}
            onClose={() => toast.dismiss(t.id)}
            className="mb-12"
          >
            {message}
          </Alert>
        ),
        {
          id: options?.id,
          duration: Infinity,
          position: options?.position ?? DEFAULT_POSITION,
        },
      ),
    loading: toast.loading,
    dismiss: (id: string) => toast.dismiss(id),
    remove: (id: string) => toast.remove(id),
  };

  return toasts;
}
