import classNames from 'classnames/bind';

import styles from './EditInfor.module.css';
import { Text } from '@/components/UI/Input';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Button from '@/components/UI/Button';

import AuthService from '@/service/auth.service';
import { toast, ToastContainer } from 'react-toastify';
import { DefaultToast } from '@/components/UI/ToastMessage';
import { loginUser } from '@/core/action/auth';

const cx = classNames.bind(styles);

function EditInfor() {
    const user = useSelector((state) => state.auth.currentUser);
    const isRemember = useSelector((state) => state.auth.isRemember);
    const dispatch = useDispatch();
    const [formInfor, setFormInfor] = useState({ name: user?.name });
    const [formChangePassword, setFormChangePassword] = useState({
        oldPassword: '',
        newPassword: '',
        repeatNewPassword: '',
    });

    const handleChangeInfor = (e) => {
        const { name, value } = e.target;
        setFormInfor({
            ...formInfor,
            [name]: value,
        });
    };

    const handleChangePassword = (e) => {
        const { name, value } = e.target;
        setFormChangePassword({
            ...formChangePassword,
            [name]: value,
        });
    };

    const onSubmitChangeInfor = async () => {
        await AuthService.updateInfor(formInfor)
            .then((res) => {
                if (res.type === 'success') {
                    toast(DefaultToast, {
                        containerId: 'changeInfor',
                        style: { width: '400px' },
                        hideProgressBar: true,
                        data: {
                            type: res.type,
                            title: 'Thành công',
                            message: res.message,
                        },
                    });
                    // Đồng bộ thông tin trong store
                    dispatch(
                        loginUser({
                            user: {
                                ...user,
                                name: formInfor.name,
                            },
                            isRemember,
                        })
                    );
                }
            })
            .catch((err) => {
                console.log(err);

                toast(DefaultToast, {
                    containerId: 'changeInfor',
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'error',
                        title: 'Thất bại',
                        message: err.response.data.message,
                    },
                });
            });
    };

    const onSubmitChangePassword = async () => {
        if (
            formChangePassword?.newPassword !==
            formChangePassword.repeatNewPassword
        ) {
            toast(DefaultToast, {
                containerId: 'changeInfor',
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: 'error',
                    title: 'Lỗi form',
                    message: 'Nhập lại mật khẩu không đúng',
                },
            });

            return;
        }
        await AuthService.changePassword(formChangePassword)
            .then((res) => {
                if (res.type === 'success') {
                    toast(DefaultToast, {
                        containerId: 'changeInfor',
                        style: { width: '400px' },
                        hideProgressBar: true,
                        data: {
                            type: res.type,
                            title: 'Thành công',
                            message: res.message,
                        },
                    });
                }
            })
            .catch((err) => {
                console.log(err);

                toast(DefaultToast, {
                    containerId: 'changeInfor',
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'error',
                        title: 'Thất bại',
                        message: err.response.data.message,
                    },
                });
            });
        setFormChangePassword({
            oldPassword: '',
            newPassword: '',
            repeatNewPassword: '',
        });
    };

    return (
        <div className={cx('wrapper')}>
            <h4>Cập nhật thông tin:</h4>
            <div className={cx('edit-infor', 'row', 'no-gutters')}>
                <div className={cx('form-control', 'c-12', 'l-6', 'col')}>
                    <label>Họ và tên:</label>
                    <Text
                        type={'text'}
                        name='name'
                        value={formInfor?.name}
                        onChange={handleChangeInfor}
                    />
                </div>
                <div className={cx('l-6')}></div>
                <Button success onClick={onSubmitChangeInfor}>
                    Lưu
                </Button>
            </div>
            <h4>Đổi mật khẩu:</h4>
            <div className={cx('change-password')}>
                <div className={cx('form-control', 'c-12', 'l-6', 'col')}>
                    <label>mật khẩu cũ:</label>
                    <Text
                        type={'password'}
                        name='oldPassword'
                        value={formChangePassword?.oldPassword}
                        onChange={handleChangePassword}
                    />
                </div>
                <div className={cx('form-control', 'c-12', 'l-6', 'col')}>
                    <label>Mật khẩu mới:</label>
                    <Text
                        type={'password'}
                        name='newPassword'
                        value={formChangePassword?.newPassword}
                        onChange={handleChangePassword}
                    />
                </div>
                <div className={cx('form-control', 'c-12', 'l-6', 'col')}>
                    <label>Nhập lại mật khẩu mới:</label>
                    <Text
                        type={'password'}
                        name='repeatNewPassword'
                        value={formChangePassword?.repeatNewPassword}
                        onChange={handleChangePassword}
                    />
                </div>
                <Button success onClick={onSubmitChangePassword}>
                    Lưu
                </Button>
            </div>
            <ToastContainer theme='dark' containerId={'changeInfor'} />
        </div>
    );
}

export default EditInfor;
