import Modal from 'react-modal';
import classNames from 'classnames/bind';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

import styles from './PreviewVideo.module.css';

const cx = classNames.bind(styles);

function PreviewVideo({ src, isOpen, onRequestClose }) {
    const videoRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsReady(true);
        } else {
            setIsReady(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isReady && videoRef.current && src) {
            const video = videoRef.current;

            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play();
                });

                return () => {
                    hls.destroy();
                };
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.addEventListener('loadedmetadata', () => {
                    video.play();
                });
            }
        }
    }, [isReady, src]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                overlay: {
                    backgroundColor: 'rgba(10, 9, 10, 0.6)',
                },
                content: {
                    top: '40%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    overflow: 'auto',
                    width: '500px',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#000',
                    padding: '20px',
                    borderRadius: '10px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(255, 255, 255,0.15)',
                },
            }}>
            <h3>Video preview</h3>
            <video ref={videoRef} className={cx('wrapper')} controls />
        </Modal>
    );
}

export default PreviewVideo;
