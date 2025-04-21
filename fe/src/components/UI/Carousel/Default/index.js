import classNames from 'classnames/bind';
import propTypes from 'prop-types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import styles from './Default.module.css';
import Image from '@/components/UI/Image';
import Button from '@/components/UI/Button';
import '@/assets/css/slickSlider.css';
import config from '@/config';

const cx = classNames.bind(styles);

function Carousel({
    items = [],
    title,
    imageType,
    autoplaySpeed = 5000,
    slidesToShow = 1,
    slidesToScroll = 1,
    autoplay = false,
    PrevArrow,
    NextArrow,
}) {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow,
        slidesToScroll,
        autoplay,
        autoplaySpeed,

        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: slidesToShow,
                    slidesToScroll: slidesToScroll,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
        ],
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
            <h2 className={cx('title')}>{title}</h2>
            <Slider {...settings}>
                {items.map((item, index) => (
                    <div key={index} className={cx('movie-item')}>
                        {item.waching_movie_packages?.length > 0 && (
                            <div className={cx('vip-label')}>VIP</div>
                        )}
                        <Button
                            classNames={cx('movie-image-button')}
                            to={config.routes.watchMovie.withParam(
                                item.slug,
                                renderSlugEpisode(item.episodes)
                            )}>
                            <Image src={item.poster_url} type={imageType} />
                            <div
                                className={cx(
                                    'movie-item-image_overlay'
                                )}></div>
                            <FontAwesomeIcon
                                className={cx('overlay-icon-play')}
                                icon={faPlay}
                            />
                        </Button>
                        <div className={cx('movie-infor')}>{item.name}</div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

Carousel.propTypes = {
    autoplaySpeed: propTypes.number,
    slidesToShow: propTypes.number,
    slidesToScroll: propTypes.number,
    autoplay: propTypes.bool,
    imageType: propTypes.oneOf([
        'recommend-movie-image',
        'stand-rectangle',
        'vertical-rectangle',
    ]),
};

export default Carousel;
