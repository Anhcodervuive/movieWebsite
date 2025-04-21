import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { setIsAdvertisePlaying, StoreContext } from '../../store';

import Button from '@/components/UI/Button';
import styles from './SkipAdsButton.module.css';

const cx = classNames.bind(styles);

function SkipAdsButton() {
    const [secondsRemaining, setSecondsRemaining] = useState(5);
    const [state, dispatch] = useContext(StoreContext);
    const [isCounting, setIsCounting] = useState(true);
    const { playing, isLoading, adsUrls } = state;

    useEffect(() => {
        let timer;
        if (
            isCounting &&
            secondsRemaining > 0 &&
            adsUrls.length > 0 &&
            playing &&
            !isLoading
        ) {
            timer = setInterval(() => {
                setSecondsRemaining((prevTime) => prevTime - 1);
            }, 1000);
        }

        if (secondsRemaining === 0) {
            setIsCounting(false); // Dừng lại khi kết thúc
        }

        return () => clearInterval(timer);
    }, [isCounting, playing, secondsRemaining, isLoading, adsUrls]);

    const skipAds = () => {
        dispatch(setIsAdvertisePlaying(false));
    };

    return (
        <div className={cx('wrapper')}>
            {secondsRemaining ? (
                <Button dark disable>
                    Bỏ qua trong {secondsRemaining} giây
                </Button>
            ) : (
                <Button dark onClick={skipAds}>
                    Bỏ qua quảng cáo
                </Button>
            )}
        </div>
    );
}

export default SkipAdsButton;
