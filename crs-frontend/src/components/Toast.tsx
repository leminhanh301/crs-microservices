export type ToastType = 'success' | 'error';

export interface ToastMessage {
  message: string;
  type: ToastType;
}

interface ToastProps extends ToastMessage {
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        padding: 12,
        color: 'white',
        backgroundColor: type === 'success' ? 'green' : 'red',
        zIndex: 1000,
      }}
    >
      <span style={{ marginRight: 12 }}>{message}</span>
      <button type="button" onClick={onClose} aria-label="Đóng thông báo">
        ×
      </button>
    </div>
  );
};
