import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { useDispatch as useDispatchThunk } from 'react-redux';

import styles from './LoginForm.module.css';
import { CheckBox, Text } from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import routes from '@/config/routes';
import AuthService from '@/service/auth.service';
import { loginUser, rememberUser } from '@/core/action/auth';
import { DefaultToast } from '@/components/UI/ToastMessage';
import { fetchData } from '@/core/action/watchedMovie';

const cx = classNames.bind(styles);

function LoginForm(props) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        isRemember: false,
    });
    const location = useLocation();
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const dispatchThunk = useDispatchThunk();
    const from = useMemo(() => location.state?.from || '/', [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleIsRemember = () => {
        setFormData({ ...formData, isRemember: !formData.isRemember });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await AuthService.login(formData);
            dispatch(
                loginUser({
                    user: res.data.user,
                    isRemember: formData.isRemember,
                })
            );
            if (formData.isRemember) {
                dispatch(rememberUser());
            }
            dispatchThunk(fetchData());

            console.log(from);

            navigator(from);
        } catch (error) {
            console.log(error);
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: 'error',
                    title: 'Lỗi đăng nhập',
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng',
                },
            });
        }
    };

    return (
        <>
            <form
                className={cx('login-form', { hidden: props.hidden })}
                onSubmit={handleSubmit}>
                <h2 className={cx('title')}>Đăng nhập</h2>
                <Text
                    placeholder='Nhập vào email'
                    type='email'
                    name='email'
                    onChange={handleChange}
                    value={formData.email}
                />
                <Text
                    type='password'
                    name='password'
                    placeholder='Nhập vào mật khẩu'
                    onChange={handleChange}
                    value={formData.password}
                />
                {/* <input onChange={} /> */}
                <div className={cx('action')}>
                    <Button primary>Đăng nhập</Button>
                    <CheckBox
                        title='Nhớ mật khẩu'
                        name='isRemember'
                        onChange={handleIsRemember}
                        value={!!formData.isRemember}
                        checked={!!formData.isRemember}
                    />
                </div>
                <div className={cx('other-action')}>
                    <div>
                        Bạn không có tài khoản?{' '}
                        <Button textPrimary to={routes.register}>
                            Đăng ký
                        </Button>
                    </div>
                    <Button textPrimary>Quên mật khẩu?</Button>
                </div>
            </form>
        </>
    );
}

export default LoginForm;
