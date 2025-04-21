import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';

import styles from './WatchingMoviePackage.module.css';

import BillService from '@/service/web/bill.service';
import useGetAPIData from '@/hooks/useGetAPIData';
import InforDropDown from '@/components/UI/InforDropDown';
import Button from '@/components/UI/Button';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const now = new Date();

    // Tạo đối tượng cho hôm nay và hôm qua
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
    );
    // Lấy giờ và phút
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');

    if (dateTime === today) {
        return `Hôm nay ${hours < 10 ? `0${hours}` : hours}:${minutes}`;
    } else if (dateTime === yesterday) {
        return `Hôm qua ${hours < 10 ? `0${hours}` : hours}:${minutes}`;
    } else {
        // Định dạng dd-mm-yyyy giờ phút
        const day = dateTime.getDate().toString().padStart(2, '0');
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = dateTime.getFullYear();
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
}

function formatCurrency(amount) {
    return amount
        .toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
        .replace('₫', 'đ');
}

function WatchingMoviePackage() {
    const user = useSelector((state) => state.auth.currentUser);
    const { data: dataBills, isLoading: isLoadingBills } = useGetAPIData(
        async () => (user ? await BillService.getByUserId(user.id) : null)
    );
    const [isHistoryBillDropDown, setIsHistoryBillDropDown] = useState(
        dataBills?.bills.length > 0
    );
    const [isCurrentUsingPackageDropDown, setIsCurrentUsingPackageDropDown] =
        useState(true);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('bought-watching-movie-package')}>
                <h4
                    className={cx('bought-watching-movie-package-header')}
                    onClick={() => setIsHistoryBillDropDown((prev) => !prev)}>
                    <span>Hóa đơn đã thanh toán</span>
                    {dataBills?.bills.length > 0 && (
                        <Button size='small'>
                            {isHistoryBillDropDown ? (
                                <FontAwesomeIcon icon={faCaretUp} />
                            ) : (
                                <FontAwesomeIcon icon={faCaretDown} />
                            )}
                        </Button>
                    )}
                </h4>
                {isHistoryBillDropDown && (
                    <div className={cx('bought-watching-movie-package-body')}>
                        {isLoadingBills && dataBills?.bills.length === 0 && (
                            <p>There are no records to show</p>
                        )}

                        {dataBills?.bills.length > 0 && (
                            <table>
                                <tbody>
                                    {dataBills?.bills.map((bill, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}.</td>
                                            <td>
                                                <InforDropDown
                                                    HeaderComp={
                                                        <h5>{bill.infor}</h5>
                                                    }>
                                                    <ul
                                                        className={cx(
                                                            'bill-item'
                                                        )}>
                                                        <li>
                                                            Giá tiền:{' '}
                                                            {formatCurrency(
                                                                bill.amount
                                                            )}
                                                        </li>
                                                        <li>
                                                            Loại thẻ:{' '}
                                                            {bill.card_type}
                                                        </li>
                                                        <li>
                                                            Ngân hàng:{' '}
                                                            {bill.bank_code}
                                                        </li>
                                                        <li>
                                                            Mã giao dịch:{' '}
                                                            {bill.bank_tran_no}
                                                        </li>
                                                        <li>
                                                            Ngày tạo:{' '}
                                                            {formatDateTime(
                                                                bill.pay_date
                                                            )}
                                                        </li>
                                                    </ul>
                                                </InforDropDown>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
            <div className={cx('watching-movie-package-have-been-using')}>
                <h4
                    className={cx(
                        'watching-movie-package-have-been-using-header'
                    )}
                    onClick={() =>
                        setIsCurrentUsingPackageDropDown((prev) => !prev)
                    }>
                    <span>Gói dịch vụ đang sử dụng</span>
                    <Button size='small'>
                        {isCurrentUsingPackageDropDown ? (
                            <FontAwesomeIcon icon={faCaretUp} />
                        ) : (
                            <FontAwesomeIcon icon={faCaretDown} />
                        )}
                    </Button>
                </h4>
                {isCurrentUsingPackageDropDown && (
                    <div
                        className={cx(
                            'watching-movie-package-have-been-using-body'
                        )}>
                        {user?.watchingMoviePackages?.length === 0 && (
                            <p>There are no records to show</p>
                        )}
                        {user?.watchingMoviePackages?.length > 0 && (
                            <table>
                                <tbody>
                                    {user?.watchingMoviePackages.map(
                                        (pkg, index) => (
                                            <tr key={`pkg-${index}`}>
                                                <td>{index + 1}.</td>

                                                <td>
                                                    <InforDropDown
                                                        HeaderComp={
                                                            <span>
                                                                Gói: {pkg.name}
                                                            </span>
                                                        }>
                                                        <ul
                                                            className={cx(
                                                                'current-using-package-item'
                                                            )}>
                                                            <li>
                                                                Hết hạn:{' '}
                                                                {formatDateTime(
                                                                    pkg
                                                                        .user_has_waching_package
                                                                        .expired_at
                                                                )}
                                                            </li>
                                                        </ul>
                                                    </InforDropDown>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WatchingMoviePackage;
