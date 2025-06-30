import { useToast } from "vue-toastification";

const toast = useToast();

export function showSuccessToast(message) {
  toast.success(message, {
    timeout: 3000,
    position: "top-center",
    icon: false,
    hideProgressBar: true,
    closeButton: false,
  });
}

export function showErrorToast(message) {
  toast.error(message, {
    timeout: 3000,
    position: "top-center",
    icon: false,
    hideProgressBar: true,
    closeButton: false,
  });
}

export function showNotificationToast(message) {
  toast.info(message, {
    timeout: 3000,
    position: "top-right",
    icon: false,
    hideProgressBar: true,
    closeButton: false,
  });
}
