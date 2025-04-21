import classNames from 'classnames/bind';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import styles from './CatalogFrom.module.css';
import '@/assets/css/grid.css';

import MoiveService from '@/service/web/movie.service';

import { SelectBox, Text } from '@/components/UI/Input';
import { useState } from 'react';
import Button from '@/components/UI/Button';
import FindAndAddModal from '@/components/admin/FindAndAddModal';
import Slider from 'react-slick';
import { DefaultToast } from '@/components/UI/ToastMessage';
import Image from '@/components/UI/Image';

const cx = classNames.bind(styles);

const validateRules = {
    name: ['required'],
};

function Form({ data, onSubmit }) {
    const [pageContentInput, setPageContentInput] = useState('');
    const [pageContentTypeInput, setPageContentTypeInput] = useState('normal');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState(
        data ?? {
            name: '',
            slug: '',
            pageContents: [
                {
                    name: 'banner',
                    movies: [],
                    type: 'banner',
                },
            ],
        }
    );
    const [selectedPageContent, setSelectedPageContent] = useState(0);
    const [formErrorMessage, setFormErrorMessage] = useState({});

    const settingsCarousel = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        variableWidth: true,
    };
    console.log(formData);

    const handleValidate = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';
        switch (true) {
            case validateRules[name]?.includes('required'):
                value === ''
                    ? (errorMessage = 'Trường này bắt buộc')
                    : (errorMessage = '');
                break;
            default:
        }
        if (errorMessage) {
            setFormErrorMessage({
                ...formErrorMessage,
                [name]: errorMessage,
            });
        } else if (formErrorMessage && !errorMessage) {
            setFormErrorMessage((prev) => {
                delete prev[name];
                return prev;
            });
        }
        return errorMessage;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const fetcher = async (tag) => {
        if (!tag) {
            return null;
        }
        return await MoiveService.filter(tag);
    };

    const onSearchedItemClick = (item) => {
        const isAdded = formData.pageContents[selectedPageContent].movies
            .map((movie) => movie.name)
            .includes(item.name);

        if (!isAdded) {
            const newMoviesList =
                formData.pageContents[selectedPageContent].movies;
            newMoviesList.push(item);
            const newPageContent = formData.pageContents;
            newPageContent[selectedPageContent] = {
                ...newPageContent[selectedPageContent],
                movies: newMoviesList,
            };
            setFormData({ ...formData, pageContents: newPageContent });
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: 'success',
                    title: 'Thành công',
                    message: 'Phim được thêm thành công',
                },
            });
        } else {
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Phim đã được thêm vào rồi',
                },
            });
        }
    };

    return (
        <>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    for (let i = 0; i < Object.keys(formData).length; i++) {
                        let key = Object.keys(formData)[i];
                        let errorMessage = handleValidate({
                            target: { name: key, value: formData[key] },
                        });
                        if (errorMessage) {
                            toast(DefaultToast, {
                                style: { width: '400px' },
                                hideProgressBar: true,
                                data: {
                                    type: 'error',
                                    title: 'Lỗi',
                                    message:
                                        'Vui lòng nhập thông tin theo yêu cầu từng trường',
                                },
                            });
                            return;
                        }
                    }
                    await onSubmit(formData);
                }}
                className={cx('wrapper', 'row', 'no-gutters')}>
                <div
                    className={cx('form-control', 'c-4', 'col')}
                    style={{ marginBottom: '20px' }}>
                    <label htmlFor='name'>name:</label>
                    <Text
                        id='name'
                        name='name'
                        placeholder='Nhập vào tên catalog'
                        value={formData.name}
                        onChange={(e) => {
                            handleChange(e);
                            handleValidate(e);
                        }}
                    />
                    {formErrorMessage.name && (
                        <span className={cx('error-message')}>
                            {formErrorMessage.name}
                        </span>
                    )}
                </div>
                <div
                    className={cx('form-control', 'c-4', 'col')}
                    style={{ marginBottom: '20px' }}>
                    <label htmlFor='slug'>slug:</label>
                    <Text
                        id='slug'
                        name='slug'
                        placeholder='Nhập vào slug catalog'
                        value={formData.slug}
                        onChange={(e) => {
                            handleChange(e);
                            handleValidate(e);
                        }}
                    />
                    {formErrorMessage?.slug && (
                        <span className={cx('error-message')}>
                            {formErrorMessage?.slug}
                        </span>
                    )}
                </div>
                <div
                    className={cx(
                        'c-12',
                        'col',
                        'row',
                        'no-gutters',
                        'add-content-panel'
                    )}>
                    <div className={cx('form-control', 'c-4')}>
                        <Text
                            id='contentName'
                            name='name'
                            placeholder='Nhập vào tên content'
                            value={pageContentInput}
                            onChange={(e) =>
                                setPageContentInput(e.target.value)
                            }
                        />
                    </div>
                    <div className={cx('form-control', 'c-2')}>
                        <SelectBox
                            name='content_page_type'
                            value={pageContentTypeInput}
                            options={[
                                {
                                    label: 'banner',
                                    value: 'banner',
                                },
                                {
                                    label: 'normal',
                                    value: 'normal',
                                },
                            ]}
                            onChange={(e) =>
                                setPageContentTypeInput(e.target.value)
                            }
                        />
                    </div>
                    <Button
                        primary
                        classNames={cx('c-2', 'add-content-btn')}
                        onClick={(e) => {
                            e.preventDefault();
                            const isAddedBanner = formData.pageContents.find(
                                (pageContent) => pageContent.type === 'banner'
                            );
                            if (
                                pageContentTypeInput === 'banner' &&
                                isAddedBanner
                            ) {
                                toast(DefaultToast, {
                                    style: { width: '400px' },
                                    hideProgressBar: true,
                                    data: {
                                        type: 'error',
                                        title: 'Lỗi',
                                        message:
                                            'Trong 1 trang chỉ được tồn tại 1 banner',
                                    },
                                });
                                return;
                            }
                            setFormData({
                                ...formData,
                                pageContents: [
                                    ...formData.pageContents,
                                    {
                                        name: pageContentInput,
                                        type: pageContentTypeInput,
                                        movies: [],
                                    },
                                ],
                            });
                            setSelectedPageContent(
                                formData?.pageContents?.length ?? 0
                            );
                        }}>
                        Thêm nội dung hiển thị
                    </Button>
                </div>

                {formData?.pageContents?.length > 1 ? (
                    <Slider
                        {...settingsCarousel}
                        className={cx('c-5', 'page-content-carousel-header')}>
                        {formData.pageContents.map((pageContent, index) => (
                            <button
                                key={index}
                                className={cx(
                                    'page-content-carousel-header-item',
                                    {
                                        active: index === selectedPageContent,
                                    }
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedPageContent(index);
                                }}>
                                {pageContent.name}
                            </button>
                        ))}
                    </Slider>
                ) : (
                    formData?.pageContents?.length === 1 && (
                        <button
                            className={cx(
                                'page-content-carousel-header-item',
                                'active'
                            )}
                            onClick={(e) => {
                                e.preventDefault();
                            }}>
                            {formData.pageContents[0].name}
                        </button>
                    )
                )}

                {formData?.pageContents?.length >= 1 && (
                    <div className={cx('c-12', 'page-content')}>
                        <div className={cx('row', 'no-gutters')}>
                            <Button
                                primary
                                classNames={cx('c-2')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsAddModalOpen(true);
                                }}>
                                Thêm phim
                            </Button>
                            <Button
                                grey
                                classNames={cx('c-2', 'add-movie-btn')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setFormData({
                                        ...formData,
                                        pageContents:
                                            formData.pageContents.filter(
                                                (item, index) =>
                                                    index !==
                                                    selectedPageContent
                                            ),
                                    });
                                    if (selectedPageContent > 0)
                                        setSelectedPageContent(
                                            (prev) => prev - 1
                                        );
                                }}>
                                Xóa Content
                            </Button>
                        </div>
                        <table className={cx('light-table')}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Publish year</th>
                                    <th>Current episode</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.pageContents[
                                    selectedPageContent
                                ]?.movies?.map((movie, index) => (
                                    <tr key={index}>
                                        <td>{index}</td>
                                        <td>
                                            <Image
                                                src={movie.thumb_url}
                                                alt={movie.name}
                                                type='movie-admin-table'
                                            />
                                        </td>
                                        <td>{movie.name}</td>
                                        <td>{movie.publish_year}</td>
                                        <td>{movie.episode_current}</td>
                                        <td>
                                            <Button
                                                remove
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newMoviesList =
                                                        formData.pageContents[
                                                            selectedPageContent
                                                        ].movies;
                                                    newMoviesList.splice(
                                                        index,
                                                        1
                                                    );
                                                    const newPageContent =
                                                        formData.pageContents;
                                                    newPageContent[
                                                        selectedPageContent
                                                    ] = {
                                                        name: newPageContent[
                                                            selectedPageContent
                                                        ].name,
                                                        type: newPageContent[
                                                            selectedPageContent
                                                        ].type,
                                                        movies: newMoviesList,
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        pageContents:
                                                            newPageContent,
                                                    });
                                                }}>
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <Button success type='submit'>
                    Lưu
                </Button>
            </form>
            <FindAndAddModal
                isOpen={isAddModalOpen}
                onRequestClose={() => setIsAddModalOpen(false)}
                fetcher={fetcher}
                showedResultAttributes={['name']}
                onSearchedItemClick={onSearchedItemClick}
            />
        </>
    );
}

export default Form;
