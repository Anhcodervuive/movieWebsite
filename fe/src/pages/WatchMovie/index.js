import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import useGetAPIData from '@/hooks/useGetAPIData';

import '@/assets/css/grid.css';
import styles from './WatchMovie.module.css';
import Button from '@/components/UI/Button';
import Paragraph from '../../components/WatchMovie/Paragraph';

import MovieSerice from '@/service/web/movie.service';
import Loading from '@/components/UI/Loading';
import VideoPlayer from '@/components/WatchMovie/VideoPlayer';
import config from '@/config';
import {
    blackOverlayNextArrow,
    blackOverlayPrevArrow,
    Carousel,
} from '@/components/UI/Carousel';
import { ToastContainer } from 'react-toastify';
import RatingMovie from './component/RatingMovie';
import NotAllowedToWatchError from './component/NotAllowedToWatchError';

const cx = classNames.bind(styles);

function convertSlugToTitle(slug) {
    // Tách chuỗi slug theo dấu gạch ngang
    const parts = slug.split('-');

    // Kiểm tra nếu phần đầu tiên là "tap" và phần thứ hai là số
    if (parts.length === 2 && parts[0] === 'tap' && !isNaN(parts[1])) {
        return `tập ${parts[1]}`;
    }

    // Trường hợp slug không hợp lệ, trả về chuỗi gốc
    return slug;
}

