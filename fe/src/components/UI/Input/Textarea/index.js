import classNames from 'classnames/bind';

import styles from './Textarea.module.css';

const cx = classNames.bind(styles);

function Textarea({ col, row, ...props }) {
    return (
        <div className={cx('wrapper')}>
            <textarea cols={col} rows={row} {...props} />
        </div>
    );
}

export default Textarea;
