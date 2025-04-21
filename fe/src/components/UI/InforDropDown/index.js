import classNames from 'classnames/bind';

import styles from './InforDropDown.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';

const cx = classNames.bind(styles);

function InforDropDown({ HeaderComp, children }) {
    const [isDropDown, setIsDropDown] = useState(false);

    return (
        <div className={cx('wrapper')}>
            <div
                className={cx('header')}
                onClick={() => setIsDropDown((prev) => !prev)}>
                {HeaderComp}
                <Button size='small'>
                    {isDropDown ? (
                        <FontAwesomeIcon icon={faCaretUp} />
                    ) : (
                        <FontAwesomeIcon icon={faCaretDown} />
                    )}
                </Button>
            </div>
            {isDropDown && <div className={cx('content')}>{children}</div>}
        </div>
    );
}

export default InforDropDown;
