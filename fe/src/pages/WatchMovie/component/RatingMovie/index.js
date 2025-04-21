import { memo, useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

import styles from './RatingMovie.module.css';

import RatingService from '@/service/web/rating.service';

import useGetAPIData from '@/hooks/useGetAPIData';
import Button from '@/components/UI/Button';
import Rating from '@/components/UI/Rating';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function RatingMovie({ movieId }) {
    const [isRate, setIsRate] = useState(true);
    const user = useSelector((state) => state.auth.currentUser);
    const {
        data,
        isLoading,
        // isError,
    } = useGetAPIData(
        async () => {
            if (movieId) {
                return await RatingService.getRate(movieId);
            } else {
                return null;
            }
        },
        null,
        [movieId, isRate]
    );

    const { data: userRate, isLoading: isUserRateLoading } = useGetAPIData(
        async () => {
            if (user && movieId) {
                return await RatingService.getRateOfUser(movieId);
            } else {
                return null;
            }
        },
        null,
        [movieId, isRate, user]
    );

    const dispatchToReloadRating = useCallback(() => {
        setIsRate((prev) => !prev);
    }, []);

    return (
        <>
            {!isLoading && (
                <Button
                    classNames={cx('rating-display')}
                    grey
                    leftIcon={
                        <FontAwesomeIcon
                            className={cx('big-primary-star')}
                            icon={faStar}
                        />
                    }>
                    {data?.avgRate}
                    <span className={cx('rating-quantity')}>
                        {`(${data?.numberRate})`}
                    </span>
                </Button>
            )}

            {!isUserRateLoading && (
                <Rating
                    dispatch={dispatchToReloadRating}
                    star={userRate?.rate}
                    movieId={movieId}
                />
            )}
        </>
    );
}

export default memo(RatingMovie);
