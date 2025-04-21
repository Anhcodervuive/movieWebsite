import classNames from 'classnames/bind';

import styles from './ErrorWithStatusCode.module.css';
import Image from '@/assets/Images';
import Button from '@/components/UI/Button';
import routes from '@/config/routes';
import { useMemo } from 'react';

const cx = classNames.bind(styles);

function ErrorWithStatusCode({ mainMessage, subMessage, code }) {
    const image = useMemo(() => {
        switch (code) {
            case 403:
                return Image.error403;
            default:
                return Image.notFound;
        }
    }, [code]);

    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('error-img')}
                style={{ backgroundImage: `url(${image})` }}></div>
            <h1 className={cx('main-message')}>{mainMessage || '404'}</h1>
            <h3 className={cx('sub-message')}>
                {subMessage || 'Trang bạn đang tìm kiếm không tồn tại'}
            </h3>
            <div className={cx('back-button-wrapper')}>
                <Button
                    size='large'
                    to={routes.home}
                    primary
                    classNames={cx('back-home-btn')}>
                    Về trang chủ
                </Button>
            </div>
        </div>
    );
}

export default ErrorWithStatusCode;
