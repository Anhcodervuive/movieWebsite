import { useEffect } from 'react';
import classNames from 'classnames/bind';
import { toast, ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';

import '@/assets/css/grid.css';

import styles from './MovieList.module.css';

import useGetAPIData from '@/hooks/useGetAPIData';
import CatalogService from '@/service/admin/catalog.service';
import Loading from '@/components/UI/Loading';
import {
    Carousel as DefaultCarousel,
    RecommendMovieCarousel,
    RecommendMovieCarouselNextArrow,
    RecommendMovieCarouselPrevArrow,
    blackOverlayNextArrow,
    blackOverlayPrevArrow,
} from '@/components/UI/Carousel';
import { DefaultToast } from '@/components/UI/ToastMessage';

const cx = classNames.bind(styles);

const IMAGE_TYPE_CAROUSEL = [
    'recommend-movie-image',
    'stand-rectangle',
    'vertical-rectangle',
];

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function MovieList({ catalog, ...props }) {
    const { data, isLoading, isError } = useGetAPIData(
        async () => await CatalogService.getCatalog(catalog?.id),
        null,
        [catalog]
    );
    const query = useQuery();
    const message = query.get('message');
    const type = query.get('type');

    useEffect(() => {
        if (catalog?.name) {
            document.title = catalog.name;
        }
    }, [catalog.name]);

    useEffect(() => {
        if (message && !isLoading) {
            console.log(type, message);

            toast(DefaultToast, {
                containerId: 'default_layout',
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: type,
                    title: type,
                    message: message,
                },
            });
        }
    }, [message, type, isLoading]);

    const getImageTypeCarousel = () => {
        const randomIndex = Math.floor(
            Math.random() * IMAGE_TYPE_CAROUSEL.length
        );
        return IMAGE_TYPE_CAROUSEL[randomIndex];
    };

    if (isLoading || isError) {
        return <Loading />;
    }

    return (
        <main className={cx('wrapper', 'grid', 'wide')}>
            <div>
                {data?.catalog.content_sections
                    .filter(
                        (content_section) => content_section.type === 'banner'
                    )
                    .map((content_section, index) => {
                        return (
                            <RecommendMovieCarousel
                                key={index}
                                items={content_section.movies}
                                NextArrow={RecommendMovieCarouselNextArrow}
                                PrevArrow={RecommendMovieCarouselPrevArrow}
                            />
                        );
                    })}
                {data?.catalog.content_sections
                    .filter(
                        (content_section) => content_section.type !== 'banner'
                    )
                    .map((content_section, index) => {
                        return (
                            <DefaultCarousel
                                key={index}
                                title={content_section.name}
                                items={content_section.movies}
                                itemSpace={10}
                                slidesToShow={5}
                                slidesToScroll={1}
                                imageType={getImageTypeCarousel()}
                                NextArrow={blackOverlayNextArrow}
                                PrevArrow={blackOverlayPrevArrow}
                            />
                        );
                    })}
            </div>
            <ToastContainer theme='dark' />
        </main>
    );
}

export default MovieList;
