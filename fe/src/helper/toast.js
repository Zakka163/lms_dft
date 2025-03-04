import { toast } from "react-toastify";
export const successNotify = (msg, callback = () => {}) => {
    toast.success(msg, {
        position: "top-right",
        autoClose: 3000,
        onClose: callback,
    });
};

export const errorNotify = (msg, callback = () => {}) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        onClose: callback,
    });
};
