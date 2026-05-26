import Swal from 'sweetalert2';

const baseConfig = {
    buttonsStyling: false,
    customClass: {
        popup: 'rounded-2xl shadow-lg p-6',
        confirmButton: 'bg-[#FDF10E] hover:bg-[#FDF10E] text-white font-bold py-2 px-4 rounded',
        cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded',
    },
};

export const useSweetAlert = () => {
    const success = (title, message = '', timer = 2000) => {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            timer: timer,
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    const error = (title, message = '') => {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: 'OK',
        });
    };

    const warning = (title, message = '') => {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: message,
            confirmButtonText: 'OK',
        });
    };

    const info = (title, message = '') => {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: message,
            confirmButtonText: 'OK',
        });
    };

    const confirm = (title, message = '', confirmText = 'Confirmar', cancelText = 'Cancelar') => {
        return Swal.fire({
            ...baseConfig,
            icon: 'question',
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText,
        });
    };

    const custom = (options) => {
        return Swal.fire(options);
    };

    return {
        success,
        error,
        warning,
        info,
        confirm,
        custom,
    };
};
