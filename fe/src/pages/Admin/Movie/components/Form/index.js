import classNames from 'classnames/bind';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import styles from './MovieForm.module.css';
import { SelectBox, Text } from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import { DefaultToast } from '@/components/UI/ToastMessage';
import Textarea from '@/components/UI/Input/Textarea';
import FindAndAddModal from '@/components/admin/FindAndAddModal';

import ActorService from '@/service/admin/actor.service';
import DirectorService from '@/service/admin/director.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';

const cx = classNames.bind(styles);

const validateRules = {
    name: ['required'],
    originName: ['required'],
    type: ['required'],
    status: ['required'],
};

function groupByType(array) {
    const result = [];
    const serverMap = {};

    array.forEach((item) => {
        if (!serverMap[item.server]) {
            serverMap[item.server] = {
                name: item.server,
                epsList: [],
            };
            result.push(serverMap[item.server]);
        }
        serverMap[item.server].epsList.push(item);
    });

    return result;
}

function getAllEps(servers) {
    const allEps = new Set();

    servers.forEach((server) => {
        server.epsList
            .map((episode) => episode.name)
            .forEach((eps) => {
                allEps.add(eps); // Thêm từng tập vào Set
            });
    });

    return Array.from(allEps);
}

function Form({ data, categories, regions, watchingMoviePackages, onSubmit }) {
    const [formErrorMessage, setFormErrorMessage] = useState({});
    const [formData, setFormData] = useState(
        data
            ? {
                  name: data.name,
                  slug: data.slug,
                  content: data.content ?? '',
                  notify: data.notify ?? '',
                  language: data.language ?? '',
                  quality: data.quality ?? '',
                  status: data.status ?? '',
                  originName: data.origin_name ?? '',
                  thumbnailUrl: data.thumb_url ?? '',
                  posterUrl: data.poster_url ?? '',
                  showTimes: data.showtimes ?? '',
                  episodeTime: data.episode_time ?? '',
                  episodeCurrent: data.episode_current ?? '',
                  episodeTotal: data.episode_total ?? '',
                  publishYear: data.publish_year ?? '',
                  isRecommended: data.is_recommended,
                  isShownInTheater: data.is_shown_in_theater,
                  isSensitiveContent: data.is_sensitive_content,
                  actors: data.actors,
                  directors: data.directors,
                  type: data.type,
                  categorieIdS: data.categories.map((category) => category.id),
                  regionIds: data.regions.map((region) => region.id),
                  servers: groupByType(data.episodes),
                  watchingMoviePackages: data.waching_movie_packages,
              }
            : {
                  name: '',
                  originName: '',
                  slug: '',
                  thumbnailUrl: '',
                  posterUrl: '',
                  content: '',
                  notify: '',
                  showTimes: '',
                  episodeTime: '',
                  episodeCurrent: '',
                  episodeTotal: '',
                  language: '',
                  quality: '',
                  publishYear: '',
                  type: '',
                  status: '',
                  categorieIdS: [],
                  regionIds: [],
                  actors: [],
                  directors: [],
                  servers: [
                      {
                          name: 'Hà Nội (Vietsub)#',
                          epsList: [
                              {
                                  name: 'Tập 1',
                                  slug: 'tap-1',
                                  type: 'm3u8',
                                  link: '',
                                  waching_movie_packages: [],
                              },
                          ],
                      },
                  ],
                  isRecommended: 0,
                  isShownInTheater: 0,
                  isSensitiveContent: 0,
                  watchingMoviePackages: [],
              }
    );
    const [indexSection, setIndexSection] = useState(0);
    const [serverIndexShow, setServerIndexShow] = useState(0);
    const [isAddActorModalOpen, setAddActorModalOpen] = useState(false);
    const [isAddDirectorModalOpen, setAddDirectorModalOpen] = useState(false);
    const [serverName, setServerName] = useState('');

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
        const { name, type, value, checked } = e.target;

        if (type === 'checkbox') {
            let newForm = formData[name];

            if (checked) {
                newForm.push(parseInt(value));
            } else {
                newForm = newForm.filter((id) => id !== parseInt(value));
            }
            setFormData({
                ...formData,
                [name]: newForm,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const onSearchedActorItemClick = (item) => {
        // Kiểm tra diễn viên đã tồn tại chưa
        const isAdded = formData.actors
            .map((actor) => actor.id)
            .includes(item.id);

        if (isAdded) {
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: 'error',
                    title: 'Thất bại',
                    message: 'Diễn viên đã được thêm vào rồi',
                },
            });
        } else {
            const newForm = formData.actors;
            newForm.push(item);

            setFormData({ ...formData, actors: newForm });
        }
    };

    const onSearchedDirectorItemClick = (item) => {
        // Kiểm tra diễn viên đã tồn tại chưa
        const isAdded = formData.directors
            .map((director) => director.id)
            .includes(item.id);

        if (isAdded) {
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: 'error',
                    title: 'Thất bại',
                    message: 'Diễn viên đã được thêm vào rồi',
                },
            });
        } else {
            const newForm = formData.directors;
            newForm.push(item);

            setFormData({ ...formData, directors: newForm });
        }
    };

    const actorfetcher = async (tag) => {
        if (!tag) {
            return null;
        }
        return await ActorService.getAll({ name: tag });
    };

    const directorfetcher = async (tag) => {
        if (!tag) {
            return null;
        }
        return await DirectorService.getAll({ name: tag });
    };

    const onSubmitForm = useCallback(
        async (e) => {
            e.preventDefault();

            // Validate before submit
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
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [formData, formErrorMessage, onSubmit]
    );

    const hanldeEpisodeRequiredWachingPackage = (
        e,
        episode,
        watchingMoviePackage
    ) => {
        let newServer = formData.servers;
        const checked = e.target.checked;
        newServer = newServer.map((server) => {
            return {
                ...server,
                epsList: server.epsList.map((eps) => {
                    if (eps.name === episode) {
                        if (checked) {
                            let newEps = eps;
                            newEps = {
                                ...newEps,
                                waching_movie_packages: [
                                    ...newEps.waching_movie_packages,
                                    watchingMoviePackage,
                                ],
                            };
                            return newEps;
                        } else {
                            let newEps = eps;
                            let new_waching_movie_packages =
                                newEps.waching_movie_packages;
                            new_waching_movie_packages =
                                new_waching_movie_packages.filter(
                                    (new_waching_movie_package) =>
                                        new_waching_movie_package.id !==
                                        watchingMoviePackage.id
                                );

                            newEps = {
                                ...newEps,
                                waching_movie_packages:
                                    new_waching_movie_packages,
                            };
                            return newEps;
                        }
                    } else {
                        return eps;
                    }
                }),
            };
        });
        setFormData({
            ...formData,
            servers: newServer,
        });
    };

    return (
        <>
            <form
                className={cx('wrapper', 'row', 'no-gutters')}
                onSubmit={onSubmitForm}>
                <div className={cx('section-header', 'c-12')}>
                    <Button
                        classNames={cx({ active: indexSection === 0 })}
                        onClick={(e) => {
                            e.preventDefault();
                            setIndexSection(0);
                        }}>
                        Thông tin phim
                    </Button>
                    <Button
                        classNames={cx({ active: indexSection === 1 })}
                        onClick={(e) => {
                            e.preventDefault();
                            setIndexSection(1);
                        }}>
                        Phân loại
                    </Button>
                    <Button
                        classNames={cx({ active: indexSection === 2 })}
                        onClick={(e) => {
                            e.preventDefault();
                            setIndexSection(2);
                        }}>
                        Danh sách tập phim
                    </Button>
                    <Button
                        classNames={cx({ active: indexSection === 3 })}
                        onClick={(e) => {
                            e.preventDefault();
                            setIndexSection(3);
                        }}>
                        Khác
                    </Button>
                </div>
                <div className={cx('section-body', 'c-10')}>
                    <div
                        className={cx('section-item', 'row')}
                        style={{ display: indexSection === 0 && 'flex' }}>
                        <div
                            className={cx('form-control', 'c-5')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='name'>name: *</label>
                            <Text
                                id='name'
                                name='name'
                                placeholder='Tên phim'
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
                            className={cx('form-control', 'c-5')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='originName'>Origin name: *</label>
                            <Text
                                id='originName'
                                name='originName'
                                placeholder='Tên gốc của phim'
                                value={formData.originName}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.originName && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.originName}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-10')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='slug'>đường dẫn tĩnh</label>
                            <Text
                                id='slug'
                                name='slug'
                                placeholder='Đường dẫn'
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
                            className={cx('form-control', 'c-10')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='thumbnailUrl'>Ảnh thumbnai: </label>
                            <Text
                                id='thumbnailUrl'
                                name='thumbnailUrl'
                                value={formData.thumbnailUrl}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.thumbnailUrl && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.thumbnailUrl}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-10')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='posterUrl'>Ảnh poster: </label>
                            <Text
                                id='posterUrl'
                                name='posterUrl'
                                value={formData.posterUrl}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.posterUrl && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.posterUrl}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-10')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='content'>Nội dung: </label>
                            <Textarea
                                cols={20}
                                rows={10}
                                id='content'
                                name='content'
                                value={formData.content}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.content && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.content}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-10')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='notify'>Thông báo/ghi chú: </label>
                            <Text
                                id='notify'
                                name='notify'
                                placeholder='Tuần này hoãn chiếu'
                                value={formData.notify}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.notify && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.notify}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-10')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='showTimes'>lịch chiếu phim: </label>
                            <Text
                                id='showTimes'
                                name='showTimes'
                                placeholder='21h tối mỗi ngày'
                                value={formData.showTimes}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.showTimes && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.showTimes}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-3')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='episodeTime'>
                                Thời lượng tập phim:{' '}
                            </label>
                            <Text
                                id='episodeTime'
                                name='episodeTime'
                                placeholder='45 phút'
                                value={formData.episodeTime}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.episodeTime && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.episodeTime}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-3')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='episodeCurrent'>
                                Tập phim hiện tại:{' '}
                            </label>
                            <Text
                                id='episodeCurrent'
                                name='episodeCurrent'
                                placeholder='14'
                                value={formData.episodeCurrent}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.episodeCurrent && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.episodeCurrent}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-3')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='episodeTotal'>
                                Tổng số tập phim:{' '}
                            </label>
                            <Text
                                id='episodeTotal'
                                name='episodeTotal'
                                placeholder='32 tập'
                                value={formData.episodeTotal}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.episodeTotal && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.episodeTotal}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-3')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='language'>Ngôn ngữ:</label>
                            <Text
                                id='language'
                                name='language'
                                placeholder='Vietsub'
                                value={formData.language}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.language && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.language}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-3')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='quality'>Chất lượng</label>
                            <Text
                                id='quality'
                                name='quality'
                                placeholder='HD'
                                value={formData.quality}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.quality && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.quality}
                                </span>
                            )}
                        </div>
                        <div
                            className={cx('form-control', 'c-3')}
                            style={{ marginBottom: '20px' }}>
                            <label htmlFor='publishYear'>Năm phát hành: </label>
                            <Text
                                id='publishYear'
                                name='publishYear'
                                value={formData.publishYear}
                                onChange={(e) => {
                                    handleChange(e);
                                    handleValidate(e);
                                }}
                            />
                            {formErrorMessage?.publishYear && (
                                <span className={cx('error-message')}>
                                    {formErrorMessage?.publishYear}
                                </span>
                            )}
                        </div>
                    </div>
                    <div
                        className={cx('section-item', 'row')}
                        style={{ display: indexSection === 1 && 'flex' }}>
                        <div className={cx('c-12', 'col')}>
                            <h3 style={{ marginBottom: '10px' }}>
                                Định dạng: *
                            </h3>
                            <div className={cx('radio-input-wrapper')}>
                                <input
                                    type='radio'
                                    name='type'
                                    id='single'
                                    value='single'
                                    checked={formData?.type === 'single'}
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor='single'>Phim lẻ</label>
                            </div>
                            <div className={cx('radio-input-wrapper')}>
                                <input
                                    type='radio'
                                    name='type'
                                    id='series'
                                    value='series'
                                    checked={formData?.type === 'series'}
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor='series'>Phim bộ</label>
                            </div>
                        </div>
                        <div className={cx('c-12', 'col')}>
                            <h3 style={{ marginBottom: '10px' }}>
                                Tình trạng: *
                            </h3>
                            <div className={cx('radio-input-wrapper')}>
                                <input
                                    type='radio'
                                    name='status'
                                    id='trailer'
                                    value='trailer'
                                    checked={formData?.status === 'trailer'}
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor='single'>Sắp chiếu</label>
                            </div>
                            <div className={cx('radio-input-wrapper')}>
                                <input
                                    type='radio'
                                    name='status'
                                    id='ongoing'
                                    value='ongoing'
                                    checked={formData?.status === 'ongoing'}
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor='ongoing'>Đang chiếu </label>
                            </div>
                            <div className={cx('radio-input-wrapper')}>
                                <input
                                    type='radio'
                                    name='status'
                                    id='completed'
                                    value='completed'
                                    checked={formData?.status === 'completed'}
                                    onChange={(e) => handleChange(e)}
                                />
                                <label htmlFor='completed'>Hoàn thành</label>
                            </div>
                        </div>
                        <div className={cx('c-12', 'col')}>
                            <h3 style={{ marginBottom: '10px' }}>
                                Thể loại: *
                            </h3>
                            <div className='row no-gutters'>
                                {categories?.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cx(
                                            'c-3',
                                            'checkbox-wrapper'
                                        )}>
                                        <input
                                            type='checkbox'
                                            name='categorieIdS'
                                            id={item.id}
                                            value={item.id}
                                            checked={formData?.categorieIdS.some(
                                                // eslint-disable-next-line eqeqeq
                                                (value) => value === item.id
                                            )}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label htmlFor={item.id}>
                                            {item.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={cx('c-12', 'col')}>
                            <h3 style={{ marginBottom: '10px' }}>
                                Quốc gia: *
                            </h3>
                            <div className='row no-gutters'>
                                {regions?.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cx(
                                            'c-3',
                                            'checkbox-wrapper'
                                        )}>
                                        <input
                                            type='checkbox'
                                            name='regionIds'
                                            id={item.id}
                                            value={item.id}
                                            checked={formData?.regionIds.some(
                                                // eslint-disable-next-line eqeqeq
                                                (value) => value === item.id
                                            )}
                                            onChange={(e) => handleChange(e)}
                                        />
                                        <label htmlFor={item.id}>
                                            {item.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={cx('c-12', 'col')}>
                            <div className={cx('add-actor-section')}>
                                <h3>Diễn viên:</h3>
                                <Button
                                    success
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setAddActorModalOpen(true);
                                    }}>
                                    Thêm diễn viên
                                </Button>
                            </div>
                            <div
                                className={cx(
                                    'add-actor-body',
                                    'row',
                                    'no-gutters'
                                )}>
                                {formData?.actors.map((actor) => (
                                    <Button
                                        key={`actor-${actor.id}`}
                                        grey
                                        onClick={(e) => e.preventDefault()}
                                        rightIcon={
                                            <FontAwesomeIcon
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newForm =
                                                        formData.actors.filter(
                                                            (actorToRemain) =>
                                                                actorToRemain.id !==
                                                                actor.id
                                                        );
                                                    setFormData({
                                                        ...formData,
                                                        actors: newForm,
                                                    });
                                                }}
                                                icon={faXmark}
                                            />
                                        }>
                                        {actor.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div className={cx('c-12', 'col')}>
                            <div className={cx('add-actor-section')}>
                                <h3>Đạo diễn:</h3>
                                <Button
                                    success
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setAddDirectorModalOpen(true);
                                    }}>
                                    Thêm đạo diễn
                                </Button>
                            </div>
                            <div
                                className={cx(
                                    'add-actor-body',
                                    'row',
                                    'no-gutters'
                                )}>
                                {formData?.directors.map((director) => (
                                    <Button
                                        key={`director-${director.id}`}
                                        grey
                                        onClick={(e) => e.preventDefault()}
                                        rightIcon={
                                            <FontAwesomeIcon
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newForm =
                                                        formData.directors.filter(
                                                            (
                                                                directorToRemain
                                                            ) =>
                                                                directorToRemain.id !==
                                                                director.id
                                                        );
                                                    setFormData({
                                                        ...formData,
                                                        directors: newForm,
                                                    });
                                                }}
                                                icon={faXmark}
                                            />
                                        }>
                                        {director.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div
                        className={cx('section-item', 'row')}
                        style={{ display: indexSection === 2 && 'flex' }}>
                        <div className={cx('c-12', 'col', 'row', 'no-gutters')}>
                            <div className={cx('form-control', 'c-4')}>
                                <Text
                                    value={serverName}
                                    placeholder='Nhập vào tên server'
                                    onChange={(e) => {
                                        setServerName(e.target.value);
                                    }}
                                />
                            </div>
                            <Button
                                primary
                                classNames={cx('c-2', 'add-content-btn')}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const newServer = formData.servers;
                                    newServer.push({
                                        name: serverName,
                                        epsList: [
                                            {
                                                name: 'Tập 1',
                                                slug: 'tap-1',
                                                type: 'embed',
                                                link: 'abc.com',
                                                waching_movie_packages: [],
                                            },
                                        ],
                                    });
                                    setFormData({
                                        ...formData,
                                        servers: newServer,
                                    });
                                }}>
                                Thêm server
                            </Button>
                        </div>
                        <div className='c-12'>
                            {formData?.servers?.length > 1 ? (
                                <Slider
                                    rows={1}
                                    {...settingsCarousel}
                                    className={cx(
                                        'c-7',
                                        'server-carousel-header'
                                    )}>
                                    {formData.servers.map((server, index) => (
                                        <button
                                            key={index}
                                            className={cx(
                                                'server-carousel-header-item',
                                                {
                                                    active:
                                                        index ===
                                                        serverIndexShow,
                                                }
                                            )}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setServerIndexShow(index);
                                            }}>
                                            {server.name}
                                        </button>
                                    ))}
                                </Slider>
                            ) : (
                                formData?.servers?.length === 1 && (
                                    <button
                                        className={cx(
                                            'server-carousel-header-item',
                                            'active'
                                        )}
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}>
                                        {formData.servers[0].name}
                                    </button>
                                )
                            )}
                            {formData?.servers?.length >= 1 && (
                                <div className={cx('c-12', 'server-content')}>
                                    <table className={cx('light-table')}>
                                        <thead>
                                            <tr>
                                                <th>tên</th>
                                                <th>slug</th>
                                                <th>type</th>
                                                <th>link</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.servers[
                                                serverIndexShow
                                            ]?.epsList?.map(
                                                (episode, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <Text
                                                                className={cx(
                                                                    'table-text-input'
                                                                )}
                                                                type='text'
                                                                name='name'
                                                                value={
                                                                    episode.name
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newServer =
                                                                        formData.servers;
                                                                    newServer[
                                                                        serverIndexShow
                                                                    ].epsList[
                                                                        index
                                                                    ][
                                                                        e.target.name
                                                                    ] =
                                                                        e.target.value;
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            servers:
                                                                                newServer,
                                                                        }
                                                                    );
                                                                }}></Text>
                                                        </td>
                                                        <td>
                                                            <Text
                                                                className={cx(
                                                                    'table-text-input'
                                                                )}
                                                                type='text'
                                                                name='slug'
                                                                value={
                                                                    episode.slug
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newServer =
                                                                        formData.servers;
                                                                    newServer[
                                                                        serverIndexShow
                                                                    ].epsList[
                                                                        index
                                                                    ][
                                                                        e.target.name
                                                                    ] =
                                                                        e.target.value;
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            servers:
                                                                                newServer,
                                                                        }
                                                                    );
                                                                }}></Text>
                                                        </td>
                                                        <td>
                                                            <SelectBox
                                                                name='type'
                                                                value={
                                                                    episode.type
                                                                }
                                                                options={[
                                                                    {
                                                                        label: 'm3u8',
                                                                        value: 'm3u8',
                                                                    },
                                                                    {
                                                                        label: 'Nhúng',
                                                                        value: 'embed',
                                                                    },
                                                                ]}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newServer =
                                                                        formData.servers;
                                                                    newServer[
                                                                        serverIndexShow
                                                                    ].epsList[
                                                                        index
                                                                    ][
                                                                        e.target.name
                                                                    ] =
                                                                        e.target.value;
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            servers:
                                                                                newServer,
                                                                        }
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <Text
                                                                type='text'
                                                                name='link'
                                                                value={
                                                                    episode.link
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const newServer =
                                                                        formData.servers;
                                                                    newServer[
                                                                        serverIndexShow
                                                                    ].epsList[
                                                                        index
                                                                    ][
                                                                        e.target.name
                                                                    ] =
                                                                        e.target.value;
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            servers:
                                                                                newServer,
                                                                        }
                                                                    );
                                                                }}></Text>
                                                        </td>
                                                        <td>
                                                            <Button
                                                                remove
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    const newMoviesList =
                                                                        formData
                                                                            .servers[
                                                                            serverIndexShow
                                                                        ]
                                                                            .epsList;
                                                                    newMoviesList.splice(
                                                                        index,
                                                                        1
                                                                    );
                                                                    const newServer =
                                                                        formData.servers;
                                                                    newServer[
                                                                        serverIndexShow
                                                                    ] = {
                                                                        name: newServer[
                                                                            serverIndexShow
                                                                        ].name,
                                                                        epsList:
                                                                            newMoviesList,
                                                                    };
                                                                    setFormData(
                                                                        {
                                                                            ...formData,
                                                                            servers:
                                                                                newServer,
                                                                        }
                                                                    );
                                                                }}>
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faTrash
                                                                    }
                                                                />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                    <Button
                                        success
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newServer = formData.servers;
                                            newServer[
                                                serverIndexShow
                                            ].epsList.push({
                                                name: 'Tập 1',
                                                slug: 'tap-1',
                                                type: 'embed',
                                                link: '',
                                                waching_movie_packages: [],
                                            });
                                            setFormData({
                                                ...formData,
                                                servers: newServer,
                                            });
                                        }}>
                                        Thêm tập mới
                                    </Button>
                                    <Button
                                        grey
                                        onClick={(e) => {
                                            e.preventDefault();
                                            const newServer = formData.servers;
                                            newServer.splice(
                                                serverIndexShow,
                                                1
                                            );
                                            setFormData({
                                                ...formData,
                                                servers: newServer,
                                            });
                                            if (serverIndexShow > 0)
                                                setServerIndexShow(
                                                    (prev) => prev - 1
                                                );
                                        }}>
                                        Xóa server
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div
                        className={cx('section-item')}
                        style={{ display: indexSection === 3 && 'block' }}>
                        <div className='col'>
                            <div className={cx('checkbox-wrapper')}>
                                <input
                                    type='checkbox'
                                    id='isRecommended'
                                    name='isRecommended'
                                    value={formData.isRecommended}
                                    checked={formData.isRecommended === 1}
                                    onChange={() => {
                                        if (formData.isRecommended === 1) {
                                            setFormData({
                                                ...formData,
                                                isRecommended: 0,
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                isRecommended: 1,
                                            });
                                        }
                                    }}
                                />
                                <label htmlFor='isRecommended'>Đề xuất</label>
                            </div>
                            <div className={cx('checkbox-wrapper')}>
                                <input
                                    type='checkbox'
                                    id='isSensitiveContent'
                                    name='isSensitiveContent'
                                    value={formData.isSensitiveContent}
                                    checked={formData.isSensitiveContent === 1}
                                    onChange={() => {
                                        if (formData.isSensitiveContent === 1) {
                                            setFormData({
                                                ...formData,
                                                isSensitiveContent: 0,
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                isSensitiveContent: 1,
                                            });
                                        }
                                    }}
                                />
                                <label htmlFor='isSensitiveContent'>
                                    Giới hạn độ tuổi
                                </label>
                            </div>
                            <div className={cx('checkbox-wrapper')}>
                                <input
                                    type='checkbox'
                                    id='isShownInTheater'
                                    name='isShownInTheater'
                                    value={formData.isShownInTheater}
                                    checked={formData.isShownInTheater === 1}
                                    onChange={() => {
                                        if (formData.isShownInTheater === 1) {
                                            setFormData({
                                                ...formData,
                                                isShownInTheater: 0,
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                isShownInTheater: 1,
                                            });
                                        }
                                    }}
                                />
                                <label htmlFor='isShownInTheater'>
                                    Đang chiếu tại rạp
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ marginBottom: '20px' }}>
                                Yêu cầu một trong những gói (trả phí):
                            </h3>
                            <div className='col'>
                                {watchingMoviePackages.map(
                                    (watchingMoviePackage, index) => (
                                        <div
                                            key={watchingMoviePackage.id}
                                            className={cx(
                                                'c-3',
                                                'checkbox-wrapper'
                                            )}>
                                            <input
                                                type='checkbox'
                                                name='watchingMoviePackages'
                                                id={watchingMoviePackage.id}
                                                value={watchingMoviePackage.id}
                                                checked={formData?.watchingMoviePackages.some(
                                                    // eslint-disable-next-line eqeqeq
                                                    (value) =>
                                                        value.id ===
                                                        watchingMoviePackage.id
                                                )}
                                                onChange={(e) => {
                                                    let newWatchingMoviePackages =
                                                        formData.watchingMoviePackages;

                                                    const isAdded =
                                                        newWatchingMoviePackages.some(
                                                            (
                                                                oldWatchingMoviePackage
                                                            ) =>
                                                                oldWatchingMoviePackage.id ===
                                                                watchingMoviePackage.id
                                                        );
                                                    if (isAdded) {
                                                        newWatchingMoviePackages =
                                                            newWatchingMoviePackages.filter(
                                                                (
                                                                    newWatchingMoviePackage
                                                                ) =>
                                                                    newWatchingMoviePackage.id !==
                                                                    watchingMoviePackage.id
                                                            );
                                                        setFormData({
                                                            ...formData,
                                                            watchingMoviePackages:
                                                                newWatchingMoviePackages,
                                                        });
                                                    } else {
                                                        newWatchingMoviePackages.push(
                                                            watchingMoviePackage
                                                        );
                                                        setFormData({
                                                            ...formData,
                                                            watchingMoviePackages:
                                                                newWatchingMoviePackages,
                                                        });
                                                    }
                                                }}
                                            />
                                            <label
                                                htmlFor={
                                                    watchingMoviePackage.id
                                                }>
                                                {watchingMoviePackage.name}
                                            </label>
                                        </div>
                                    )
                                )}
                            </div>

                            <h3 style={{ marginBottom: '20px' }}>
                                {' '}
                                Quyền truy cập cho các tập:{' '}
                            </h3>
                            <div>
                                {formData?.servers?.length >= 1 && (
                                    <>
                                        <table
                                            className={cx('light-table')}
                                            border={1}>
                                            <thead>
                                                <tr>
                                                    <th
                                                        rowSpan={2}
                                                        style={{
                                                            textAlign: 'center',
                                                        }}>
                                                        tên
                                                    </th>
                                                    <th
                                                        colSpan={
                                                            formData
                                                                ?.watchingMoviePackages
                                                                .length
                                                        }
                                                        style={{
                                                            textAlign: 'center',
                                                        }}>
                                                        Yêu cầu một trong những
                                                        gói (trả phí):
                                                    </th>
                                                </tr>
                                                {formData?.watchingMoviePackages
                                                    .length > 0 && (
                                                    <tr>
                                                        {formData?.watchingMoviePackages.map(
                                                            (
                                                                watchingMoviePackage,
                                                                index
                                                            ) => (
                                                                <th
                                                                    key={index}
                                                                    style={{
                                                                        textAlign:
                                                                            'center',
                                                                    }}>
                                                                    {
                                                                        watchingMoviePackage.name
                                                                    }
                                                                </th>
                                                            )
                                                        )}
                                                    </tr>
                                                )}
                                            </thead>
                                            <tbody>
                                                {getAllEps(
                                                    formData.servers
                                                ).map((episode, index) => (
                                                    <tr key={index}>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    'center',
                                                            }}>
                                                            {episode}
                                                        </td>
                                                        {formData.watchingMoviePackages.map(
                                                            (
                                                                watchingMoviePackage
                                                            ) => (
                                                                <td
                                                                    key={`watchingMoviePackage-${watchingMoviePackage.id}`}
                                                                    style={{
                                                                        textAlign:
                                                                            'center',
                                                                    }}>
                                                                    {
                                                                        <input
                                                                            type='checkbox'
                                                                            value={
                                                                                watchingMoviePackage.id
                                                                            }
                                                                            checked={formData?.servers.some(
                                                                                (
                                                                                    server
                                                                                ) =>
                                                                                    server.epsList.some(
                                                                                        (
                                                                                            eps
                                                                                        ) =>
                                                                                            eps.waching_movie_packages
                                                                                                .map(
                                                                                                    (
                                                                                                        waching_movie_package
                                                                                                    ) =>
                                                                                                        waching_movie_package.id
                                                                                                )
                                                                                                .includes(
                                                                                                    watchingMoviePackage.id
                                                                                                ) &&
                                                                                            eps.name ===
                                                                                                episode
                                                                                    )
                                                                            )}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                hanldeEpisodeRequiredWachingPackage(
                                                                                    e,
                                                                                    episode,
                                                                                    watchingMoviePackage
                                                                                )
                                                                            }
                                                                        />
                                                                    }
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('row', 'c-12')}>
                    <Button success type='submit' classNames={cx('save-btn')}>
                        Lưu
                    </Button>
                </div>
            </form>
            <FindAndAddModal
                isOpen={isAddActorModalOpen}
                onRequestClose={() => setAddActorModalOpen(false)}
                fetcher={actorfetcher}
                showedResultAttributes={['name']}
                onSearchedItemClick={onSearchedActorItemClick}
            />
            <FindAndAddModal
                isOpen={isAddDirectorModalOpen}
                onRequestClose={() => setAddDirectorModalOpen(false)}
                fetcher={directorfetcher}
                showedResultAttributes={['name']}
                onSearchedItemClick={onSearchedDirectorItemClick}
            />
        </>
    );
}

export default Form;
