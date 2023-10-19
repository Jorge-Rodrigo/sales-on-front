import { toast } from "react-toastify";

const notifyError = (msg: string) =>
  toast.error(msg, {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

const notifySucess = (msg: string) => {
  toast.success(msg, {
    position: "top-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};

export { notifyError, notifySucess };
