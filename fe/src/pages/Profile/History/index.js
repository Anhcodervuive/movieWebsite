import classNames from 'classnames/bind';

import styles from './History.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import Button from '@/components/UI/Button';
import config from '@/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';

import MovieService from '@/service/web/movie.service';
import { DefaultToast } from '@/components/UI/ToastMessage';
import { fetchData } from '@/core/action/watchedMovie';

const cx = classNames.bind(styles);

function History() {
    const watchedMovies = useSelector((state) => state.watchedMovies.list);
    const dispatch = useDispatch();

    const getPercentWatched = useCallback((watchedEps, totalEps) => {
        if (watchedEps && totalEps) {
            return (
                (watchedEps.filter((ep) => ep.server === watchedEps[0].server)
                    .length /
                    totalEps) *
                100
            ).toFixed(2);
        }
    }, []);

    const getLatestWatch = useCallback((watchedEps) => {
        if (watchedEps) {
            const episode = watchedEps.reduce((latest, current) => {
                const latestDate = new Date(
                    latest.user_watch_episodes[0].updated_at
                );
                const currentDate = new Date(
                    current.user_watch_episodes[0].updated_at
                );
                return currentDate > latestDate ? current : latest;
            });

            return episode;
        }
    }, []);

    const getWatchedMoviesIn = useCallback(
        (option) => {
            if (watchedMovies.length > 0) {
                const today = new Date();

                switch (option) {
                    case 'today':
                        const todayWatchedMovies = watchedMovies.filter(
                            (movie) => {
                                const latestEpisode = getLatestWatch(
                                    movie.episodes
                                );
                                const watchedDate = new Date(
                                    latestEpisode.user_watch_episodes[0].updated_at
                                );
                                return (
                                    watchedDate.getDay() === today.getDay() &&
                                    watchedDate.getMonth() ===
                                        today.getMonth() &&
                                    watchedDate.getFullYear() ===
                                        today.getFullYear()
                                );
                            }
                        );

                        return todayWatchedMovies;
                    case 'yesterday':
                        const yesterday = new Date();
                        yesterday.setDate(today.getDate() - 1);

                        const yesterdatWatchedMovies = watchedMovies.filter(
                            (movie) => {
                                const latestEpisode = getLatestWatch(
                                    movie.episodes
                                );
                                const watchedDate = new Date(
                                    latestEpisode.user_watch_episodes[0].updated_at
                                );
                                return (
                                    watchedDate.getDay() ===
                                        yesterday.getDay() &&
                                    watchedDate.getMonth() ===
                                        yesterday.getMonth() &&
                                    watchedDate.getFullYear() ===
                                        yesterday.getFullYear()
                                );
                            }
                        );
                        return yesterdatWatchedMovies;
                    default:
                        const otherDay = new Date();
                        otherDay.setDate(today.getDate() - 2);
                        const otherWatchedMovies = watchedMovies.filter(
                            (movie) => {
                                const latestEpisode = getLatestWatch(
                                    movie.episodes
                                );
                                const watchedDate = new Date(
                                    latestEpisode.user_watch_episodes[0].updated_at
                                );

                                return (
                                    watchedDate.getTime() <= otherDay.getTime()
                                );
                            }
                        );

                        return otherWatchedMovies;
                }
            }
        },
        [getLatestWatch, watchedMovies]
    );

    const onDeleteHistory = async (movieId) => {
        await MovieService.removeHistory(movieId)
            .then((res) => {
                toast(DefaultToast, {
                    containerId: 'history-page',
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: res.type,
                        title: 'Thành công',
                        message: res.message,
                    },
                });
                dispatch(fetchData());
            })
            .catch((err) => {
                console.log(err);

                toast(DefaultToast, {
                    containerId: 'history-page',
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'error',
                        title: 'Lỗi',
                        message: err.response.data.message,
                    },
                });
            });
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('header')}>Lịch sử xem</h2>

            <div className={cx('body')}>
                {watchedMovies?.length > 0 && (
                    <>
                        {getWatchedMoviesIn('today').length > 0 && (
                            <div className={cx('item', 'row')}>
                                <h3 className={cx('c-12', 'name')}>Hôm nay</h3>
                                {getWatchedMoviesIn('today').map(
                                    (movie, index) => (
                                        <div
                                            key={index}
                                            className={cx('c-6', 'l-3', 'col')}>
                                            <div
                                                className={cx('movie-image')}
                                                style={{
                                                    backgroundImage: `url(${movie.thumb_url})`,
                                                }}>
                                                <Button
                                                    classNames={cx(
                                                        'delete-history-btn'
                                                    )}
                                                    size='small'
                                                    onClick={() =>
                                                        onDeleteHistory(
                                                            movie.id
                                                        )
                                                    }>
                                                    <FontAwesomeIcon
                                                        icon={faXmark}
                                                    />
                                                </Button>
                                                <span
                                                    className={cx(
                                                        'current-episode'
                                                    )}>
                                                    Đã xem đến{' '}
                                                    {
                                                        getLatestWatch(
                                                            movie.episodes
                                                        ).name
                                                    }
                                                </span>
                                                <div
                                                    className={cx(
                                                        'shadow-wrap'
                                                    )}></div>
                                                <div className={cx('bar')}>
                                                    <div
                                                        style={{
                                                            width: `${getPercentWatched(
                                                                movie.episodes,
                                                                movie.episode_total
                                                            )}%`,
                                                        }}
                                                        className={cx(
                                                            'bar-percent'
                                                        )}></div>
                                                </div>
                                            </div>
                                            <Button
                                                to={config.routes.watchMovie.withParam(
                                                    movie.slug,
                                                    getLatestWatch(
                                                        movie.episodes
                                                    ).slug
                                                )}
                                                className={cx('movie-name')}>
                                                {movie.name}
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {getWatchedMoviesIn('yesterday').length > 0 && (
                            <div className={cx('item', 'row')}>
                                <h3 className={cx('c-12', 'name')}>Hôm qua</h3>
                                {getWatchedMoviesIn('yesterday').map(
                                    (movie, index) => (
                                        <div
                                            key={index}
                                            className={cx('col', 'c-6', 'l-3')}>
                                            <div
                                                className={cx('movie-image')}
                                                style={{
                                                    backgroundImage: `url(${movie.thumb_url})`,
                                                }}>
                                                <Button
                                                    classNames={cx(
                                                        'delete-history-btn'
                                                    )}
                                                    size='small'
                                                    onClick={async () =>
                                                        await onDeleteHistory(
                                                            movie.id
                                                        )
                                                    }>
                                                    <FontAwesomeIcon
                                                        icon={faXmark}
                                                    />
                                                </Button>
                                                <span
                                                    className={cx(
                                                        'current-episode'
                                                    )}>
                                                    Đã xem đến{' '}
                                                    {
                                                        getLatestWatch(
                                                            movie.episodes
                                                        ).name
                                                    }
                                                </span>
                                                <div
                                                    className={cx(
                                                        'shadow-wrap'
                                                    )}></div>
                                                <div className={cx('bar')}>
                                                    <div
                                                        style={{
                                                            width: `${getPercentWatched(
                                                                movie.episodes,
                                                                movie.episode_total
                                                            )}%`,
                                                        }}
                                                        className={cx(
                                                            'bar-percent'
                                                        )}></div>
                                                </div>
                                            </div>
                                            <Button
                                                to={config.routes.watchMovie.withParam(
                                                    movie.slug,
                                                    getLatestWatch(
                                                        movie.episodes
                                                    ).slug
                                                )}
                                                className={cx('movie-name')}>
                                                {movie.name}
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {getWatchedMoviesIn().length > 0 && (
                            <div className={cx('item', 'row')}>
                                <h3 className={cx('c-12', 'name')}>Trước đó</h3>
                                {getWatchedMoviesIn().map((movie, index) => (
                                    <div
                                        key={index}
                                        className={cx('col', 'c-6', 'l-3')}>
                                        <div
                                            className={cx('movie-image')}
                                            style={{
                                                backgroundImage: `url(${movie.thumb_url})`,
                                            }}>
                                            <Button
                                                classNames={cx(
                                                    'delete-history-btn'
                                                )}
                                                size='small'
                                                onClick={() =>
                                                    onDeleteHistory(movie.id)
                                                }>
                                                <FontAwesomeIcon
                                                    icon={faXmark}
                                                />
                                            </Button>
                                            <span
                                                className={cx(
                                                    'current-episode'
                                                )}>
                                                Đã xem đến{' '}
                                                {
                                                    getLatestWatch(
                                                        movie.episodes
                                                    ).name
                                                }
                                            </span>
                                            <div
                                                className={cx(
                                                    'shadow-wrap'
                                                )}></div>
                                            <div className={cx('bar')}>
                                                <div
                                                    style={{
                                                        width: `${getPercentWatched(
                                                            movie.episodes,
                                                            movie.episode_total
                                                        )}%`,
                                                    }}
                                                    className={cx(
                                                        'bar-percent'
                                                    )}></div>
                                            </div>
                                        </div>
                                        <Button
                                            to={config.routes.watchMovie.withParam(
                                                movie.slug,
                                                getLatestWatch(movie.episodes)
                                                    .slug
                                            )}
                                            className={cx('movie-name')}>
                                            {movie.name}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            <ToastContainer theme='dark' containerId={'history-page'} />
        </div>
    );
}

export default History;
