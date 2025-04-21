import classNames from 'classnames/bind';

import '@/assets/css/grid.css';
import styles from './ProfileLayout.module.css';
import SideBar from './Sidebar';
import DefaultLayout from '../DefaultLayout';

const cx = classNames.bind(styles);

function ProfileLayout({ children }) {
    return (
        <DefaultLayout>
            <div className={cx('wrapper', 'grid', 'wide', 'row')}>
                <SideBar className={cx('c-12', 'l-3')} />
                <div className={cx('c-12', 'l-9', 'content')}>{children}</div>
            </div>
        </DefaultLayout>
    );
}

export default ProfileLayout;
