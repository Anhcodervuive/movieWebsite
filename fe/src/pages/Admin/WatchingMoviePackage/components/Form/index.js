import classNames from 'classnames/bind';

import styles from './DirectorForm.module.css';
import { useCallback, useState } from 'react';
import { Text } from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { toast } from 'react-toastify';
import { DefaultToast } from '@/components/UI/ToastMessage';

const cx = classNames.bind(styles);

const validateRules = {
    name: ['required'],
};

function Form({ data, moviePackageBenefits = [], onSubmit }) {
    const [formErrorMessage, setFormErrorMessage] = useState({});
    const [formData, setFormData] = useState(
        data
            ? {
                  ...data,
                  moviePackageBenefitIds: data.movie_package_benefits.map(
                      (value) => value.id
                  ),
              }
            : {
                  name: '',
                  price: 0,
                  expiresIn: 0,
                  discount: 0,
                  moviePackageBenefitIds: [],
              }
    );

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
        const { name, value, checked } = e.target;

        if (name === 'moviePackageBenefitIds') {
            let newForm = formData['moviePackageBenefitIds'];

            if (checked) {
                newForm.push(parseInt(value));
            } else {
                newForm = newForm.filter((id) => id !== parseInt(value));
            }
            setFormData({
                ...formData,
                [name]: newForm,
            });
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
                    placeholder='Nhập vào tên gói phim'
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
            {/* <input type='number' /> */}
            <div
                className={cx('form-control', 'c-3', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='expiresIn'>expiresIn (month):</label>
                <Text
                    id='expiresIn'
                    name='expiresIn'
                    type='number'
                    placeholder='Nhập vào lợi ích gói phim'
                    value={formData.expiresIn}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidate(e);
                    }}
                />
                {formErrorMessage.expiresIn && (
                    <span className={cx('error-message')}>
                        {formErrorMessage.expiresIn}
                    </span>
                )}
            </div>
            <div
                className={cx('form-control', 'c-3', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='price'>price:</label>
                <Text
                    id='price'
                    name='price'
                    type='number'
                    placeholder='Nhập vào lợi ích gói phim'
                    value={formData.price}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidate(e);
                    }}
                />
                {formErrorMessage.price && (
                    <span className={cx('error-message')}>
                        {formErrorMessage.price}
                    </span>
                )}
            </div>
            <div
                className={cx('form-control', 'c-4', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='discount'>discount (0 - 100%):</label>
                <Text
                    id='discount'
                    name='discount'
                    type='number'
                    placeholder='Nhập vào lợi ích gói phim'
                    value={formData.discount}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidate(e);
                    }}
                />
                {formErrorMessage.discount && (
                    <span className={cx('error-message')}>
                        {formErrorMessage.discount}
                    </span>
                )}
            </div>
            <h2 className='c-12' style={{ marginBottom: '15px' }}>
                Đặc quyền của gói:
            </h2>
            {moviePackageBenefits.map((item, index) => (
                <div key={index} className={cx('c-4', 'checkbox-form-control')}>
                    <input
                        id={`${item.name}-${item.id}`}
                        value={item.id}
                        name='moviePackageBenefitIds'
                        type='checkbox'
                        onChange={(e) => handleChange(e)}
                        checked={
                            Array.isArray(formData?.moviePackageBenefitIds) &&
                            formData.moviePackageBenefitIds.some(
                                // eslint-disable-next-line eqeqeq
                                (value) => value === item.id
                            )
                        }
                    />
                    <label htmlFor={`${item.name}-${item.id}`}>
                        {item.name}
                    </label>
                </div>
            ))}
            <div className={cx('c-o-3')}></div>
            <Button success type='submit' classNames={cx('save-btn')}>
                Lưu
            </Button>
        </form>
    );
}

export default Form;
