import classNames from 'classnames/bind';

import styles from './Region.module.css';
import { useCallback, useState } from 'react';
import { Text } from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { toast } from 'react-toastify';
import { DefaultToast } from '@/components/UI/ToastMessage';

const cx = classNames.bind(styles);

const validateRules = {
    name: ['required'],
    gender: ['required'],
};

function Form({ data, onSubmit }) {
    const [formErrorMessage, setFormErrorMessage] = useState({});
    const [formData, setFormData] = useState(
        data ?? {
            name: '',
            slug: '',
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
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
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
                    placeholder='Nhập vào tên quốc gia'
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
                <label htmlFor='slug'>slug:</label>
                <Text
                    id='slug'
                    name='slug'
                    placeholder='Nhập vào slug'
                    value={formData.slug}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidate(e);
                    }}
                />
                {formErrorMessage?.slug && (
                    <span className={cx('error-message')}>
                        {formErrorMessage?.slug}
                    </span>
                )}
            </div>
            <div className={cx('c-o-3')}></div>

            <Button success type='submit' classNames={cx('save-btn')}>
                Lưu
            </Button>
        </form>
    );
}

export default Form;
