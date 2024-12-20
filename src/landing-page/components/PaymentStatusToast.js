import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userAPI } from '../../service/user';

const PaymentStatusToast = () => {
    const location = useLocation();
    const [message, setMessage] = useState(''); // State để lưu thông báo hiển thị
    const hasProcessed = useRef(false); // Sử dụng useRef để kiểm tra trạng thái đã xử lý

    useEffect(() => {
        // Kiểm tra nếu pathname không phải là "/payment-status"
        if (location.pathname !== '/payment-status') {
            console.log('Not on /payment-status, skipping');
            return;
        }

        if (hasProcessed.current) {
            console.log('Already processed, skipping');
            return; // Nếu đã xử lý thì không thực hiện gì nữa
        }

        // Lấy các tham số từ URL
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        let orderCode = queryParams.get('orderCode');

        console.log('Status:', status, 'OrderCode:', orderCode);

        // Đảm bảo orderCode là một số
        orderCode = Number(orderCode);

        if (!orderCode || !status) {
            setMessage('Thông tin thanh toán không hợp lệ.');
            toast.error('Invalid order code or payment status.', { toastId: 'invalid-input' });
            return;
        }

        // Hàm xử lý trạng thái thanh toán
        const handlePaymentStatus = async () => {
            try {
                let success = false;

                // Kiểm tra trạng thái thanh toán
                if (status === 'PAID') {
                    success = true;
                } else if (status === 'CANCELLED') {
                    success = false;
                } else {
                    setMessage('Trạng thái thanh toán không xác định.');
                    toast.error('Unknown payment status.', { toastId: 'unknown-status' });
                    return;
                }

                // Gửi request đến API để cập nhật trạng thái thanh toán
                const response = await userAPI.updateSubscriptionStatus({ orderCode, success });
                console.log('API Response:', response);

                // Kiểm tra phản hồi từ API
                if (response.status === 200) {
                    if (success) {
                        setMessage('Bạn đã mua gói thành công.');
                        toast.success('Bạn đã mua gói thành công.', { toastId: 'payment-success' });
                    } else {
                        setMessage('Bạn đã hủy gói.');
                        toast.warn('Bạn đã hủy gói.', { toastId: 'payment-cancelled' });
                    }
                } else {
                    setMessage('Đã xảy ra lỗi khi cập nhật trạng thái gói.');
                    toast.error(`Error: ${response.message || 'Failed to update payment status.'}`, { toastId: 'update-error' });
                }
            } catch (error) {
                console.error('Error updating payment status:', error);
                setMessage('Có lỗi xảy ra khi xử lý thanh toán.');
                toast.error('There was an error processing your payment. Please try again.', { toastId: 'api-error' });
            } finally {
                hasProcessed.current = true; // Đánh dấu đã xử lý
            }
        };

        handlePaymentStatus();
    }, [location.pathname, location.search]); // Theo dõi sự thay đổi của pathname và query string

    return (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {/* Hiển thị thông báo ra màn hình */}
            {message && (
                <p
                    style={{
                        fontSize: '18px',
                        color: 'green',
                        fontWeight: 'bold',
                        marginTop: '20px',
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};

export default PaymentStatusToast;
