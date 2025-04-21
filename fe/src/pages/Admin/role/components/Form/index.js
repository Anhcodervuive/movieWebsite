import classNames from 'classnames/bind';

import styles from './RoleForm.module.css';
import { useCallback, useState } from 'react';
import { Text } from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { toast } from 'react-toastify';
import { DefaultToast } from '@/components/UI/ToastMessage';

const cx = classNames.bind(styles);

const validateRules = {
    name: ['required'],
};

function Form({ data, permissions = [], onSubmit }) {
    const [formErrorMessage, setFormErrorMessage] = useState({});
    const [formData, setFormData] = useState(
        data
            ? {
                  name: data.name,
                  permissionIds: data.permissions.map((item) => item.id),
              }
            : {
                  name: '',
                  permissionIds: [],
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
                    placeholder='Nhập vào tên role'
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
            <div className={cx('c-12', 'col')}>
                <h3 style={{ marginBottom: '10px' }}>Quyền: *</h3>
                <div className='row no-gutters'>
                    {permissions?.map((item) => (
                        <div
                            key={item.id}
                            className={cx('c-3', 'checkbox-wrapper')}>
                            <input
                                type='checkbox'
                                name='permissionIds'
                                id={item.id}
                                value={item.id}
                                checked={formData?.permissionIds.some(
                                    // eslint-disable-next-line eqeqeq
                                    (value) => value === item.id
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
