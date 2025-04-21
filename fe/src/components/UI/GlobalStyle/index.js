import propTypes from 'prop-types';

import './GlobalStyle.module.css';

function GlobalStyle({ children }) {
    return children;
}

GlobalStyle.propTypes = {
    children: propTypes.node,
};

export default GlobalStyle;
