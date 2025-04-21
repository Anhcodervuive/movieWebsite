import classNames from 'classnames/bind';

import styles from './VideoForm.module.css';
import { useCallback, useState } from 'react';
import { SelectBox, Text } from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { toast } from 'react-toastify';
import { DefaultToast } from '@/components/UI/ToastMessage';

const cx = classNames.bind(styles);

const validateRules = {
    type: ['required'],
};

function Form({ data, onSubmit }) {
    const [formErrorMessage, setFormErrorMessage] = useState({});
    const [formData, setFormData] = useState(
        data ?? {
            name: '',
            videoFile: '',
            type: 'ads',
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
        const { name, value, files } = e.target;
        if (files && files.length > 0) {
            setFormData({
                ...formData,
                [name]: files[0],
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
                className={cx('form-control', 'c-2', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='name'>name:</label>
                <Text
                    id='name'
                    name='name'
                    placeholder='Nhập tên video'
                    value={formData?.name}
                    onChange={(e) => {
                        handleChange(e);
                        handleValidate(e);
                    }}
                />
            </div>
            <div
                className={cx('form-control', 'c-4', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='video'>video:</label>
                <div className={cx('inputfile')}>
                    <input
                        id='video'
                        name='videoFile'
                        type='file'
                        accept='video/mp4'
                        onChange={(e) => {
                            handleChange(e);
                            handleValidate(e);
                        }}
                    />
                </div>
                {formErrorMessage.name && (
                    <span className={cx('error-message')}>
                        {formErrorMessage.name}
                    </span>
                )}
            </div>
            <div
                className={cx('form-control', 'c-2', 'col')}
                style={{ marginBottom: '20px' }}>
                <label htmlFor='type'>type:</label>
                <SelectBox
                    id='type'
                    name='type'
                    value={formData?.type ?? 'male'}
                    options={[
                        {
                            label: 'ads',
                            value: 'ads',
                        },
                        {
                            label: 'other',
                            value: 'other',
                        },
                    ]}
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />
            </div>
            <div className={cx('c-o-3')}></div>
            <Button success type='submit' classNames={cx('save-btn')}>
                Lưu
            </Button>
        </form>
    );
}

export default Form;
