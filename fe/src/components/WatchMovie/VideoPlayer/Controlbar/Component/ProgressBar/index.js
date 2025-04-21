import { useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
// import Hls from 'hls.js';

import styles from './ProgressBar.module.css';

import { setIsAdvertisePlaying, StoreContext } from '../../../store';
import {
    setHoverPos,
    setHoverTime,
    setIsDragging,
    setThumbnail,
} from '../../../store';
import { useDebounce } from '@/hooks';

const cx = classNames.bind(styles);

const formatTime = (seconds) => {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = Math.floor(seconds % 60);

    if (seconds >= 3600)
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
            secs < 10 ? '0' : ''
        }${secs}`;
    else
        return `${minutes < 10 ? '0' : ''}${minutes}:${
            secs < 10 ? '0' : ''
        }${secs}`;
};
function ProgressBar() {
    const [state, dispatch] = useContext(StoreContext);
    const {
        videoRef,
        fakeVideoRef,
        currentTime,
        duration,
        hoverTime,
        hoverPos,
        thumbnail,
        isDragging,
        volumn,
        adsUrls,
    } = state;
    const hoverTimeDebounce = useDebounce(hoverTime, 1000);

    useEffect(() => {
        if (
            !videoRef?.current ||
            isNaN(hoverTimeDebounce) ||
            !isFinite(hoverTimeDebounce)
        )
            return;
        // const hls = new Hls({});

        const fakeVideo = fakeVideoRef?.current;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        fakeVideo.currentTime = hoverTimeDebounce;
        const captureFrame = () => {
            // setTimeout(() => {
            canvas.width = fakeVideo.videoWidth / 3.5;
            canvas.height = fakeVideo.videoHeight / 3.5;
            ctx.drawImage(fakeVideo, 0, 0, canvas.width, canvas.height);
            dispatch(setThumbnail(canvas.toDataURL()));

            // }, 50);
        };

        fakeVideo.addEventListener('seeked', () => {
            // hls.nextLoadPosition = fakeVideo.currentTime;
            // hls.config.maxBufferLength = 300;
            captureFrame();
        });

        return () => {
            fakeVideo.removeEventListener('seeked', () => {});
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, fakeVideoRef, hoverTimeDebounce]);

    const handleProgressClick = (e) => {
        const newTime =
            (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * duration;
        videoRef.current.currentTime = newTime;
    };

    const handleSeekMouseDown = () => {
        videoRef.current.volume = 0;
        dispatch(setIsDragging(true));
    };

    const handleSeekMouseUp = (e) => {
        dispatch(setIsDragging(false));
        handleSeekClick(e);
        videoRef.current.volume = volumn;
    };

    const handleSeekClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * duration;

        videoRef.current.currentTime = newTime;

        if (Math.abs(newTime - currentTime) > 600 && adsUrls.length > 0) {
            const interval = setInterval(() => {
                if (videoRef.current.readyState >= 3) {
                    clearInterval(interval); // Dừng kiểm tra khi dữ liệu đủ tải
                    // Thực hiện logic khác tại đây
                    dispatch(setIsAdvertisePlaying(true));
                }
            }, 100);
        }
    };

    const handleMouseHover = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percentage = (e.clientX - rect.left) / rect.width;
        const time = percentage * duration;

        dispatch(setHoverTime(time));
        dispatch(
            setHoverPos({ left: e.clientX - rect.left, top: -10, show: true })
        );
    };

    const handleMouseLeave = () => {
        dispatch(setHoverPos((prev) => ({ ...prev, show: false })));
    };

    return (
        <div className={cx('progress-bar-wrapper')}>
            {hoverPos.show && thumbnail && (
                <div
                    className={cx('thumbnail-preview')}
                    style={{
                        left: hoverPos.left,
                        top: hoverPos.top,
                    }}>
                    <img src={thumbnail} alt='preview' />
                    <div className={cx('hover-time-label')}>
                        {formatTime(hoverTime)}
                    </div>
                </div>
            )}
            <div className={cx('currentTime')}>{formatTime(currentTime)}</div>
            <div
                type='progressbar'
                className={cx('progress-bar')}
                onClick={handleProgressClick}
                onMouseDown={handleSeekMouseDown}
                onMouseUp={handleSeekMouseUp}
                onMouseMove={(e) =>
                    isDragging ? handleSeekClick(e) : handleMouseHover(e)
                }
                onMouseLeave={handleMouseLeave}>
                <div
                    className={cx('progress')}
                    style={{
                        width: `${(currentTime / duration) * 100}%`,
                    }}
                />
            </div>
            <div className={cx('duration')}>{formatTime(duration)}</div>
        </div>
    );
}

export default ProgressBar;
