import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import {
    faFilter,
    faMagnifyingGlass,
    faSpinner,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks';

import styles from './SearchInput.module.css';
import Button from '../../../../components/UI/Button';
import config from '@/config';
import { SelectBox } from '@/components/UI/Input';
import useGetAPIData from '@/hooks/useGetAPIData';
import RegionService from '@/service/web/region.service';
import CategoryService from '@/service/web/category.service';

const cx = classNames.bind(styles);

function SearchInput({
    oldSearchValue = '',
    oldRegionId = '',
    oldCategoryId = '',
    oldType = '',
    oldPublishedYear = '',
}) {
    const [formFilter, setFormFilter] = useState({
        regionId: oldRegionId,
        categoryId: oldCategoryId,
        type: oldType,
        publishedYear: oldPublishedYear,
    });
    const [isFilterFormOpen, setIsFilterFormOpen] = useState(
        oldRegionId || oldCategoryId || oldType || oldPublishedYear
    );
    const [inputValue, setInputValue] = useState(oldSearchValue);
    const [searchResultInput, setSearchResultInput] = useState([]);
    const [showResult, setShowResult] = useState(true);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();
    const {
        data: dataRegion,
        isLoading: isLoadingRegion,
        isError: isErrorRegion,
    } = useGetAPIData(async () => await RegionService.getAll(), null, []);
    const {
        data: dataCategory,
        isLoading: isLoadingCategory,
        isError: isErrorCategory,
    } = useGetAPIData(async () => await CategoryService.getAll(), null, []);

    const navigate = useNavigate();

    let debounceValue = useDebounce(inputValue, 1000);

    const handleInputChange = (e) => {
        const searchValue = e.target.value;

        if (searchValue.startsWith(' ')) {
            return;
        }

        setInputValue(searchValue);
    };

    const handleClear = () => {
        setInputValue('');
        inputRef.current.focus();
    };

    const handleClickOutside = () => {
        setShowResult(false);
    };

    const handleSearchWithKey = (key) => {
        let query = '';
        if (key) query += `q=${key}&`;
        query += Object.keys(formFilter)
            .map((key) => {
                if (formFilter[key]) {
                    return `${key}=${formFilter[key]}`;
                } else {
                    return '';
                }
            })
            .filter((condition) => !!condition)
            .join('&');
        console.log(query);

        navigate(`${config.routes.SearchResult}?${query}`);
    };

    const hanldeFormFilterChange = (e) => {
        const { name, value } = e.target;
        setFormFilter({
            ...formFilter,
            [name]: value,
        });
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        debounceValue = '';
        setInputValue(oldSearchValue);
        setSearchResultInput([]);
        setLoading(false);
        setShowResult(false);
    }, [oldSearchValue]);

    useEffect(() => {
        if (debounceValue.trim() === '') {
            setSearchResultInput([]);
            return;
        }

        setLoading(true);

        fetch(
            `${config.apiServer}/api/tag/find?tag=${encodeURIComponent(
                debounceValue
            )}`
        )
            .then((response) => response.json())
            .then((response) => {
                console.log(response);

                if (response) {
                    setSearchResultInput(response.tags);
                }

                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [debounceValue]);

    return (
        <div className={cx('wrapper')}>
            <HeadlessTippy
                appendTo={document.body}
                onClickOutside={handleClickOutside}
                visible={searchResultInput.length > 0 && showResult}
                interactive
                placement='bottom'
                render={(attrs) => (
                    <div
                        className={cx('search-result')}
                        tabIndex='-1'
                        {...attrs}
                        style={{
                            width: inputRef.current
                                ? inputRef.current.offsetWidth
                                : 'auto',
                        }}>
                        <ul>
                            {searchResultInput.map((value, index) => (
                                <li
                                    onClick={() =>
                                        handleSearchWithKey(value.name)
                                    }
                                    key={index}
                                    className={cx('search-result-item')}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    <Button text>{value.name}</Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}>
                <div className={cx('search-input-wrapper')} ref={inputRef}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        placeholder='Nhập tên phim, diễn viên'
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setShowResult(true)}
                    />
                    {inputValue && !loading && (
                        <button
                            className={cx('clear-button')}
                            onClick={handleClear}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    )}

                    {loading && (
                        <button className={cx('loading-icon')}>
                            <FontAwesomeIcon icon={faSpinner} />
                        </button>
                    )}
                    <Button
                        primary
                        onClick={() => handleSearchWithKey(inputValue)}>
                        Tìm kiếm
                    </Button>
                </div>
            </HeadlessTippy>
            <span
                className={cx('filter-label')}
                onClick={() => setIsFilterFormOpen(!isFilterFormOpen)}>
                <FontAwesomeIcon
                    icon={faFilter}
                    style={{ color: isFilterFormOpen && '#ffd875' }}
                />
                Bộ lọc
            </span>
            <div
                className={cx('filter', 'row', 'no-gutters', {
                    show: isFilterFormOpen,
                })}>
                <div className={cx('form-control', 'c-5', 'l-2', 'col')}>
                    <label htmlFor='type'>Định dạng: </label>
                    <SelectBox
                        name='type'
                        value={formFilter.type}
                        options={[
                            {
                                label: 'Định dạng',
                                value: '',
                            },
                            {
                                label: 'Phim bộ',
                                value: 'series',
                            },
                            {
                                label: 'Phim lẻ',
                                value: 'single',
                            },
                        ]}
                        onChange={(e) => hanldeFormFilterChange(e)}
                    />
                </div>
                <div className={cx('form-control', 'c-5', 'l-2')}>
                    <label htmlFor='publishedYear'>Năm công chiếu: </label>
                    <SelectBox
                        name='publishedYear'
                        value={formFilter.publishedYear}
                        options={[
                            {
                                label: 'Năm công chiếu',
                                value: '',
                            },
                            {
                                label: '2025',
                                value: '2025',
                            },
                            {
                                label: '2024',
                                value: '2024',
                            },
                            {
                                label: '2023',
                                value: '2023',
                            },
                            {
                                label: 'Khác',
                                value: 'Khác',
                            },
                        ]}
                        onChange={(e) => hanldeFormFilterChange(e)}
                    />
                </div>
                {!isLoadingRegion && !isErrorRegion && (
                    <div className={cx('form-control', 'c-5', 'l-2')}>
                        <label htmlFor='region'>Quốc gia: </label>
                        <SelectBox
                            name='regionId'
                            value={formFilter.regionId}
                            options={[
                                {
                                    label: 'Quốc gia',
                                    value: '',
                                },
                                ...dataRegion?.regions.map((value) => ({
                                    label: value.name,
                                    value: value.id,
                                })),
                            ]}
                            onChange={(e) => hanldeFormFilterChange(e)}
                        />
                    </div>
                )}

                {!isLoadingCategory && !isErrorCategory && (
                    <div className={cx('form-control', 'c-5', 'l-2')}>
                        <label htmlFor='category'>Thể loại: </label>
                        <SelectBox
                            name='categoryId'
                            value={formFilter.categoryId}
                            options={[
                                {
                                    label: 'Thể loại',
                                    value: '',
                                },
                                ...dataCategory?.categories.map((value) => ({
                                    label: value.name,
                                    value: value.id,
                                })),
                            ]}
                            onChange={(e) => hanldeFormFilterChange(e)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchInput;
