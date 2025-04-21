import classNames from 'classnames/bind';
import styled from 'styled-components';
import propTypes from 'prop-types';

import styles from './Image.module.css';

// Vì thư viện React-slick sẽ css inline cho những children được truyền vào nên
// không thể dùng css inline để set background-image nên sẽ dùng thư viện styled-components thay thể
const StyledDiv = styled.div`
    ${(props) => props.$bgimage && `background-image: url(${props.$bgimage})`};
`;

const cx = classNames.bind(styles);

function Image({ src, alt, type, ...props }) {
    return (
        <StyledDiv
            {...props}
            $bgimage={src}
            type={type}
            className={cx(type, props.className)}></StyledDiv>
    );
}

Image.propTypes = {
    src: propTypes.string.isRequired,
    alt: propTypes.string,
    type: propTypes.oneOf([
        'avt',
        'movie-admin-table',
        'recommend-movie-image',
        'recommend-movie-image-search',
        'search-image-result',
        'stand-rectangle',
        'vertical-rectangle',
    ]),
};

export default Image;
