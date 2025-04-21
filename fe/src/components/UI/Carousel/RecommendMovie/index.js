import classNames from 'classnames/bind';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './RecommendMovie.module.css';
import ImageAsset from '@/assets/Images';

import Button from '@/components/UI/Button';
import Image from '@/components/UI/Image';
import config from '@/config';

const cx = classNames.bind(styles);

function RecommendMovieCarousel({
    items = [],

    PrevArrow,
    NextArrow,
}) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        pauseOnHover: false,
        autoplaySpeed: 5000,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    };

    const renderSlugEpisode = (episodes) => {
        const defaultEpisodeSlug = episodes[0].slug;

        const latedEpisodeUserWatched = episodes.filter(
            (episode) => episode.user_watch_episodes.length > 0
        );

        latedEpisodeUserWatched.sort(
            (a, b) =>
                new Date(b.user_watch_episodes[0].updated_at) -
                new Date(a.user_watch_episodes[0].updated_at)
        );

        if (latedEpisodeUserWatched.length > 0) {
            return latedEpisodeUserWatched[0].slug;
        } else {
            return defaultEpisodeSlug;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Slider {...settings}>
                {items.map((value, index) => (
                    <div key={index} className={cx('movie-item')}>
                        <Image
                            type='recommend-movie-image'
                            src={value.poster_url}
                        />

                        <div className={cx('movie-infor')}>
                            <h1 className={cx('movie-name')}>{value.name}</h1>
                            <div className={cx('movie-suInfor')}>
                                {value.waching_movie_packages.length > 0 && (
                                    <span className={cx('vip-label')}>VIP</span>
                                )}
                                <span>{value.publish_year}</span>
                                <span>{value.episode_current}</span>
                                <span>
                                    {value.regions.map(
                                        (value, index, array) =>
                                            `${value.name}` +
                                            (array.length - 1 > index
                                                ? ', '
                                                : '')
                                    )}
                                </span>
                            </div>
                            <div className={cx('movie-action')}>
                                <Button
                                    primary
                                    size='large'
                                    to={config.routes.watchMovie.withParam(
                                        value.slug,
                                        renderSlugEpisode(value.episodes)
                                    )}>
                                    Xem ngay
                                </Button>
                            </div>
                        </div>
                        <div
                            className={cx('blur-wrapper')}
                            style={{
                                backgroundImage: `url(${ImageAsset.component.bgBlur})`,
                            }}></div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default RecommendMovieCarousel;
