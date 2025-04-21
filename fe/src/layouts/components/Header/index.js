import React, { forwardRef, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';

import { useLocation, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless';
import { toast, ToastContainer } from 'react-toastify';
import { FaRegCircleUser } from 'react-icons/fa6';
import { MdOutlineLogout } from 'react-icons/md';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCaretDown,
    faLock,
    faWallet,
} from '@fortawesome/free-solid-svg-icons';

import AuthService from '@/service/auth.service';

import '@/assets/css/grid.css';
import styles from './Header.module.css';
import Button from '@/components/UI/Button';
import config from '@/config';
import SideMenu from '@/layouts/components/SideMenu';
import { logoutUser } from '@/core/action/auth';
import { DefaultToast } from '@/components/UI/ToastMessage';
import { showSubCatalog } from '@/core/action/catalog';
import HistoryPanel from './components/HistoryPanel';
import { removeAllWatchedMovies } from '@/core/action/watchedMovie';
import WatchingMoviePackageModal from './components/WatchingMoviePackageModal';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import ImageAsset from '@/assets/Images';

const cx = classNames.bind(styles);

const ForwardedTippy = forwardRef((props, ref) => (
    <Tippy {...props}>
        <div ref={ref}>{props.children}</div>
    </Tippy>
));

function Header() {
    const location = useLocation();
    const navigator = useNavigate();
    const tippyChildrenRef = useRef();
    const moreButtonCatalogRef = useRef();
    const dispatch = useDispatch();
    const catalogState = useSelector((state) => state.catalog.list);
    const user = useSelector((state) => state.auth.currentUser);
    const [
        isWatchingMoviePackageModalOpen,
        setIsWatchingMoviePackageModalOpen,
    ] = useState(false);

    const handleLogout = async () => {
        await AuthService.logout()
            .then(async (response) => {
                if (response.data.type === 'success') {
                    toast(DefaultToast, {
                        containerId: 'header',
                        style: { width: '400px' },
                        hideProgressBar: true,
                        data: {
                            type: 'success',
                            title: 'Thành công',
                            message: 'Đăng xuất thành công',
                        },
                    });
                    console.log(response);
                    dispatch(logoutUser({}));
                    dispatch(removeAllWatchedMovies());
                }
            })
            .catch((error) => {
                console.log(error);

                toast(DefaultToast, {
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'error',
                        title: 'Lỗi xác thực',
                        message: error.message,
                    },
                });
            });
    };

    return (
        <header className={cx('wrapper')}>
            <div className={cx('container', 'grid', 'wide')}>
                <div className={cx('row', 'no-gutters', 'content')}>
                    <SideMenu handleLogout={handleLogout} />
                    <div className={cx('c-2', 'm-0', 'l-2', 'logo')}>
                        <img src={ImageAsset.component.logo} alt='logo' />
                    </div>
                    <nav className={cx('c-0', 'l-7')}>
                        <ul className={cx('row')}>
                            {catalogState
                                .slice(
                                    0,
                                    catalogState.length > 4
                                        ? 4
                                        : catalogState.length
                                )
                                ?.map((catalog, index) => (
                                    <li className={cx('nav-item')} key={index}>
                                        <Button
                                            to={
                                                catalog.slug === 'trang-chu'
                                                    ? '/'
                                                    : `/${catalog.slug}`
                                            }
                                            classNames={cx({
                                                'nav-item-active':
                                                    location.pathname ===
                                                    (catalog.slug ===
                                                    'trang-chu'
                                                        ? '/'
                                                        : `/${catalog.slug}`),
                                            })}>
                                            {catalog.name}
                                        </Button>
                                    </li>
                                ))}
                            <li className={cx('nav-item')}>
                                <ForwardedTippy
                                    interactive
                                    // visible
                                    placement='bottom'
                                    trigger='click'
                                    ref={moreButtonCatalogRef}
                                    appendTo={document.body}
                                    render={(attrs) => (
                                        <div
                                            {...attrs}
                                            tabIndex='-1'
                                            className={cx(
                                                'row',
                                                'no-gutters',
                                                'more-catalog-popper'
                                            )}>
                                            {catalogState.length > 4 &&
                                                catalogState
                                                    .slice(
                                                        4,
                                                        catalogState.length
                                                    )
                                                    .map((catalog, index) => (
                                                        <Button
                                                            key={index}
                                                            classNames={cx(
                                                                'l-12'
                                                            )}
                                                            style={{
                                                                height: '40px',
                                                                fontSize:
                                                                    '1rem',
                                                            }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                dispatch(
                                                                    showSubCatalog(
                                                                        index +
                                                                            4
                                                                    )
                                                                );
                                                                navigator(
                                                                    `/${catalog.slug}`
                                                                );
                                                            }}>
                                                            {catalog.name}
                                                        </Button>
                                                    ))}
                                        </div>
                                    )}>
                                    <Button
                                        style={{
                                            height: '40px',
                                            fontSize: '1rem',
                                        }}
                                        rightIcon={
                                            <FontAwesomeIcon
                                                icon={faCaretDown}
                                            />
                                        }>
                                        Xem thêm
                                    </Button>
                                </ForwardedTippy>
                            </li>
                        </ul>
                    </nav>
                    <div
                        className={cx(
                            'c-6',
                            'c-o-2',
                            '',
                            'l-3',
                            'row',
                            'action'
                        )}>
                        {user && (
                            <div className={cx('c-0', 'l-1')}>
                                <HistoryPanel />
                            </div>
                        )}
                        <div className='c-2 l-1 l-o-0'>
                            <Button size='small' to={config.routes.search}>
                                <PiMagnifyingGlassBold />
                            </Button>
                        </div>

                        <div className='c-9 l-6'>
                            <Button
                                primary
                                to='da'
                                leftIcon={<FontAwesomeIcon icon={faWallet} />}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!user) {
                                        toast(DefaultToast, {
                                            containerId: 'header',
                                            style: { width: '400px' },
                                            hideProgressBar: true,
                                            data: {
                                                type: 'error',
                                                title: 'Thất bại',
                                                message:
                                                    'Vui lòng đăng nhập để sử dụng chức năng này',
                                            },
                                        });
                                    } else {
                                        setIsWatchingMoviePackageModalOpen(
                                            true
                                        );
                                    }
                                }}>
                                Mua gói
                            </Button>
                        </div>
                        <div
                            className={cx('c-0', {
                                'l-4': !user,
                                'l-1': user,
                            })}>
                            {!user ? (
                                <Button text to={config.routes.login}>
                                    Đăng nhập
                                </Button>
                            ) : (
                                <ForwardedTippy
                                    interactive
                                    // visible
                                    placement='bottom'
                                    appendTo={document.body}
                                    ref={tippyChildrenRef}
                                    render={(attrs) => (
                                        <ul
                                            {...attrs}
                                            tabIndex='-1'
                                            className={cx('header-avt-action')}>
                                            <li>
                                                <Button
                                                    to={
                                                        config.routes.profile
                                                            .home
                                                    }
                                                    leftIcon={
                                                        <FaRegCircleUser />
                                                    }>
                                                    Thông tin cá nhân
                                                </Button>
                                            </li>
                                            {user?.role
                                                ?.map((role) => role.name)
                                                .includes('Admin') && (
                                                <li>
                                                    <Button
                                                        to={
                                                            config.routes.admin
                                                                .dashboard
                                                        }
                                                        leftIcon={
                                                            <FontAwesomeIcon
                                                                icon={faLock}
                                                            />
                                                        }>
                                                        Quản trị viên
                                                    </Button>
                                                </li>
                                            )}
                                            <li>
                                                <Button
                                                    leftIcon={
                                                        <MdOutlineLogout />
                                                    }
                                                    onClick={handleLogout}>
                                                    Đăng xuất
                                                </Button>
                                            </li>
                                        </ul>
                                    )}>
                                    <Button
                                        size='small'
                                        classNames={cx('header-avt')}>
                                        <FaRegCircleUser />
                                    </Button>
                                </ForwardedTippy>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer theme='dark' containerId={'header'} />
            <WatchingMoviePackageModal
                isOpen={isWatchingMoviePackageModalOpen}
                onRequestClose={() => setIsWatchingMoviePackageModalOpen(false)}
            />
        </header>
    );
}

export default Header;
