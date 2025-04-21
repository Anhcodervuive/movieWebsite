import Button from '@/components/UI/Button';
import Tippy from '@tippyjs/react/headless';
import { forwardRef, memo, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

import { FaHistory } from 'react-icons/fa';
import classNames from 'classnames/bind';

import styles from './HistoryPanel.module.css';
import config from '@/config';

const cx = classNames.bind(styles);

function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const now = new Date();

    // Tạo đối tượng cho hôm nay và hôm qua
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
    );
    // Lấy giờ và phút
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');

    if (dateTime >= today) {
        return `Hôm nay ${hours}:${minutes}`;
    } else if (dateTime >= yesterday) {
        return `Hôm qua ${hours}:${minutes}`;
    } else {
        // Định dạng dd-mm-yyyy giờ phút
        const day = dateTime.getDate().toString().padStart(2, '0');
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = dateTime.getFullYear();
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
}

const ForwardedTippy = forwardRef((props, ref) => (
    <Tippy {...props}>
        <div ref={ref}>{props.children}</div>
    </Tippy>
));

function HistoryPanel() {
    const historyRef = useRef();
    const watchedMovies = useSelector((state) => state.watchedMovies.list);

    const getLatestWatch = useCallback((watchedEps) => {
        if (watchedEps) {
            const episode = watchedEps.reduce((latest, current) => {
                const latestDate = new Date(
                    latest?.user_watch_episodes[0].updated_at
                );
                const currentDate = new Date(
                    current?.user_watch_episodes[0].updated_at
                );
                return currentDate > latestDate ? current : latest;
            });

            return episode;
        }
    }, []);

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

    const getSortedWatchedMovies = useCallback(() => {
        if (watchedMovies.length > 0) {
            const newArr = [...watchedMovies];
            return newArr.sort((a, b) => {
                const latestA = getLatestWatch(a.episodes);
                const latestB = getLatestWatch(b.episodes);
                return (
                    new Date(latestB?.user_watch_episodes[0].updated_at) -
                    new Date(latestA?.user_watch_episodes[0].updated_at)
                );
            });
        }
    }, [getLatestWatch, watchedMovies]);

    return (
        <ForwardedTippy
            interactive
            placement='bottom'
            ref={historyRef}
            appendTo={document.body}
            render={(attrs) => (
                <div className={cx('wrapper')}>
                    {watchedMovies?.length > 0 ? (
                        <ul
                            {...attrs}
                            tabIndex='-1'
                            className={cx('watched-movies')}>
                            {getSortedWatchedMovies().map((item, index) => (
                                <li key={index} className={cx('item')}>
                                    <div
                                        className={cx('image')}
                                        style={{
                                            backgroundImage: `url(${item.thumb_url})`,
                                        }}></div>
                                    <div className={cx('content')}>
                                        <Button
                                            size='small'
                                            style={{
                                                padding: '0px',
                                                justifyContent: 'flex-start',
                                            }}
                                            to={config.routes.watchMovie.withParam(
                                                item.slug,
                                                getLatestWatch(item.episodes)
                                                    .slug
                                            )}>
                                            <p className={cx('movie-name')}>
                                                {item.name}
                                            </p>
                                        </Button>
                                        <Button
                                            size='small'
                                            style={{
                                                padding: '0px',
                                                justifyContent: 'flex-start',
                                            }}
                                            to={config.routes.watchMovie.withParam(
                                                item.slug,
                                                getLatestWatch(item.episodes)
                                                    .slug
                                            )}>
                                            <p
                                                className={cx(
                                                    'movie-origin-name'
                                                )}>
                                                {item.origin_name}
                                            </p>
                                        </Button>
                                        <div>
                                            <span
                                                className={cx(
                                                    'watched-percent'
                                                )}>
                                                Đã xem:
                                                {getPercentWatched(
                                                    item.episodes,
                                                    item.episode_total
                                                )}
                                                %
                                            </span>
                                            <span className={cx('time')}>
                                                {formatDateTime(
                                                    getLatestWatch(
                                                        item.episodes
                                                    ).user_watch_episodes[0]
                                                        .updated_at
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className={cx('no-history')}>Chưa có lịch sử</div>
                    )}
                    <Button textPrimary to={config.routes.profile.history}>
                        Xem tất cả
                    </Button>
                </div>
            )}>
            <Button
                text
                style={{ fontSize: '1rem' }}
                to={config.routes.profile.history}>
                <FaHistory />
            </Button>
        </ForwardedTippy>
    );
}

export default memo(HistoryPanel);
