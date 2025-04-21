import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Button.module.css';

const cx = classNames.bind(styles);
function Button({
    vipLabel,
    episodeBtn,
    children,
    active,
    to,
    href,
    primary,
    grey,
    dark,
    success,
    warning,
    infor,
    edit,
    remove,
    text,
    textPrimary,
    size = 'medium',
    semiRounded,
    image,
    classNames,
    disable,
    onClick,
    leftIcon,
    rightIcon,
    ...passProps
}) {
    let Comp = 'button';

    const props = {
        onClick,
        ...passProps,
    };

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }

    if (disable) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function')
                delete props[key];
        });
    }

    const classes = cx(classNames, 'wrapper', size, {
        primary,
        dark,
        disable,
        text,
        active,
        success,
        warning,
        infor,
        edit,
        remove,
        'text-primary': textPrimary,
        grey,
        image,
        'semi-rounded': semiRounded,
        'vip-label': vipLabel,
        'episode-btn': episodeBtn,
    });

    return (
        <Comp className={classes} {...props}>
            {image ? (
                children
            ) : (
                <>
                    {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
                    <span className={cx('title')}>{children}</span>
                    {rightIcon && (
                        <span className={cx('icon')}>{rightIcon}</span>
                    )}
                </>
            )}
        </Comp>
    );
}

Button.propTypes = {
    children: propTypes.node.isRequired,
    to: propTypes.string,
    href: propTypes.string,
    primary: propTypes.bool,
    dark: propTypes.bool,
    grey: propTypes.bool,
    success: propTypes.bool,
    warning: propTypes.bool,
    edit: propTypes.bool,
    remove: propTypes.bool,
    semiRounded: propTypes.bool,
    image: propTypes.bool,
    text: propTypes.bool,
    textPrimary: propTypes.bool,
    size: propTypes.oneOf(['small', 'medium', 'large']),
    classNames: propTypes.string,
    disabled: propTypes.bool,
    onClick: propTypes.func,
};

export default Button;
