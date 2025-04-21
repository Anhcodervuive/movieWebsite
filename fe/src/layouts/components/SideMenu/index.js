import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { FaRegCircleUser } from 'react-icons/fa6';
import { useSelector } from 'react-redux';

import Button from '../../../components/UI/Button';
import styles from './SideMenu.module.css';
import config from '@/config';

const cx = classNames.bind(styles);

function SideMenu({ handleLogout }) {
    const user = useSelector((state) => state.auth.currentUser);
    const catalogState = useSelector((state) => state.catalog.list);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenProfile, setIsOpenProfile] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const toogleOpenProfile = () => {
        setIsOpenProfile(!isOpenProfile);
    };

    return (
        <>
            <div className={cx('c-2', 'm-0', 'l-0')}>
                <Button
                    size='small'
                    onClick={toggleMenu}
                    classNames={cx('toogle-menu-icon')}>
                    <FontAwesomeIcon icon={faBars} />
                </Button>
            </div>
            <div
                className={cx('overlay', { show: isOpen })}
                onClick={closeMenu}></div>
            <div className={cx('side-menu', { open: isOpen })}>
                <ul>
                    <li>
                        {!user ? (
                            <Button
                                text
                                to={config.routes.login}
                                onClick={closeMenu}>
                                Đăng nhập/đăng ký
                            </Button>
                        ) : (
                            <Tippy
                                interactive
                                visible={isOpenProfile}
                                placement='bottom-end'
                                render={(attrs) => (
                                    <div
                                        className={cx('profile-menu')}
                                        tabIndex='-1'
                                        {...attrs}>
                                        <ul>
                                            <li>
                                                <Button
                                                    text
                                                    classNames={cx(
                                                        'profile-menu-item'
                                                    )}
                                                    to={
                                                        config.routes.profile
                                                            .history
                                                    }>
                                                    Lịch sử
                                                </Button>
                                            </li>
                                            <li>
                                                <Button
                                                    text
                                                    classNames={cx(
                                                        'profile-menu-item'
                                                    )}
                                                    to={
                                                        config.routes.profile
                                                            .home
                                                    }>
                                                    Thông tin cá nhân
                                                </Button>
                                            </li>
                                            <li>
                                                <Button
                                                    text
                                                    classNames={cx(
                                                        'profile-menu-item'
                                                    )}
                                                    onClick={() => {
                                                        handleLogout();
                                                        closeMenu();
                                                    }}>
                                                    Đăng xuất
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                )}>
                                <div
                                    onClick={toogleOpenProfile}
                                    className={cx('profile')}>
                                    <FaRegCircleUser />
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            </Tippy>
                        )}
                    </li>
                    {catalogState?.map((catalog, index) => (
                        <li key={index}>
                            <Button
                                text
                                to={
                                    catalog.slug === 'trang-chu'
                                        ? '/'
                                        : `/${catalog.slug}`
                                }
                                onClick={closeMenu}>
                                {catalog.name}
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default SideMenu;
