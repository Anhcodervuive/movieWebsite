import { PiMonitorPlayFill } from 'react-icons/pi';
import classNames from 'classnames/bind';

import styles from './Loading.module.css';

const cx = classNames.bind(styles);

function Loading() {
    return (
        <div className={cx('grid', ' wide', 'wrapper')}>
            <div className={cx('button')}>
                <PiMonitorPlayFill className={cx('icon')} />
            </div>
            Loading
        </div>
    );
}

export default Loading;
