import classNames from 'classnames/bind';

import styles from './Admin_header.module.css';
import '@/assets/css/grid.css';

import Button from '@/components/UI/Button';
import { FaRegCircleUser } from 'react-icons/fa6';
import config from '@/config';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function Header({ className, ...props }) {
    const user = useSelector((state) => state.auth.currentUser);
    return (
        <div
            {...props}
            className={cx(className, 'wrapper', 'row', 'no-gutters')}>
            <nav className={cx('c-10', 'nav', 'has-left-divider')}>
                <ul>
                    <li>
                        <Button to={config.routes.admin.dashboard}>Home</Button>
                    </li>
                    <li>
                        <Button to={config.routes.admin.moive.home}>
                            Movie list
                        </Button>
                    </li>
                </ul>
            </nav>
            <div className={cx('c-2', 'user-infor', 'has-left-divider')}>
                <Button size='small' classNames={cx('header-avt')}>
                    <FaRegCircleUser />
                </Button>
                <div className={cx('user-name')}>
                    <p>{user?.name}</p>{' '}
                    <span>
                        {user?.role?.map((role) => role.name).join(', ')}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Header;
