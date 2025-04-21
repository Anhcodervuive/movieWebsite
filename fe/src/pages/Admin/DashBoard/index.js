import { useMemo, useState } from 'react';
import Slider from 'react-slick';
import classNames from 'classnames/bind';
import { FaEye } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import styles from './DashBoard.module.css';

import DashBoardService from '@/service/admin/dashboard.service';
import useGetAPIData from '@/hooks/useGetAPIData';
import { SelectBox } from '@/components/UI/Input';
import Table from '@/components/admin/Table';

const cx = classNames.bind(styles);

ChartJS.register(ArcElement, Tooltip, Legend);

const chartAreaColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
];

function DashBoard() {
    const [topCategoriesFilter, setTopCategoriesFilter] =
        useState('view_total');
    const [topViewMovieFilter, setTopViewMovieFilter] = useState('view_total');
    const { data: dataView, isLoading: isDataViewLoading } = useGetAPIData(
        async () => await DashBoardService.getTotalViewOfDayWeekMonthAll(),
        null,
        []
    );
    const { data: dataTopRateMovie, isLoading: isLoadingToRateMovies } =
        useGetAPIData(
            async () => await DashBoardService.getTopRateMovies(),
            null,
            []
        );

    const { data: dataTopViewCategory, isLoading: isLoadingTopViewCategory } =
        useGetAPIData(
            async () =>
                await DashBoardService.getTopViewCategory(topCategoriesFilter),
            null,
            [topCategoriesFilter]
        );

    const { data: dataUser, isLoading: isLoadingDataUser } = useGetAPIData(
        async () => await DashBoardService.getQuantityVipAndNonVipUser(),
        null,
        []
    );

    const { data: dataTopViewMovie, isLoading: isLoadingToViewMovie } =
        useGetAPIData(
            async () =>
                await DashBoardService.getTopViewMovie(topViewMovieFilter),
            null,
            [topViewMovieFilter]
        );

    const dataChartOfUser = useMemo(
        () => ({
            labels: [],
            datasets: [
                {
                    label: 'Quantity',
                    data: [dataUser?.normalUser, dataUser?.vipUser],
                    backgroundColor: chartAreaColors,
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        }),
        [dataUser]
    );

    const dataChartTopViewCategory = useMemo(
        () => ({
            labels: [],
            datasets: [
                {
                    label: 'View',
                    data:
                        dataTopViewCategory?.categories?.map(
                            (category) => category.totalView
                        ) ?? [],
                    backgroundColor: chartAreaColors,
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        }),
        [dataTopViewCategory]
    );

    console.log(dataTopViewCategory);

    const settings = {
        dots: false,
        infinite: true,
        speed: 2000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        pauseOnHover: false,
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('dashboard')}>
                {/* Thống kê trên cùng */}

                {!isDataViewLoading && (
                    <div className={cx('stats')}>
                        <div className={cx('stat-item')}>
                            <h4 className={cx('stat-item-header')}>
                                <span>View trong ngày: </span>
                                <FaEye style={{ color: 'green' }} />
                            </h4>
                            <p>
                                <strong>{dataView?.totalViewDay}</strong>
                            </p>
                        </div>
                        <div className={cx('stat-item')}>
                            <h4 className={cx('stat-item-header')}>
                                <span>View trong tuần: </span>
                                <FaEye style={{ color: 'greenyellow' }} />
                            </h4>
                            <p>
                                <strong>{dataView?.totalViewWeek}</strong>
                            </p>
                        </div>
                        <div className={cx('stat-item')}>
                            <h4 className={cx('stat-item-header')}>
                                <span>View trong tháng: </span>
                                <FaEye style={{ color: 'red' }} />
                            </h4>
                            <p>
                                <strong>{dataView?.totalViewMonth}</strong>
                            </p>
                        </div>
                        <div className={cx('stat-item')}>
                            <h4 className={cx('stat-item-header')}>
                                <span>View tổng: </span>
                                <FaEye style={{ color: 'blueviolet' }} />
                            </h4>
                            <p>
                                <strong>{dataView?.totalViewTotal}</strong>
                            </p>
                        </div>
                    </div>
                )}

                {/* Mục xếp hạng phim */}
                {!isLoadingToRateMovies && (
                    <div className={cx('top-rated')}>
                        <h2>Những phim được đánh giá cao</h2>
                        <Slider {...settings} className={cx('top-rated-list')}>
                            {dataTopRateMovie?.movies.map((movie, index) => (
                                <div className={cx('movie-item')} key={index}>
                                    <div
                                        className={cx('movie-item-image')}
                                        style={{
                                            backgroundImage: `url(${movie.thumb_url})`,
                                        }}></div>
                                    <h4>{movie.name}</h4>
                                    <p className={cx('view-infor')}>
                                        <FaEye />
                                        {movie.view_total}
                                    </p>
                                    <div className={cx('rate-infor')}>
                                        <span>
                                            Lượt đánh giá: {movie.rating_count}
                                        </span>
                                        <span>
                                            Sao trung bình: {movie.rating_star}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}

                {/* Biểu đồ */}
                <div className={cx('top-categories')}>
                    <div className={cx('top-categories-header')}>
                        <h3>Những thể loại được xem nhiều:</h3>
                        <SelectBox
                            value={topCategoriesFilter}
                            options={[
                                {
                                    label: 'Tất cả',
                                    value: 'view_total',
                                },
                                {
                                    label: 'ngày',
                                    value: 'view_day',
                                },
                                {
                                    label: 'Tuần',
                                    value: 'view_week',
                                },
                                {
                                    label: 'Tháng',
                                    value: 'view_month',
                                },
                            ]}
                            onChange={(e) =>
                                setTopCategoriesFilter(e.target.value)
                            }></SelectBox>
                    </div>
                    <div className={cx('top-categories-chart-bar')}>
                        {!isLoadingTopViewCategory && (
                            <>
                                <div className={cx('chart-area')}>
                                    <Pie data={dataChartTopViewCategory} />
                                </div>
                                <div className={cx('chart-infor', 'row')}>
                                    {dataTopViewCategory?.categories.map(
                                        (category, index) => (
                                            <div
                                                key={category.id}
                                                className={cx(
                                                    'chart-infor-item',
                                                    'c-6'
                                                )}>
                                                <div
                                                    className={cx(
                                                        'color-display-in-chart'
                                                    )}
                                                    style={{
                                                        backgroundColor:
                                                            chartAreaColors[
                                                                index
                                                            ],
                                                    }}></div>
                                                <span>{category.name}</span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className={cx('user-statistic')}>
                    <h4 className={cx('user-statistic-header')}>
                        Danh sách người dùng:
                    </h4>
                    <div className={cx('user-chart-bar')}>
                        {!isLoadingDataUser && (
                            <>
                                <div className={cx('chart-area')}>
                                    <Pie data={dataChartOfUser} />
                                </div>
                                <div className={cx()}>
                                    <div className={cx('chart-infor-item')}>
                                        {' '}
                                        <div
                                            className={cx(
                                                'color-display-in-chart'
                                            )}
                                            style={{
                                                backgroundColor:
                                                    chartAreaColors[0],
                                            }}></div>{' '}
                                        Vip
                                    </div>
                                    <div className={cx('chart-infor-item')}>
                                        <div
                                            className={cx(
                                                'color-display-in-chart'
                                            )}
                                            style={{
                                                backgroundColor:
                                                    chartAreaColors[1],
                                            }}></div>{' '}
                                        Normal
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Lịch sử xem phim */}
                <div className={cx('top-viewed')}>
                    <div className={cx('top-viewed-header')}>
                        <h2>Phim được xem nhiều</h2>
                        <SelectBox
                            value={topViewMovieFilter}
                            options={[
                                {
                                    label: 'Tất cả',
                                    value: 'view_total',
                                },
                                {
                                    label: 'ngày',
                                    value: 'view_day',
                                },
                                {
                                    label: 'Tuần',
                                    value: 'view_week',
                                },
                                {
                                    label: 'Tháng',
                                    value: 'view_month',
                                },
                            ]}
                            onChange={(e) =>
                                setTopViewMovieFilter(e.target.value)
                            }></SelectBox>
                    </div>
                    {!isLoadingToViewMovie && (
                        <Table
                            data={dataTopViewMovie?.movies}
                            attributesToShow={[
                                'thumb_url',
                                'name',
                                'type',
                                'publish_year',
                                topViewMovieFilter,
                            ]}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
