import classNames from 'classnames/bind';

import styles from './Footer.module.css';
import '@/assets/css/grid.css';
import Button from '@/components/UI/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faYoutube } from '@fortawesome/free-brands-svg-icons';
import ImageAsset from '@/assets/Images';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <hr className={cx('devider')} />
            <div className={cx('container', 'grid', 'wide')}>
                <div className={cx('row', 'no-gutters')}>
                    <div className={cx('logo', 'l-3')}>
                        <img src={ImageAsset.component.logo} alt='logo' />
                    </div>
                    <div className={cx('c-12 l-2')}>
                        <h3 className={cx('item-title')}>Về công ty</h3>
                        <ul>
                            <li>
                                <Button text>Giới thiệu</Button>
                            </li>
                            <li>
                                <Button text>Các gói dịch vụ</Button>
                            </li>
                            <li>
                                <Button text>Liên hệ</Button>
                            </li>
                            <li>
                                <Button text>Trung tâm hỗ trợ</Button>
                            </li>
                            <li>
                                <Button text>Thông tin</Button>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('c-12 l-2')}>
                        <h3 className={cx('item-title')}>Dịch vụ</h3>
                        <ul>
                            <li>
                                <Button text>Gói datadata</Button>
                            </li>
                            <li>
                                <Button text>Quảng cáo</Button>
                            </li>
                            <li>
                                <Button text>Mua gói</Button>
                            </li>
                            <li>
                                <Button text>API phim</Button>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('c-12 l-2')}>
                        <h3 className={cx('item-title')}>Quy định</h3>
                        <ul>
                            <li>
                                <Button text>Điều khoản sử dụng</Button>
                            </li>
                            <li>
                                <Button text>Chính sách thanh toán</Button>
                            </li>
                            <li>
                                <Button text>
                                    Chính sách bảo mật thông tin
                                </Button>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('c-12 l-o-1 l-2')}>
                        <h3 className={cx('item-title')}>Về công ty</h3>
                        <ul>
                            <li>
                                <Button text>
                                    <FontAwesomeIcon icon={faPhone} />
                                    19006600
                                </Button>
                            </li>
                            <li>
                                <Button
                                    text
                                    leftIcon={
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    }>
                                    test@gmail.com
                                </Button>
                            </li>
                            <li>Theo dõi chúng tôi trên</li>
                            <li>
                                <Button text>
                                    <FontAwesomeIcon icon={faYoutube} />
                                </Button>
                                <Button text>
                                    {' '}
                                    <FontAwesomeIcon icon={faFacebook} />
                                </Button>
                            </li>
                            <li></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
