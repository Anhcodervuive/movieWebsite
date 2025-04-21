import { useRef, useState } from 'react';
import Modal from 'react-modal';
import classNames from 'classnames/bind';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { MdSearchOff } from 'react-icons/md';

import styles from './FindAndAddModal.module.css';

import useGetAPIData from '@/hooks/useGetAPIData';
import { useDebounce } from '@/hooks';

const cx = classNames.bind(styles);

function FindAndAddModal({
    isOpen,
    onRequestClose,
    fetcher,
    onSearchedItemClick,
    showedResultAttributes,
}) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef();
    const debounceValue = useDebounce(inputValue, 800);
    const { data, isLoading, isError } = useGetAPIData(
        async () => {
            if (debounceValue) {
                return await fetcher(debounceValue);
            }
            return null;
        },
        null,
        [debounceValue]
    );

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

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                overlay: {
                    backgroundColor: 'rgba(10, 9, 10, 0.6)',
                },
                content: {
                    top: '40%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    height: '500px',
                    overflow: 'auto',
                    width: '500px',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#000',
                    padding: '20px',
                    borderRadius: '10px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(255, 255, 255,0.15)',
                },
            }}>
            <div className={cx('wrapper')} ref={inputRef}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input
                    placeholder='Nhập tên phim, diễn viên'
                    value={inputValue}
                    onChange={handleInputChange}
                />
                {inputValue && !isLoading && (
                    <button
                        className={cx('clear-button')}
                        onClick={handleClear}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                )}

                {isLoading && (
                    <button className={cx('loading-icon')}>
                        <AiOutlineLoading3Quarters />
                    </button>
                )}
            </div>
            {!inputValue ? (
                <div className={cx('no-recent-panel')}>
                    Không có lịch sử tìm kiếm
                </div>
            ) : isError ? (
                <div className={cx('no-result-panel')}>
                    <MdSearchOff size={50} />

                    <p>
                        Không thể tìm thấy phim hay diễn viên có tên{' '}
                        <strong style={{ color: 'gray' }}>
                            "{inputValue}"
                        </strong>
                    </p>
                </div>
            ) : !data ? (
                <div className={cx('no-recent-panel')}>Đang tìm kiếm</div>
            ) : (
                <div className={cx('search-result')}>
                    <ul>
                        {data[Object.keys(data)[0]].map((item, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    onSearchedItemClick(item);
                                }}
                                className={cx('search-result-item')}>
                                <span>{index}</span>
                                {showedResultAttributes.map((key, index) => (
                                    <span key={index}>{item[key]}</span>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Modal>
    );
}

export default FindAndAddModal;
