import classNames from 'classnames/bind';

import styles from './Controlbar.module.css';
import { OtherControl, ProgressBar } from './Component';

const cx = classNames.bind(styles);

function Controlbar() {
    return (
        <div type='controlbar' className={cx('controller')}>
            <ProgressBar />
            <OtherControl />
        </div>
    );
}

export default Controlbar;