function WatchMovie() {
    const { slugPhim, slugTap } = useParams();
    const [currentEpsList, setCurrentEpsList] = useState(null);
    const {
        data,
        isLoading: isLoadingMoive,
        isError: isErrorMovie,
    } = useGetAPIData(
        async () => {
            return await MovieSerice.getFullEpsMovie(slugPhim);
        },
        null,
        [slugPhim]
    );
    const { data: episodeData, isLoading: isEpisodeLoading } = useGetAPIData(
        async () => {
            if (data) {
                return await MovieSerice.getEpisode(data.movie.id, slugTap);
            } else {
                return null;
            }
        },
        null,
        [slugTap, data]
    );
    const {
        data: relatedMovie,
        isLoading: isRelatedMovieLoading,
        isError: isRelatedMovieError,
    } = useGetAPIData(
        async () => {
            if (data) {
                const slugCategories = data.movie.categories.map(
                    (category) => category.slug
                );
                return await MovieSerice.getMoviesByCategories(
                    slugCategories,
                    data.movie.id
                );
            } else {
                return null;
            }
        },
        null,
        [data]
    );

    useEffect(() => {
        if (!isLoadingMoive) {
            const movie = data.movie;
            document.title = `${movie.name} (${
                movie.language
            }) ${convertSlugToTitle(slugTap)}`;
        }
    }, [data, isLoadingMoive, slugTap]);

    useEffect(() => {
        const isAtTopPage = window.scrollY === 0;
        if (!isAtTopPage) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [slugTap]);

    useEffect(() => {
        if (!isLoadingMoive) {
            const movie = data.movie;

            const epsList = movie.episodes.filter(
                (episode) => episode.type === 'm3u8'
            );

            // Xử lý dữ liệu nếu có link thuyết minh + vietsub...
            const eps = epsList.reduce((accumulator, currentValue) => {
                if (Object.keys(accumulator).includes(currentValue.slug)) {
                    let newEps;
                    if (accumulator[currentValue.slug]?.server) {
                        newEps = {
                            [accumulator[currentValue.slug]['server']]:
                                accumulator[currentValue.slug],
                            [currentValue.server]: currentValue,
                        };
                    } else {
                        newEps = {
                            ...accumulator[currentValue.slug],
                            [currentValue.server]: currentValue,
                        };
                    }
                    return {
                        ...accumulator,
                        [currentValue.slug]: newEps,
                    };
                } else {
                    return {
                        ...accumulator,
                        [currentValue.slug]: currentValue,
                    };
                }
            }, {});

            setCurrentEpsList(eps);
        }
    }, [data, slugPhim, isLoadingMoive]);

    const renderVideoPlayer = useCallback(() => {
        if (data && episodeData) {
            if (episodeData.isAllowed) {
                const eps = episodeData.episodes.reduce((current, episode) => {
                    return {
                        ...current,
                        [episode.server]: episode,
                    };
                }, {});

                return <VideoPlayer eps={eps} ads={data.advertises} />;
            } else {
                return <NotAllowedToWatchError />;
            }
        } else {
            return <Loading />;
        }
    }, [data, episodeData]);

    const renderEpsButton = () => {
        const epsElement = [];
        if (!currentEpsList) return;

        for (let i = 1; i <= Object.keys(currentEpsList).length; i++) {
            const slugTapLocal = Object.keys(currentEpsList)[i - 1];
            let episode;
            if (Object.keys(currentEpsList[slugTapLocal]).includes('name')) {
                episode = currentEpsList[slugTapLocal];
            } else {
                episode =
                    currentEpsList[slugTapLocal][
                        Object.keys(currentEpsList[slugTapLocal])[0]
                    ];
            }

            epsElement.push(
                <div style={{ padding: '0 5px', marginBottom: '10px' }}>
                    <Button
                        episodeBtn
                        classNames={cx('eps-btn')}
                        vipLabel={episode?.waching_movie_packages?.length > 0}
                        grey={slugTap === slugTapLocal}
                        key={episode?.id}
                        dark
                        to={config.routes.watchMovie.withParam(
                            slugPhim,
                            slugTapLocal
                        )}>
                        {episode?.name}
                    </Button>
                </div>
            );
        }

        return epsElement;
    };

    if (isLoadingMoive || isRelatedMovieLoading || isEpisodeLoading) {
        return <Loading />;
    }

    if (isErrorMovie) {
        return <div>error</div>;
    }

    return (
        <div className={cx('wrapper', 'grid', 'wide')}>
            {isLoadingMoive && data ? (
                <Loading />
            ) : (
                <>
                    <div className={cx('video-player')}>
                        {renderVideoPlayer()}
                    </div>
                    <div className={cx('video-infor', 'row')}>
                        <div className={cx('col', 'c-12', 'l-8')}>
                            <h2 className={cx('vietnamese-name')}>
                                {data?.movie?.name ?? ''}
                            </h2>
                            <h3 className={cx('origin-name')}>
                                {data?.movie?.origin_name ?? ''}
                            </h3>
                            <div className={cx('rating-component')}>
                                {data && (
                                    <RatingMovie movieId={data?.movie?.id} />
                                )}
                            </div>
                            <div className={cx('movie-sub-infor')}>
                                <span style={{}}>
                                    {data?.movie?.publish_year ?? ''}
                                </span>
                                <span>
                                    {data?.movie?.type === 'series'
                                        ? data?.movie?.episode_current
                                        : data?.movie?.episode_time}
                                </span>
                                <span>
                                    {data?.movie?.regions
                                        .map((item) => item.name)
                                        .join(', ')}
                                </span>
                            </div>
                            <Paragraph maxLine={2}>
                                {data?.movie?.content ?? ''}
                            </Paragraph>
                        </div>
                        <div className={cx('col', 'c-12', 'l-4')}>
                            <div className={cx('action')}></div>
                            <div className={cx('other-infor')}>
                                <div className={cx('row', 'other-infor-item')}>
                                    <div className={cx('c-4')}>Diễn viên: </div>
                                    <div className={cx('c-8')}>
                                        {data?.movie?.actors
                                            ?.map((item) => item.name)
                                            .join(', ')}
                                    </div>
                                </div>
                                <div className={cx('row', 'other-infor-item')}>
                                    <div className={cx('c-4')}>Đạo diễn: </div>
                                    <div className={cx('c-8')}>
                                        {data?.movie?.directors
                                            ?.map((item) => item.name)
                                            .join(', ')}
                                    </div>
                                </div>
                                <div className={cx('row', 'other-infor-item')}>
                                    <div className={cx('c-4')}>Thể loại: </div>
                                    <div className={cx('c-8')}>
                                        {data?.movie?.categories
                                            ?.map((item) => item.name)
                                            .join(', ')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {data?.movie?.type === 'series' && (
                        <div>
                            <h2 style={{ marginBottom: '15px' }}>
                                Danh sách tập:
                            </h2>
                            <div
                                className={cx(
                                    'row',
                                    'no-gutters',
                                    'episode-list'
                                )}>
                                {renderEpsButton()}
                            </div>
                        </div>
                    )}

                    {!isRelatedMovieLoading &&
                        !isRelatedMovieError &&
                        relatedMovie && (
                            <div>
                                <Carousel
                                    title='Nội dung liên quan
                    '
                                    items={relatedMovie.movies}
                                    itemSpace={10}
                                    slidesToShow={5}
                                    slidesToScroll={2}
                                    imageType='vertical-rectangle'
                                    NextArrow={blackOverlayNextArrow}
                                    PrevArrow={blackOverlayPrevArrow}
                                />
                            </div>
                        )}
                </>
            )}
            <ToastContainer style={{ width: '400px' }} theme='dark' />
        </div>
    );
}

export default WatchMovie;
