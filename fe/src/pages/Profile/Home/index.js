import classNames from 'classnames/bind';
import { FaUser } from 'react-icons/fa';

import styles from './HomeProfile.module.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function HomeProfile() {
    const user = useSelector((state) => state.auth.currentUser);

    useEffect(() => {
        document.title = 'Trang cá nhân';
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-infor-header')}>
                <div className={cx('user-img-default')}>
                    <FaUser />
                </div>
                <h2>{user?.name}</h2>
            </div>
            <div className={cx('user-infor-body')}>
                <div className={cx('item')}>
                    <span className={cx('title')}>Email: </span>
                    <span className={cx('value')}>{user?.email}</span>
                </div>
                <div className={cx('divider')}></div>
                <div className={cx('item')}>
                    <span className={cx('title')}>Role: </span>
                    <span className={cx('value')}>
                        {user?.role.map((role) => role.name).join(', ')}
                    </span>
                </div>
                <div className={cx('divider')}></div>
                <div className={cx('item')}>
                    <span className={cx('title')}>Tham gia từ: </span>
                    <span className={cx('value')}>
                        {user?.joinAt.split('T')[0]}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default HomeProfile;
