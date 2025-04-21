import classNames from 'classnames/bind';
import propTypes from 'prop-types';

import styles from './Text.module.css';

const cx = classNames.bind(styles);

function Text({ type, ...props }) {
    return (
        <div className={cx('wrapper')}>
            <input type={type} {...props} />
        </div>
    );
}

Text.propTypes = {
    type: propTypes.oneOf(['text', 'email', 'password', 'number']),
};

export default Text;
