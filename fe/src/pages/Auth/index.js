import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Auth.module.css';
import Image from '@/assets/Images';
import routes from '@/config/routes';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { DefaultToast } from '@/components/UI/ToastMessage';

const cx = classNames.bind(styles);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Login() {
    const location = useLocation();
    const query = useQuery();
    const message = query.get('message');
    const type = query.get('type');

    useEffect(() => {
        if (message) {
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: type,
                    title: 'Thành công',
                    message: message,
                },
            });
        }
    }, [message, type]);
    return (
        <div
            className={cx('wrapper')}
            style={{
                backgroundImage: `url(${Image.loginBackground})`,
            }}>
            <LoginForm hidden={location.pathname !== routes.login} />
            <RegisterForm hidden={location.pathname !== routes.register} />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default Login;
