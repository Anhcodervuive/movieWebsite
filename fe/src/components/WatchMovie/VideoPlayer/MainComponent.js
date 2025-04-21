import { useContext, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import styles from './VideoPlayer.module.css';

import {
    setAdvertiseUrl,
    setCurrentTime,
    setEps,
    setIsAdvertisePlaying,
    setLanguage,
    setPlaying,
    setWrapperRef,
    StoreContext,
} from './store';

import Button from '@/components/UI/Button';
import MediaPlayer from './MediaPlayer';
import Controlbar from './Controlbar';
import SkipAdsButton from './components/SkipAdsButton';

const cx = classNames.bind(styles);

function MainComponent({ eps, ads }) {
    const wrapperRef = useRef(null);
    const [state, dispatch] = useContext(StoreContext);
    const { videoRef, playing, isLoading, language, adsIsPlaying, adsUrls } =
        state;

    useEffect(() => {
        // Hàm này hoạt động giống như debounce, không cần custome hook vẫn dùng được, sử dụng tính chất closure
        const initHandleMouseMoveInFullScreen = () => {
            const controller = document.querySelector("div[type='controlbar']");
            const progressbar = document.querySelector(
                "div[type='progressbar']"
            );
            let timerId = null;

            return () => {
                if (timerId) {
                    clearTimeout(timerId);
                }
                if (progressbar.matches(':hover')) {
                    return;
                }

                if (controller.style.display !== 'block') {
                    controller.style.display = 'block';
                }
                timerId = setTimeout(() => {
                    controller.style.display = 'none';
                }, 2000);
            };
        };

        const screen = wrapperRef.current;
        const handleMouseMoveInFullScreen = initHandleMouseMoveInFullScreen();
        if (screen && !adsIsPlaying) {
            screen.addEventListener('mousemove', handleMouseMoveInFullScreen);
            screen.addEventListener('click', handleMouseMoveInFullScreen);
        }

        return () => {
            if (screen) {
                screen.removeEventListener(
                    'mousemove',
                    handleMouseMoveInFullScreen
                );
            }
        };
    }, [adsIsPlaying, wrapperRef]);

    useEffect(() => {
        if (ads?.length > 0) {
            dispatch(setAdvertiseUrl(ads));
            dispatch(setIsAdvertisePlaying(true));
        }
    }, [ads, eps, dispatch]);

    useEffect(() => {
        if (wrapperRef.current) {
            dispatch(setWrapperRef(wrapperRef));
        }
    }, [dispatch, wrapperRef]);

    useEffect(() => {
        let timer;
        if (!adsIsPlaying && playing && adsUrls.length > 0) {
            timer = setInterval(() => {
                dispatch(setIsAdvertisePlaying(true));
            }, 600000);
            console.log(timer);
        }

        return () => {
            clearInterval(timer);
        };
    }, [adsIsPlaying, adsUrls, playing, dispatch]);

    useEffect(() => {
        if (eps) {
            dispatch(setCurrentTime(0));
        }
        dispatch(setEps(eps));
    }, [dispatch, eps]);

    useEffect(() => {
        if (!language) {
            const firstLanguage =
                typeof eps[Object.keys(eps)[0]] === 'object'
                    ? Object.keys(eps)[0]
                    : '';

            dispatch(setLanguage(firstLanguage));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, eps]);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
        dispatch(setPlaying(!playing));
    };

    return (
        <div className={cx('wrapper')} ref={wrapperRef}>
            {!playing && !isLoading && (
                <Button className={cx('big-play-btn')} onClick={togglePlay}>
                    <FontAwesomeIcon icon={faPlay} />
                </Button>
            )}
            {isLoading && (
                <button className={cx('loading-btn')}>
                    <AiOutlineLoading3Quarters className={cx('loading-icon')} />
                </button>
            )}
            <MediaPlayer />
            {!adsIsPlaying ? <Controlbar /> : <SkipAdsButton />}
        </div>
    );
}

export default MainComponent;
