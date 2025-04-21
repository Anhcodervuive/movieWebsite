/* eslint-disable eqeqeq */
import { forwardRef, memo, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClosedCaptioning,
    faCompress,
    faExpand,
    faPause,
    faPlay,
    faRotateLeft,
    faRotateRight,
    faVolumeHigh,
    faVolumeLow,
    faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';

import styles from './OtherControl.module.css';

import {
    adjustVolumn,
    setLanguage,
    StoreContext,
    toggleFullscreen,
    setPlaying,
    setIsBackward,
    setIsForward,
} from '../../../store';

import Button from '@/components/UI/Button';

const cx = classNames.bind(styles);

const ForwardedTippy = forwardRef((props, ref) => (
    <Tippy {...props}>
        <div ref={ref}>{props.children}</div>
    </Tippy>
));

function extractTextInParentheses(text) {
    let regex = /\((.*?)\)/g;
    let matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

function OtherControl() {
    const volumnRef = useRef();
    const [state, dispatch] = useContext(StoreContext);

    const {
        wrapperRef,
        eps,
        movie,
        videoRef,
        playing,
        volumn,
        language,
        isFullscreen,
    } = state;

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
        dispatch(setPlaying(!playing));
    };

    const toggleFullscreenHandle = () => {
        if (!document.fullscreenElement) {
            wrapperRef.current.requestFullscreen({ navigationUI: 'hide' });
        } else {
            document.exitFullscreen();
            videoRef.current.style.objectFit = 'contain';
        }
        dispatch(toggleFullscreen());
    };
    return (
        <div className={cx('other-controllers')}>
            <Button size='small' onClick={togglePlay}>
                {!playing ? (
                    <FontAwesomeIcon icon={faPlay} />
                ) : (
                    <FontAwesomeIcon icon={faPause} />
                )}
            </Button>
            <Button
                size='small'
                classNames={cx('skip-backward-5')}
                onClick={() => {
                    videoRef.current.currentTime -= 5;
                    dispatch(setIsBackward(true));
                    setTimeout(() => {
                        dispatch(setIsBackward(false));
                    }, 1500);
                }}>
                <FontAwesomeIcon icon={faRotateLeft} />
            </Button>
            <Button
                size='small'
                classNames={cx('skip-forward-5')}
                onClick={() => {
                    videoRef.current.currentTime += 5;
                    dispatch(setIsForward(true));
                    setTimeout(() => {
                        dispatch(setIsForward(false));
                    }, 1500);
                }}>
                <FontAwesomeIcon icon={faRotateRight} />
            </Button>
            <ForwardedTippy
                ref={volumnRef}
                interactive
                placement='right'
                // appendTo={document.body}
                render={(attrs) => (
                    <input
                        {...attrs}
                        type='range'
                        min='0'
                        max='1'
                        step='0.01'
                        value={volumn}
                        style={{
                            background: `linear-gradient(to right, rgb(255, 101, 0) ${
                                volumn * 100
                            }%, rgba(255, 255, 255, 0.54) ${
                                volumn * 100
                            }%, rgba(255, 255, 255, 0.54) 100%)`,
                        }}
                        onChange={(e) => {
                            dispatch(adjustVolumn(e.target.value));

                            videoRef.current.volume = e.target.value;
                        }}
                        className={cx('volumn-control')}
                    />
                )}>
                <Button
                    size='small'
                    classNames={cx('volumn-icon-btn')}
                    onClick={() => {
                        if (volumn === 0) {
                            videoRef.current.volume = 0.5;
                            dispatch(adjustVolumn(0.5));
                        } else {
                            videoRef.current.volume = 0;
                            dispatch(adjustVolumn(0));
                        }
                    }}>
                    {volumn == 0 && <FontAwesomeIcon icon={faVolumeXmark} />}
                    {volumn == 1 && <FontAwesomeIcon icon={faVolumeHigh} />}
                    {volumn > 0 && volumn < 1 && (
                        <FontAwesomeIcon icon={faVolumeLow} />
                    )}
                </Button>
            </ForwardedTippy>

            <div className={cx('language-btn')}>
                <ForwardedTippy
                    ref={volumnRef}
                    interactive
                    trigger='click'
                    placement='top'
                    offset={[-10, 30]}
                    // appendTo={document.body}

                    render={(attrs) =>
                        language ? (
                            <ul {...attrs} className={cx('language-control')}>
                                {Object.keys(eps).map((value, index) => (
                                    <li key={index}>
                                        <Button
                                            size='small'
                                            onClick={() => {
                                                dispatch(setLanguage(value));
                                            }}>
                                            {language === value && (
                                                <>&#10003;</>
                                            )}{' '}
                                            {extractTextInParentheses(value)}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Button
                                size='small'
                                className={cx('language-control')}>
                                &#10003;
                                {extractTextInParentheses(movie.server)}
                            </Button>
                        )
                    }>
                    <Button size='small'>
                        <FontAwesomeIcon icon={faClosedCaptioning} />
                    </Button>
                </ForwardedTippy>
            </div>
            <Button
                size='small'
                onClick={toggleFullscreenHandle}
                classNames={cx('fullscreen-btn')}>
                {isFullscreen ? (
                    <FontAwesomeIcon icon={faCompress} />
                ) : (
                    <FontAwesomeIcon icon={faExpand} />
                )}
            </Button>
        </div>
    );
}

export default memo(OtherControl);
