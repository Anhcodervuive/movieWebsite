import classNames from 'classnames/bind';

import styles from './SearchHome.module.css';
import '@/assets/css/grid.css';

import useGetAPIData from '@/hooks/useGetAPIData';

import MovieService from '@/service/web/movie.service';
import TagService from '@/service/web/tag.service';

import SearchInput from '@/pages/Search/components/SearchInput';
import Image from '@/components/UI/Image';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';
import config from '@/config';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function SearchHome() {
    const {
        data: recommendMovies,
        isLoading: isLoadingRecommendMoive,
        isError: isErrorRecommendMovie,
    } = useGetAPIData(
        async () => await MovieService.getRecommenededMovie(),
        null
    );

    const {
        data: recommendTag,
        isLoading: isLoadingRecommendTag,
        isError: isErrorRecommendTag,
    } = useGetAPIData(async () => await TagService.getRecommenededTag(), null);

    useEffect(() => {
        document.title = 'Tìm kiếm';
    }, []);

    if (
        isLoadingRecommendMoive ||
        isErrorRecommendMovie ||
        isLoadingRecommendTag ||
        isErrorRecommendTag
    ) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper', 'grid', 'wide')}>
            <SearchInput />
            <div className={cx('content', 'row', 'no-gutters')}>
                <div className={cx('recommend-result', 'c-12', 'l-7')}>
                    <h2 className={cx('title')}>Xu hướng gần đây</h2>
                    <div className={cx('recommend-movie-list')}>
                        {!isLoadingRecommendMoive &&
                            recommendMovies &&
                            recommendMovies.movies.map((item, index) => (
                                <div
                                    className={cx('recommend-movie-item')}
                                    key={index}>
                                    <Button
                                        to={config.routes.watchMovie.withParam(
                                            item.slug,
                                            item.type === 'series'
                                                ? 'tap-01'
                                                : 'tap-full'
                                        )}>
                                        <Image
                                            type='recommend-movie-image-search'
                                            src={item.poster_url}
                                        />
                                    </Button>
                                    <div className={cx('movie-item-infor')}>
                                        <Button
                                            text
                                            classNames={cx('movie-name')}
                                            to={config.routes.watchMovie.withParam(
                                                item.slug,
                                                item.type === 'series'
                                                    ? 'tap-01'
                                                    : 'tap-full'
                                            )}>
                                            {item.name}
                                        </Button>
                                        <div className={cx('movie-subinfor')}>
                                            <span>{item.publish_year}</span>
                                            <span>{item.episode_current}</span>
                                            <span>{item.regions[0].name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                <div className={cx('recommend-keyword', 'c-12', 'l-5')}>
                    <h2 className={cx('title')}>Tìm kiếm hàng đầu</h2>
                    <div className={cx('recommend-keyword-list')}>
                        {recommendTag.tags.map((item, index) => (
                            <Button
                                to={`${config.routes.SearchResult}?q=${item.name}`}
                                dark
                                semiRounded
                                key={index}
                                classNames={cx('recommend-keyword-item')}>
                                {item.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchHome;
