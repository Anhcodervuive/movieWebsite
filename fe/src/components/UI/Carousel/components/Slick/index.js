import classNames from 'classnames/bind';

import styles from '../../Default/Default.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const RecommendMovieCarouselNextArrow = (props) => {
    const { style, onClick } = props;
    return (
        <div
            style={{ ...style, display: 'block' }}
            onClick={onClick}
            className={cx('simple-slick-next', 'custom-prev-arrow')}>
            <FontAwesomeIcon icon={faAngleRight} />
        </div>
    );
};

const RecommendMovieCarouselPrevArrow = (props) => {
    const { style, onClick } = props;

    return (
        <div
            style={{ ...style, display: 'block' }}
            className={cx('simple-slick-prev', 'custom-prev-arrow')}
            onClick={onClick}>
            <FontAwesomeIcon icon={faAngleLeft} />
        </div>
    );
};

const blackOverlayNextArrow = (props) => {
    const { style, onClick } = props;

    return (
        <div
            style={{ ...style, display: 'block' }}
            className={cx('black-overlay-slick-next', 'custom-prev-arrow')}
            onClick={onClick}>
            <FontAwesomeIcon icon={faAngleRight} />
        </div>
    );
};

const blackOverlayPrevArrow = (props) => {
    const { style, onClick } = props;

    return (
        <div
            style={{ ...style, display: 'block' }}
            className={cx('black-overlay-slick-prev', 'custom-prev-arrow')}
            onClick={onClick}>
            <FontAwesomeIcon icon={faAngleLeft} />
        </div>
    );
};

export {
    RecommendMovieCarouselNextArrow,
    RecommendMovieCarouselPrevArrow,
    blackOverlayNextArrow,
    blackOverlayPrevArrow,
};
