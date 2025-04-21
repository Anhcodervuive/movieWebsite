import { useCallback, useContext, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import Hls from 'hls.js';

import styles from './MediaPlayer.module.css';

import MovieService from '@/service/web/movie.service';

import {
    setCurrentTime,
    setDurration,
    setFakeVideoRef,
    setIsAdvertisePlaying,
    setIsBackward,
    setIsForward,
    setLoading,
    setMovie,
    setPlaying,
    setVideoRef,
    StoreContext,
} from '../store';
import { useDispatch } from 'react-redux';
import { fetchData } from '@/core/action/watchedMovie';
import { store } from '@/core/store';
import config from '@/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function MediaPlayer() {
    const videoRef = useRef(null);
    const fakeVideoRef = useRef(null);
    const globalDispatch = useDispatch();
    const [state, dispatch] = useContext(StoreContext);
    const {
        eps,
        playing,
        adsUrls,
        adsIsPlaying,
        movie,
        currentTime,
        volumn,
        language,
        isLoading,
        isForward,
        isBackward,
    } = state;
    const tapTimeoutRef = useRef(null);
    const tapCountRef = useRef(0);

    useEffect(() => {
        if (videoRef.current) {
            dispatch(setVideoRef(videoRef));
        }

        videoRef.current.addEventListener('stalled', () => {
            dispatch(setLoading(true));
        });

        videoRef.current.addEventListener('waiting', () => {
            dispatch(setLoading(true));
        });
    }, [videoRef, dispatch]);

    useEffect(() => {
        const video = videoRef.current;
        return () => {
            const updateWatchedTime = async (time) => {
                const episodeKey = Object.keys(eps);
                if (episodeKey[0] === 'id') {
                    await MovieService.updateWatchedTime(eps.id, time);
                } else {
                    for (let i = 0; i < episodeKey.length; i++) {
                        const episodeId = eps[episodeKey[i]].id;
                        await MovieService.updateWatchedTime(episodeId, time);
                    }
                }

                globalDispatch(fetchData());
            };

            const currentUser = store.getState().auth.currentUser;

            if (
                video.currentTime > 0 &&
                video.type === 'movie' &&
                currentUser
            ) {
                try {
                    updateWatchedTime(video.currentTime);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eps]);

    useEffect(() => {
        return () => {
            if (eps) {
                const increaseView = async () => {
                    await MovieService.increaseView(
                        eps?.movie_id ?? eps[Object.keys(eps)[0]]?.movie_id
                    );
                };
                increaseView();
            }
        };
    }, [eps]);

    useEffect(() => {
        if (fakeVideoRef.current) {
            dispatch(setFakeVideoRef(fakeVideoRef));
        }
    }, [fakeVideoRef, dispatch]);

    useEffect(() => {
        if (language) {
            dispatch(setMovie(eps[language]));
        } else if (language === '') {
            dispatch(setMovie(eps));
        }
    }, [dispatch, eps, language]);

    useEffect(() => {
        const loadHls = (videoRef, src, isPority) => {
            if (Hls.isSupported()) {
                const hls = new Hls(
                    isPority
                        ? {
                              maxBufferLength: 60, // Tăng tối đa buffer
                              maxMaxBufferLength: 60,
                              //   liveSyncDurationCount: 999999,
                              appendErrorMaxRetry: 10,
                              autoStartLoad: true, // Tải ngay khi video gắn src
                              // startPosition: -1, // Bắt đầu từ vị trí gần nhất có sẵn
                              capLevelToPlayerSize: false, // Không giới hạn chất lượng theo kích thước player
                              defaultAudioCodec: 'mp4a.40.2',
                              fragLoadingTimeOut: 5000, // Giảm timeout khi tải .ts (mặc định 20000ms)
                              manifestLoadingTimeOut: 5000, // Giảm timeout khi tải manifest (m3u8)
                              levelLoadingTimeOut: 5000,
                              fragLoadingMaxRetry: 10,
                              manifestLoadingMaxRetry: 10, // Tăng số lần retry tải manifest
                              levelLoadingMaxRetry: 10, // Tăng số lần retry tải level
                              enableWorker: true, // Dùng Web Worker để giải mã video nhanh hơn
                              debug: false,
                          }
                        : {
                              maxBufferSize: 50 * 1000 * 1000, // Giới hạn buffer tối đa (50MB)
                              maxBufferLength: 10, // Chỉ giữ lại 10s video trong buffer
                              maxMaxBufferLength: 30, // Giới hạn tối đa buffer có thể mở rộng lên
                              liveDurationInfinity: false, // Ngăn hls.js lưu trữ vô hạn với live stream
                          }
                );
                hls.loadSource(src);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.BUFFER_APPENDED, () => {
                    if (hls.buffered.length > 1) {
                        hls.trigger(Hls.Events.BUFFER_FLUSHING);
                    }
                });
                if (isPority) {
                    hls.config.maxBufferLength = 300;
                }
            } else if (
                videoRef.current.canPlayType('application/vnd.apple.mpegurl')
            ) {
                videoRef.current.src = src;
            }
        };

        const video = videoRef.current;

        if (adsIsPlaying && adsUrls.length > 0) {
            const adLink = `${config.apiServer}${
                adsUrls[Math.floor(Math.random() * adsUrls.length)].url
            }`;
            loadHls(videoRef, adLink, false);
            video.type = 'ads';
            // Show loading animation.
            try {
                let playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            dispatch(setPlaying(true));
                        })
                        .catch((error) => {
                            dispatch(setPlaying(false));
                        });
                } else {
                    console.log(
                        'play() returned undefined, but method was still called.'
                    );
                }
            } catch (error) {
                console.error('Error calling play():', error);
            }
        } else if (movie) {
            loadHls(videoRef, movie['link'], false);
            loadHls(fakeVideoRef, movie['link'], false);
            video.type = 'movie';
            if (movie.user_watch_episodes.length > 0) {
                video.currentTime = movie.user_watch_episodes[0].current_time;
            }
            // Show loading animation.
            let playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise
                    .then((_) => {
                        // Automatic playback started!
                        // Show playing UI.
                    })
                    .catch((error) => {
                        // Auto-play was prevented
                        // Show paused UI.
                    });
            }
        }

        if (currentTime && !adsIsPlaying) {
            video.currentTime = currentTime;
        }

        if (volumn) {
            video.volume = volumn;
        }

        dispatch(setLoading(true));

        const updateTime = () => {
            // console.log(adsRunningTimeLines, Math.round(video.currentTime));

            if (!adsIsPlaying) {
                dispatch(setCurrentTime(video.currentTime));
                dispatch(setDurration(video.duration));
            }
        };

        const handleEnd = () => {
            if (adsIsPlaying) {
                dispatch(setIsAdvertisePlaying(false));
            }
        };

        video.addEventListener('timeupdate', updateTime);
        video.addEventListener('ended', handleEnd);

        return () => {
            video.removeEventListener('timeupdate', updateTime);
            video.removeEventListener('ended', handleEnd);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movie, adsIsPlaying, adsUrls]);

    const togglePlay = () => {
        if (isLoading) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
        dispatch(setPlaying(!playing));
    };

    const hanldePause = () => {
        dispatch(setPlaying(false));
    };

    const hanldePlay = () => {
        if (!isLoading) {
            dispatch(setPlaying(true));
        }
    };

    const handleKeyDown = useCallback(
        (event) => {
            event.preventDefault();
            const video = videoRef.current;
            if (event.code === 'Space' || event.keyCode === '38') {
                // Ngăn cuộn trang xuống
                if (isLoading) return;
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                dispatch(setPlaying(!playing));
            } else if (event.code === 'ArrowRight' || event.keyCode === 39) {
                video.currentTime += 5;
                dispatch(setIsForward(true));
                setTimeout(() => {
                    dispatch(setIsForward(false));
                }, 1500);
            } else if (event.code === 'ArrowLeft' || event.keyCode === 37) {
                video.currentTime -= 5;
                dispatch(setIsBackward(true));
                setTimeout(() => {
                    dispatch(setIsBackward(false));
                }, 1500);
            }
        },
        [dispatch, isLoading, playing]
    );

    const handleTouch = (e) => {
        tapCountRef.current += 1;
        if (tapCountRef.current === 2) {
            const video = videoRef.current;
            dispatch(setIsForward(true));
            if (video) {
                setTimeout(() => {
                    video.playBackRate = 2;
                }, 1000);
                const videoRect = video.getBoundingClientRect();
                const clickX = e.touches[0].clientX;

                if (clickX < videoRect.width / 2) {
                    video.currentTime -= 5; // Quay lại 5 giây
                    dispatch(setIsBackward(true));

                    setTimeout(() => {
                        dispatch(setIsBackward(false));
                    }, 1500);
                } else {
                    video.currentTime += 5; // Tua tới 5 giây
                    dispatch(setIsForward(true));
                    setTimeout(() => {
                        dispatch(setIsForward(false));
                    }, 1500);
                }
            }
        }

        // Đặt lại đếm số tap sau một khoảng thời gian
        clearTimeout(tapTimeoutRef.current);
        tapTimeoutRef.current = setTimeout(() => {
            tapCountRef.current = 0;
        }, 500); // 300ms để phát hiện double tap
    };

    const onTouchEnd = () => {
        const video = videoRef.current;
        if (video) {
            video.playBackRate = 1; // Đặt lại tốc độ phát lại về 1x
            dispatch(setIsForward(false));
        }
    };

    useEffect(() => {
        // Lắng nghe sự kiện phím nhấn khi component được render
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            // Dọn dẹp sự kiện khi component unmount
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <>
            <span
                className={cx('skip-icon', 'forward-5s', {
                    'is-forward': isForward,
                    fadeOut: !isForward,
                })}>
                <FontAwesomeIcon icon={faForward} /> 5s
            </span>
            <span
                className={cx('skip-icon', 'backward-5s', {
                    'is-backward': isBackward,
                    fadeOut: !isBackward,
                })}>
                5s <FontAwesomeIcon icon={faBackward} />
            </span>
            <video
                className={cx('player')}
                ref={videoRef}
                onTouc
                onTouchEnd={onTouchEnd}
                onTouchStart={handleTouch}
                onPause={hanldePause}
                onCanPlay={() => dispatch(setLoading(false))}
                onPlay={hanldePlay}
                onClick={togglePlay}
                onLoadedData={() => {
                    dispatch(setLoading(false));
                }}></video>
            <video
                ref={fakeVideoRef}
                style={{ display: 'none' }}
                preload='auto'></video>
        </>
    );
}

export default MediaPlayer;
