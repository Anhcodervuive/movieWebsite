import classNames from 'classnames/bind';

import styles from './Paragraph.module.css';
import { useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);

function stripHTML(input) {
    return input.replace(/<\/?[^>]+(>|$)/g, '');
}

function Paragraph({ maxLine, children, ...props }) {
    const [isLimitLine, setIsLimitLine] = useState(!!maxLine);
    const [disPlayLimmitBtn, setDisPlayLimmitBtn] = useState(true);
    const paragraphRef = useRef();
    const wrapperRef = useRef();

    useEffect(() => {
        if (paragraphRef.current && wrapperRef.current) {
            const contentStyle = window.getComputedStyle(paragraphRef.current);
            const paragraphLineHeight = parseInt(contentStyle.lineHeight, 10);
            const paragraphHeight = parseInt(contentStyle.height, 10);

            if (paragraphHeight <= maxLine * paragraphLineHeight) {
                setDisPlayLimmitBtn(false);
            }

            if (isLimitLine) {
                wrapperRef.current.style.maxHeight = `${
                    maxLine * paragraphLineHeight
                }px`;
            } else {
                wrapperRef.current.style.maxHeight = 'none';
            }
        }
    }, [disPlayLimmitBtn, isLimitLine, maxLine]);

    return (
        <div ref={wrapperRef} {...props} className={cx('wrapper')}>
            <p ref={paragraphRef} className={cx('content')}>
                {stripHTML(children)}
            </p>
            {maxLine && disPlayLimmitBtn && (
                <button
                    className={cx('toogle-button', {
                        'more-content-button': isLimitLine,
                        'hide-content-button': !isLimitLine,
                    })}
                    onClick={() => setIsLimitLine(!isLimitLine)}>
                    {isLimitLine ? '...xem thêm' : 'ẩn bớt'}
                </button>
            )}
        </div>
    );
}

export default Paragraph;
