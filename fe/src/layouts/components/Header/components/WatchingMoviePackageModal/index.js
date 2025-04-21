import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import ImageAsset from '@/assets/Images';
import styles from './WatchingMoviePackageModal.module.css';
import Button from '@/components/UI/Button';
import useGetAPIData from '@/hooks/useGetAPIData';

import WatchingMoviePackageService from '@/service/web/watchingMoivePackage.service';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { FaRegCircleUser } from 'react-icons/fa6';

const cx = classNames.bind(styles);

function formatCurrency(amount) {
    return amount
        .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
        .replace('₫', 'đ');
}

function WatchingMoviePackageModal({ isOpen, onRequestClose }) {
    const user = useSelector((state) => state.auth.currentUser);
    const { data } = useGetAPIData(
        async () => await WatchingMoviePackageService.getAll(),
        null,
        []
    );
    const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            className={cx('modal')}
            style={{
                overlay: {
                    backgroundColor: 'rgba(10, 9, 10, 0.6)',
                    zIndex: 1000,
                },
                content: {
                    backgroundColor: 'transparent',
                    padding: '0',
                },
            }}>
            <form
                className={cx('wrapper')}
                method='post'
                action='http://localhost:3003/api/waching-movie-package/create-vnpay-payment'>
                <div className={cx('header')}>
                    <span size='small' className={cx('user-icon')}>
                        <FaRegCircleUser />
                    </span>
                    <div className={cx('user-name')}>
                        <h3>{user?.name}</h3>
                        <p>
                            Đăng ký VIP để trải nghiệm các nội dung tuyệt đỉnh
                        </p>
                    </div>
                </div>
                <input
                    hidden
                    name='packageId'
                    value={data?.wachingMoviePackages[selectedPackageIndex].id}
                    onChange={() => {}}
                />
                <div className={cx('body')}>
                    <Slider {...sliderSettings}>
                        {data?.wachingMoviePackages
                            .filter((pkg) => pkg.disable === 0)
                            .map((wachingMoviePackage, index) => (
                                <div
                                    key={index}
                                    className={cx(
                                        'watching-movie-package-item',
                                        {
                                            active:
                                                selectedPackageIndex === index,
                                        }
                                    )}
                                    onClick={() =>
                                        setSelectedPackageIndex(index)
                                    }>
                                    <h3 className={cx('package-name')}>
                                        {wachingMoviePackage.name}
                                    </h3>
                                    <h3>
                                        {formatCurrency(
                                            wachingMoviePackage.discount > 0
                                                ? wachingMoviePackage.price *
                                                      ((100 -
                                                          wachingMoviePackage.discount) /
                                                          100)
                                                : wachingMoviePackage.price
                                        )}
                                    </h3>
                                    {wachingMoviePackage.discount > 0 && (
                                        <del
                                            className={cx(
                                                'price-before-discount'
                                            )}>
                                            {formatCurrency(
                                                wachingMoviePackage.price
                                            )}
                                        </del>
                                    )}
                                </div>
                            ))}
                    </Slider>
                    <div className={cx('benefit-section')}>
                        <h4 className={cx('benefit-section-header')}>
                            Quyền lợi thành viên:
                        </h4>
                        <ul>
                            {data?.wachingMoviePackages[
                                selectedPackageIndex
                            ]?.movie_package_benefits.map((benefit, index) => (
                                <li key={index}>{benefit.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={cx('payment-method')}>
                        <h4 className={cx('payment-method-header')}>
                            Chọn phương thức thanh toán
                        </h4>
                        <div className={cx('payment-method-body')}>
                            <div
                                className={cx('payment-method-item', 'active')}>
                                <div
                                    style={{
                                        backgroundImage: `url(${ImageAsset.vnPay})`,
                                    }}
                                    className={cx('payment-method-img')}></div>
                                <p>VNPAY</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('action')}>
                        <Button primary size='large' type='submit'>
                            Gia nhập VIP
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default WatchingMoviePackageModal;
