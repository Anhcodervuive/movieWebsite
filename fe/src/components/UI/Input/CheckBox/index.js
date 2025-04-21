import classNames from 'classnames/bind';

import styles from './Checkbox.module.css';

const cx = classNames.bind(styles);

function CheckBox({ title, name, checked, ...props }) {
    return (
        <div className={cx('wrapper')}>
            <input type='checkbox' name={name} checked={checked} {...props} />
            <label>{title}</label>
        </div>
    );
}

export default CheckBox;
