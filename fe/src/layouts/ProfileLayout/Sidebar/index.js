import classNames from 'classnames/bind';

import styles from './Sidebar.module.css';
import Button from '@/components/UI/Button';
import config from '@/config';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);

function SideBar({ className, ...props }) {
    const location = useLocation();
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const carouselRef = useRef(null);
    const [progress, setProgress] = useState(0);

    const handleScroll = () => {
        const carousel = carouselRef.current;
        const scrollWidth = carousel.scrollWidth - carousel.clientWidth;
        const currentScroll = carousel.scrollLeft;

        const scrollProgress = (currentScroll / scrollWidth) * 100;
        setProgress(scrollProgress);
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        carousel.addEventListener('scroll', handleScroll);

        return () => {
            carousel.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Hệ số "2" để tăng độ nhạy kéo
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };
    return (
        <>
            <ul
                className={cx(className, 'wrapper')}
                {...props}
                ref={carouselRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDragging(false)}>
                <li
                    className={cx({
                        active:
                            location.pathname === config.routes.profile.home,
                    })}>
                    <Button text to={config.routes.profile.home}>
                        Thông tin cá nhân
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.profile.editInfor,
                    })}>
                    <Button text to={config.routes.profile.editInfor}>
                        Chỉnh sửa thông tin
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.profile.watchingMoviePackage,
                    })}>
                    <Button
                        text
                        to={config.routes.profile.watchingMoviePackage}>
                        Gói đã mua
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname === config.routes.profile.history,
                    })}>
                    <Button text to={config.routes.profile.history}>
                        Lịch sử
                    </Button>
                </li>
                <div className={cx('divider')}></div>
                <li>
                    <Button text>Đăng xuất tài khoản</Button>
                </li>
            </ul>
            {/* Thanh tiến trình */}
            <div className={cx('progress-bar')}>
                <div
                    className={cx('progress-bar-fill')}
                    style={{ width: `${progress}%` }}></div>
            </div>
        </>
    );
}

export default SideBar;
