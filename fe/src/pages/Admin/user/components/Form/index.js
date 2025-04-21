import classNames from 'classnames/bind';

import styles from './UserForm.module.css';
import { useCallback, useMemo, useState } from 'react';
import { Text } from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { toast } from 'react-toastify';
import { DefaultToast } from '@/components/UI/ToastMessage';

const cx = classNames.bind(styles);

function Form({ data, roles = [], wachingMoviePackages = [], onSubmit }) {
    const [formErrorMessage, setFormErrorMessage] = useState({});
    const [formData, setFormData] = useState(
        data
            ? {
                  name: data.name,
                  email: data.email,
                  password: '',
                  repeatPassword: '',
                  roleIds: data.Roles.map((item) => item.id),
                  wachingMoviePackageIds: data.waching_movie_packages.map(
                      (item) => item.id
                  ),
              }
            : {
                  name: '',
                  email: '',
                  password: '',
                  repeatPassword: '',
                  roleIds: [],
                  wachingMoviePackageIds: [],
              }
    );

    const validateRules = useMemo(() => {
        if (data) {
            return {
                name: ['required'],
                email: ['required'],
            };
        } else {
            return {
                name: ['required'],
                email: ['required'],
                password: ['required'],
                repeatPassword: ['required'],
            };
        }
    }, [data]);

    const handleValidate = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';
        switch (true) {
            case validateRules[name]?.includes('required'):
                value === ''
                    ? (errorMessage = 'Trường này bắt buộc')
                    : (errorMessage = '');
                break;
            default:
        }
        if (errorMessage) {
            setFormErrorMessage({
                ...formErrorMessage,
                [name]: errorMessage,
            });
        } else if (formErrorMessage && !errorMessage) {
            setFormErrorMessage((prev) => {
                delete prev[name];
                return prev;
            });
        }
        return errorMessage;
    };

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;

        if (type === 'checkbox') {
            let newArr = formData[name];

            if (checked) {
                newArr.push(parseInt(value));
            } else {
                newArr = newArr.filter((id) => id !== parseInt(value));
            }
            setFormData({
                ...formData,
                [name]: newArr,
            });
        } else if (type === 'radio') {
            if (checked) {
                setFormData({
                    ...formData,
                    [name]: [parseInt(value)],
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: [],
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const onSubmitForm = useCallback(
        async (e) => {
            e.preventDefault();

            // Validate before submit
            for (let i = 0; i < Object.keys(formData).length; i++) {
                let key = Object.keys(formData)[i];
                let errorMessage = handleValidate({
                    target: { name: key, value: formData[key] },
                });
                if (errorMessage) {
                    toast(DefaultToast, {
                        style: { width: '400px' },
                        hideProgressBar: true,
                        data: {
                            type: 'error',
                            title: 'Lỗi',
                            message:
                                'Vui lòng nhập thông tin theo yêu cầu từng trường',
                        },
                    });
                    return;
                }
            }

            if (
                formData.password &&
                formData.repeatPassword &&
                formData.password !== formData.repeatPassword
            ) {
                toast(DefaultToast, {
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'error',
                        title: 'Lỗi',
                        message: 'Mật khẩu không khớp',
                    },
                });
                return;
            }
            await onSubmit(formData);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [formData, formErrorMessage, onSubmit]
    );

    return (
        <form
            className={cx('wrapper', 'row', 'no-gutters')}
            onSubmit={onSubmitForm}>
            <div
                className={cx('form-control', 'c-4', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='name'>name:</label>
                <Text
                    id='name'
                    name='name'
                    placeholder='Nhập vào tên user'
                    value={formData.name}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidate(e);
                    }}
                />
                {formErrorMessage.name && (
                    <span className={cx('error-message')}>
                        {formErrorMessage.name}
                    </span>
                )}
            </div>
            <div
                className={cx('form-control', 'c-4', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='email'>email:</label>
                <Text
                    id='email'
                    name='email'
                    placeholder='Nhập vào tên user'
                    value={formData.email}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidate(e);
                    }}
                />
                {formErrorMessage.email && (
                    <span className={cx('error-message')}>
                        {formErrorMessage.email}
                    </span>
                )}
            </div>
            <div className='c-o-3'></div>
            <div
                className={cx('form-control', 'c-4', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='password'>mật khẩu:</label>
                <Text
                    id='password'
                    name='password'
                    type={'password'}
                    value={formData.password}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidate(e);
                    }}
                />
                {formErrorMessage.password && (
                    <span className={cx('error-message')}>
                        {formErrorMessage.password}
                    </span>
                )}
            </div>
            <div
                className={cx('form-control', 'c-4', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='repeatPassword'>nhập lại mật khẩu:</label>
                <Text
                    id='repeatPassword'
                    name='repeatPassword'
                    type={'password'}
                    value={formData.repeatPassword}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidate(e);
                    }}
                />
                {formErrorMessage.repeatPassword && (
                    <span className={cx('error-message')}>
                        {formErrorMessage.repeatPassword}
                    </span>
                )}
            </div>
            <div className={cx('c-12', 'col')}>
                <h3 style={{ marginBottom: '10px' }}>Vai trò: *</h3>
                <div className='row no-gutters'>
                    {roles?.map((item) => (
                        <div
                            key={item.id}
                            className={cx('c-3', 'checkbox-wrapper')}>
                            <input
                                type='checkbox'
                                name='roleIds'
                                id={item.id}
                                value={item.id}
                                checked={formData?.roleIds.includes(item.id)}
                                onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor={item.id}>{item.name}</label>
                        </div>
                    ))}
                </div>
            </div>
            <div className={cx('c-12', 'col')}>
                <h3 style={{ marginBottom: '10px' }}>
                    Gói xem phim đang sử dụng:
                </h3>
                <div className='row no-gutters'>
                    {wachingMoviePackages?.map((item) => (
                        <div
                            key={item.id}
                            className={cx('c-3', 'checkbox-wrapper')}>
                            <input
                                type='radio'
                                name='wachingMoviePackageIds'
                                id={item.id}
                                value={item.id}
                                checked={formData?.wachingMoviePackageIds.includes(
                                    item.id
                                )}
                                onChange={(e) => handleChange(e)}
                            />
                            <label htmlFor={item.id}>{item.name}</label>
                        </div>
                    ))}
                </div>
            </div>
            <Button success type='submit' classNames={cx('save-btn')}>
                Lưu
            </Button>
        </form>
    );
}

export default Form;
