import classNames from 'classnames/bind';
import {
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Default.module.css';

const cx = classNames.bind(styles);

function InforToast({ data }) {
    const renderIcon = () => {
        switch (data.type) {
            case 'success':
                return (
                    <FontAwesomeIcon
                        className={cx('success')}
                        icon={faCheckCircle}
                    />
                );
            case 'error':
                return (
                    <FontAwesomeIcon
                        className={cx('error')}
                        icon={faTimesCircle}
                    />
                );
            case 'warning':
                return (
                    <FontAwesomeIcon
                        className={cx('warning')}
                        icon={faExclamationCircle}
                    />
                );
            default:
                return (
                    <FontAwesomeIcon
                        className={cx('infor')}
                        icon={faInfoCircle}
                    />
                );
        }
    };

    return (
        <div className={cx('toast-wrapper')}>
            <div className={cx('icon')}>{data.type && renderIcon()}</div>
            <div className={cx('content')}>
                <h2 className={cx('title')}>{data.title}</h2>
                <h3 className={cx('message')}>{data.message}</h3>
            </div>
        </div>
    );
}

export default InforToast;
