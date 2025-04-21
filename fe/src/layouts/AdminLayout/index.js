import classNames from 'classnames/bind';
import { useEffect } from 'react';

import styles from './AdminLayout.module.css';
import '@/assets/css/grid.css';

import SiderBar from '../components/admin/SideBar';
import Header from '../components/admin/Header';

const cx = classNames.bind(styles);

function AdminLayout({ children }) {
    useEffect(() => {
        document.title = 'Admin';
    }, []);

    return (
        <div className={cx('wrapper')}>
            <SiderBar classNames={cx('sidebar')} />
            <div className={cx('body')}>
                <Header />
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default AdminLayout;
