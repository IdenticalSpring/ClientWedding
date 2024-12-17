// src/components/PaymentStatusToast.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentStatusToast = () => {
    const location = useLocation();

    useEffect(() => {
        // Lấy các tham số từ URL
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');  // "PAID" hoặc "CANCELLED"
        const orderCode = queryParams.get('orderCode'); // "677591"

        console.log(status, orderCode); // Kiểm tra các tham số từ URL

        if (status === 'PAID' && orderCode) {
            // Thanh toán thành công
            toast.success('Payment successful! Your subscription has been updated.');
        } else if (status === 'CANCELLED' && orderCode) {
            // Thanh toán bị hủy
            toast.error('Payment was cancelled. Please try again.');
        } 
    }, [location]);

    return null; // Không cần render gì cả, chỉ cần hiển thị toast
};

export default PaymentStatusToast;
