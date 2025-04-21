import classNames from 'classnames/bind';

import styles from './NotAllowedToWatchError.module.css';

const cx = classNames.bind(styles);

function NotAllowedToWatchError() {
    return (
        <div className={cx('grid', ' wide', 'wrapper')}>
            Vui lòng mua gói vip để xem nội dung này
        </div>
    );
}

export default NotAllowedToWatchError;
