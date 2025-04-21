import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './DefaultLayout.module.css';
import { ToastContainer } from 'react-toastify';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>{children}</div>
            <Footer />
            <ToastContainer theme='dark' containerId={'default_layout'} />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node,
};

export default DefaultLayout;
