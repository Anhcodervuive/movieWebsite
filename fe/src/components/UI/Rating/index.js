import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import RatingService from '@/service/web/rating.service';

import styles from './Rating.module.css';
import Button from '../Button';
import { DefaultToast } from '@/components/UI/ToastMessage';
import config from '@/config';

const cx = classNames.bind(styles);

function Rating({ star = 0, movieId, dispatch }) {
    const navigate = useNavigate();
    const [rating, setRating] = useState(star);
    const user = useSelector((state) => state.auth.currentUser);
    const [isEdited, setIsEdited] = useState(false);

    useEffect(() => {
        setRating(star);
    }, [star]);

    const handleMouseOver = (e) => {
        let elememt = e.currentTarget;
        let prevElement = [elememt];
        let prev = elememt.previousElementSibling;
        while (prev && prev.classList.contains(cx('rating-display'))) {
            prevElement.push(prev);
            prev = prev.previousElementSibling;
        }

        prevElement.forEach((item) => {
            const icon = item.querySelectorAll('svg')[0];
            icon.style.color = '#ff6500';
        });
    };

    const handleMouseOut = () => {
        const icons = document.getElementsByClassName(cx('action-star'));

        for (let i = 0; i < icons.length; i++) {
            icons[i].style.color = '#313131';
        }
    };

    const handleRating = async (e) => {
        if (!user) {
            const currentPath = window.location.pathname;
            navigate(config.routes.login, {
                state: { from: currentPath },
            });
            return;
        }
        const element = e.currentTarget;
        const star = element.getAttribute('data-star');

        setRating(star);
        setIsEdited(false);

        await RatingService.rateMovie({ star, movieId })
            .then((res) => {
                toast(DefaultToast, {
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'success',
                        title: 'Gửi đánh giá thành công',
                        message: res.message,
                    },
                });
                dispatch();
            })
            .catch((err) => {
                console.log(err);

                toast(DefaultToast, {
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'error',
                        title: 'Gửi đánh giá thất bại',
                        message: err.message,
                    },
                });
            });
    };

    return (
        <div className={cx('wrapper')}>
            {rating && !isEdited ? (
                <div className={cx('rating-result')}>
                    <Button text>
                        <FontAwesomeIcon
                            className={cx('primary-star')}
                            icon={faStar}
                        />
                        <span>{rating}</span>
                    </Button>
                    <Button
                        text
                        classNames={cx('edit-mode-button')}
                        onClick={() => setIsEdited(true)}>
                        Chỉnh sửa
                    </Button>
                </div>
            ) : (
                <div className={cx('action')}>
                    <Button
                        data-star={1}
                        classNames={cx('rating-display')}
                        text
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        onClick={handleRating}>
                        <FontAwesomeIcon
                            className={cx('action-star', {
                                'primary-star': rating >= 1,
                            })}
                            icon={faStar}
                        />
                    </Button>
                    <Button
                        data-star={2}
                        classNames={cx('rating-display')}
                        text
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        onClick={handleRating}>
                        <FontAwesomeIcon
                            className={cx('action-star', {
                                'primary-star': rating >= 2,
                            })}
                            icon={faStar}
                        />
                    </Button>
                    <Button
                        data-star={3}
                        classNames={cx('rating-display')}
                        text
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        onClick={handleRating}>
                        <FontAwesomeIcon
                            className={cx('action-star', {
                                'primary-star': rating >= 3,
                            })}
                            icon={faStar}
                        />
                    </Button>
                    <Button
                        data-star={4}
                        classNames={cx('rating-display')}
                        text
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        onClick={handleRating}>
                        <FontAwesomeIcon
                            className={cx('action-star', {
                                'primary-star': rating >= 4,
                            })}
                            icon={faStar}
                        />
                    </Button>
                    <Button
                        data-star={5}
                        classNames={cx('rating-display')}
                        text
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                        onClick={handleRating}>
                        <FontAwesomeIcon
                            className={cx('action-star', {
                                'primary-star': rating >= 5,
                            })}
                            icon={faStar}
                        />
                    </Button>

                    {!!rating && (
                        <Button
                            text
                            classNames={cx('cancel-button')}
                            onClick={() => setIsEdited(false)}>
                            Hủy
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Rating;
