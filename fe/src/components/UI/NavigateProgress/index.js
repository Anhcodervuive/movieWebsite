import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { NProgress } from 'nprogress-v2';
import 'nprogress/nprogress.css';
import './progress.css';

const NavigateProgress = () => {
    const location = useLocation();
    const navigationType = useNavigationType();

    NProgress.configure({ showSpinner: false });

    useEffect(() => {
        // Giả sử bạn có kết nối WebSocket
        const ws = new WebSocket('ws://localhost:3000/ws');

        ws.onopen = () => {
            // Kết nối WebSocket đã mở, kết thúc tiến trình nprogress
            NProgress.done();
        };

        ws.onerror = () => {
            // Xử lý lỗi WebSocket
            NProgress.done();
        };

        ws.onclose = () => {
            // Kết nối WebSocket đã đóng
            NProgress.done();
        };

        if (navigationType !== 'POP') {
            // Bắt đầu chỉ khi không phải là chuyển hướng POP
            NProgress.start();
        }
        return () => {
            NProgress.done();
        };
    }, [location, navigationType]);

    return null;
};

export default NavigateProgress;
