import { useState } from 'react';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import routes from '@/config/routes';
import styles from './RegisterForm.module.css';
import { Text } from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { DefaultToast } from '@/components/UI/ToastMessage';
import AuthService from '@/service/auth.service';

const cx = classNames.bind(styles);

function RegisterForm(props) {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        repeatPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.repeatPassword) {
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: 'error',
                    title: 'Lỗi form',
                    message: 'Mật khẩu không trùng khớp',
                },
            });

            return;
        }

        try {
            const res = await AuthService.register(formData);
            if (res.data) {
                toast(DefaultToast, {
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'infor',
                        title: 'Thông báo',
                        message: res.data.message,
                    },
                });
            }
        } catch (error) {
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: 'error',
                    title: 'Lỗi đăng ký',
                    message: error.response.data.message,
                },
            });
        }
    };
    return (
        <>
            <form
                className={cx('register-form', { hidden: props.hidden })}
                onSubmit={handleSubmit}>
                <h2 className={cx('title')}>Đăng Ký</h2>
                <div className={cx('row', 'no-gutters', 'form-group')}>
                    <div className={cx('form-control', 'c-12', 'l-5')}>
                        <label htmlFor='signUpUserName'>Họ và tên</label>
                        <Text
                            id='signUpUserName'
                            name='name'
                            placeholder='Nhập vào username'
                            type='text'
                            onChange={handleChange}
                            value={formData.name}
                        />
                    </div>
                    <div className={cx('form-control', 'c-12', 'l-5', 'l-o-2')}>
                        <label htmlFor='signUpEmail'>Email</label>
                        <Text
                            id='signUpEmail'
                            type='email'
                            name='email'
                            placeholder='Nhập vào email'
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>

                    <div className={cx('form-control', 'c-12', 'l-5')}>
                        <label htmlFor='signUpPassword'>Mật khẩu</label>
                        <Text
                            id='signUpPassword'
                            name='password'
                            placeholder='Nhập vào mật khẩu'
                            type='password'
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                    <div className={cx('form-control', 'c-12', 'l-5', 'l-o-2')}>
                        <label htmlFor='signUpRepeatPassword'>
                            Nhập lại mật khẩu
                        </label>
                        <Text
                            id='signUpRepeatPassword'
                            type='password'
                            name='repeatPassword'
                            placeholder='Nhập lại mật khẩu'
                            onChange={handleChange}
                            value={formData.repeatPassword}
                        />
                    </div>
                </div>
                <div className={cx('action')}>
                    <Button primary>Đăng ký</Button>
                </div>
                <div className={cx('other-action')}>
                    <div>
                        Đã có tài khoản?{' '}
                        <Button textPrimary to={routes.login}>
                            Đăng nhập
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

export default RegisterForm;
