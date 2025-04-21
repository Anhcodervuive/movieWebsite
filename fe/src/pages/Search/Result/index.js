import classNames from 'classnames/bind';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './Result.module.css';
import '@/assets/css/grid.css';

import MoiveService from '@/service/web/movie.service';

import SearchInput from '@/pages/Search/components/SearchInput';
import Button from '@/components/UI/Button';
import Image from '@/components/UI/Image';
import useGetAPIData from '@/hooks/useGetAPIData';
import Loading from '@/components/UI/Loading';
import config from '@/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SearchResult() {
    const query = useQuery();
    const q = query.get('q') ?? '';
    const type = query.get('type') ?? '';
    const publishedYear = query.get('publishedYear') ?? '';
    const categoryId = query.get('categoryId') ?? '';
    const regionId = query.get('regionId') ?? '';
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAPIData(
        async () =>
            await MoiveService.filter(
                q,
                type,
                publishedYear,
                categoryId,
                regionId
            ),
        null,
        [q, type, publishedYear, categoryId, regionId]
    );

    const handleSearchWithKey = (key) => {
        navigate(`${config.routes.SearchResult}/?q=${key}`);
    };

    useEffect(() => {
        if (q) {
            document.title = `Tìm kiếm: ${q}`;
        } else {
            document.title = `Tìm kiếm`;
        }
    }, [q]);

    console.log(data);

    if (isLoading || isError) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper', 'grid', 'wide')}>
            <SearchInput
                oldSearchValue={q}
                oldType={type}
                oldPublishedYear={publishedYear}
                oldRegionId={regionId}
                oldCategoryId={categoryId}
            />
            <div className={cx('recommend-keyword')}>
                <span>Từ khóa có liên quan:</span>
                {data &&
                    data?.relatedtags.map((item, index) => (
                        <Button
                            key={index}
                            grey
                            semiRounded
                            onClick={() => handleSearchWithKey(item.name)}>
                            {item.name}
                        </Button>
                    ))}
            </div>
            <div className={cx('movie-results', 'row')}>
                {data &&
                    data?.movies.map((item, index) => (
                        <div
                            key={index}
                            className={cx('movie-item', 'col', 'c-6', 'l-3')}>
                            <Button
                                image
                                to={config.routes.watchMovie.withParam(
                                    item.slug,
                                    item.episodes[0].slug
                                )}>
                                <Image
                                    src={item.poster_url}
                                    type='search-image-result'
                                />
                                <div
                                    className={cx(
                                        'movie-item-image_overlay'
                                    )}></div>
                                <FontAwesomeIcon
                                    className={cx('overlay-icon-play')}
                                    icon={faPlay}
                                />
                            </Button>
                            <Button
                                text
                                classNames={cx('movie-item-name')}
                                to={config.routes.watchMovie.withParam(
                                    item.slug,
                                    item.episodes[0].slug
                                )}>
                                <h3>{item.name}</h3>
                            </Button>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default SearchResult;
