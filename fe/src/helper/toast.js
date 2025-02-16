import { toast } from "react-toastify";
export const successNotify = (msg) => {
    toast.success(msg, {
        position: "top-right",
        autoClose: 3000, 
    });
};

export const errorNotify = (msg) => {
    toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
    });
};