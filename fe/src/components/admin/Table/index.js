import { memo, useCallback, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { TbTriangleFilled, TbTriangleInvertedFilled } from 'react-icons/tb';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import styles from './Table.module.css';
import Button from '@/components/UI/Button';
import Image from '@/components/UI/Image';

const cx = classNames.bind(styles);

function Table({
    data,
    attributesToShow,
    attriButesToNotShow,
    onEdit,
    onDelete,
    onShow,
    onEnable,
    onDisable,
    initSearchValue = null,
    onSearch,
    ...props
}) {
    const [localData, setLocalData] = useState(data);
    const [filter, setFilter] = useState({});
    const [row, setRow] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const formateTime = useCallback((inputDate) => {
        // Chuyển đổi sang đối tượng Date
        const date = new Date(inputDate);

        // Lấy các thành phần ngày, tháng, năm, giờ và phút
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        // Kết hợp lại thành định dạng mong muốn
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

        return formattedDate;
    }, []);

    const isISODateTime = useCallback((input) => {
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        return isoRegex.test(input);
    }, []);

    const attributes = useMemo(() => {
        if (attributesToShow?.length > 0) {
            return attriButesToNotShow
                ? attributesToShow.filter(
                      (attr) => !attriButesToNotShow.includes(attr)
                  )
                : attributesToShow;
        } else if (localData.length > 0) {
            return attriButesToNotShow
                ? Object.keys(localData[0]).filter(
                      (attr) => !attriButesToNotShow.includes(attr)
                  )
                : Object.keys(localData[0]);
        } else {
            return [];
        }
    }, [attriButesToNotShow, attributesToShow, localData]);

    const filteredData = useMemo(() => {
        let newData = [...localData];
        if (Object.keys(filter).length > 0) {
            Object.keys(filter).forEach((attr) => {
                if (typeof localData[0][attr] === 'string') {
                    if (filter[attr] === 'asc') {
                        newData.sort((a, b) => a[attr].localeCompare(b[attr]));
                    } else {
                        newData.sort((a, b) => b[attr].localeCompare(a[attr]));
                    }
                } else if (typeof localData[0][attr] === 'number') {
                    if (filter[attr] === 'asc') {
                        newData.sort((a, b) => a[attr] - b[attr]);
                    } else {
                        newData.sort((a, b) => b[attr] - a[attr]);
                    }
                }
            });
        }

        if (row) {
            const startIndex = (currentPage - 1) * row;
            const endIndex = startIndex + row;
            newData = newData.slice(
                startIndex,
                newData.length > endIndex ? endIndex : newData.length
            );
        }

        return newData;
    }, [currentPage, localData, filter, row]);

    const getPaginateItemLength = useMemo(() => {
        if (row) {
            return Math.ceil(localData.length / row);
        } else {
            return 0;
        }
    }, [localData, row]);

    const renderPaginateItem = useCallback(() => {
        const paginateLength = getPaginateItemLength;
        if (paginateLength) {
            const paginateItems = [];
            if (paginateLength > 5) {
                if (currentPage - 2 >= 1) {
                    paginateItems.push(
                        <button
                            className={cx('paginate-button', {
                                active: currentPage === 1,
                            })}
                            onClick={() => setCurrentPage(1)}>
                            1
                        </button>
                    );
                    paginateItems.push(
                        <button
                            className={cx('paginate-button', {
                                active: currentPage === 2,
                            })}
                            onClick={() => setCurrentPage(2)}>
                            2
                        </button>
                    );
                    paginateItems.push(
                        <button className={cx('paginate-button')}>...</button>
                    );
                }
                for (
                    let i = currentPage;
                    i <= currentPage + 3 && i <= paginateLength;
                    i++
                ) {
                    paginateItems.push(
                        <button
                            key={i}
                            className={cx('paginate-button', {
                                active: currentPage === i,
                            })}
                            onClick={() => setCurrentPage(i)}>
                            {i}
                        </button>
                    );
                }
                if (currentPage + 3 < paginateLength) {
                    paginateItems.push(
                        <button
                            className={cx('paginate-button')}
                            onClick={() => setCurrentPage(paginateLength)}>
                            {paginateLength}
                        </button>
                    );
                }
            } else {
                for (let i = 1; i <= paginateLength; i++) {
                    paginateItems.push(
                        <button
                            key={i}
                            className={cx('paginate-button', {
                                active: currentPage === i,
                            })}
                            onClick={() => setCurrentPage(i)}>
                            {i}
                        </button>
                    );
                }
            }
            return paginateItems;
        }
    }, [currentPage, getPaginateItemLength]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('action')}>
                <div className={cx('select-wrapper')}>
                    show
                    <select
                        className={cx('select-row')}
                        value={row}
                        onChange={(e) => {
                            setRow(e.target.value);
                        }}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    entries
                </div>
                {initSearchValue !== null && (
                    <div className={cx('search-wrapper')}>
                        Search:
                        <div className={cx('search-input')}>
                            <input
                                value={initSearchValue}
                                placeholder='Nhập vào từ khóa cần tìm...'
                                onChange={(e) => {
                                    onSearch(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            <table className={cx('light-table')}>
                <thead>
                    <tr>
                        <th>#</th>
                        {attributes.map((attribute, index) => (
                            <th key={index}>
                                <div>
                                    <span>{attribute}</span>
                                    <span
                                        className={cx('order-button')}
                                        onClick={() => {
                                            if (
                                                !filter[attribute] ||
                                                !Object.keys(filter).includes(
                                                    attribute
                                                )
                                            ) {
                                                setFilter({
                                                    ...filter,
                                                    [attribute]: 'asc',
                                                });
                                            } else if (
                                                filter[attribute] === 'asc'
                                            ) {
                                                setFilter({
                                                    ...filter,
                                                    [attribute]: 'desc',
                                                });
                                            } else if (
                                                filter[attribute] === 'desc'
                                            ) {
                                                setFilter((prev) => {
                                                    delete prev[attribute];
                                                    return prev;
                                                });
                                            }
                                        }}>
                                        <TbTriangleFilled
                                            style={{
                                                color:
                                                    filter[attribute] ===
                                                        'asc' && 'white',
                                            }}
                                        />
                                        <TbTriangleInvertedFilled
                                            style={{
                                                color:
                                                    filter[attribute] ===
                                                        'desc' && 'white',
                                            }}
                                        />
                                    </span>
                                </div>
                            </th>
                        ))}
                        {attributes.length > 0 &&
                            (onEdit || onDelete || onShow) && <th>action</th>}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <tr key={item.id}>
                                <td key={`row-${item.id}`}>
                                    {(currentPage - 1) * row + index + 1}
                                </td>
                                {attributes.map((attribute) => (
                                    <td key={`${item.id}-${attribute}`}>
                                        {attribute?.includes('url') &&
                                        !item[attribute]?.includes(
                                            'index.m3u8'
                                        ) ? (
                                            <Image
                                                type='movie-admin-table'
                                                src={item[attribute]}
                                                alt='image'
                                            />
                                        ) : isISODateTime(item[attribute]) ? (
                                            formateTime(item[attribute])
                                        ) : (
                                            item[attribute]
                                        )}
                                    </td>
                                ))}
                                <td key={`actions-${item.id}`}>
                                    {Object.keys(item).includes('disable') &&
                                        (item['disable'] === 0
                                            ? onDisable && (
                                                  <Button
                                                      warning
                                                      onClick={() => {
                                                          const isSuccess =
                                                              onDisable(
                                                                  item.id
                                                              );
                                                          if (isSuccess) {
                                                              let newData = [
                                                                  ...localData,
                                                              ];
                                                              const itemIndex =
                                                                  newData.findIndex(
                                                                      (
                                                                          element
                                                                      ) =>
                                                                          element.id ===
                                                                          item.id
                                                                  );

                                                              newData[
                                                                  itemIndex
                                                              ] = {
                                                                  ...newData[
                                                                      itemIndex
                                                                  ],
                                                                  disable: 1,
                                                              };

                                                              setLocalData(
                                                                  newData
                                                              );
                                                          }
                                                      }}>
                                                      disable
                                                  </Button>
                                              )
                                            : onEnable && (
                                                  <Button
                                                      success
                                                      onClick={() => {
                                                          const isSuccess =
                                                              onEnable(item.id);
                                                          if (isSuccess) {
                                                              let newData = [
                                                                  ...localData,
                                                              ];
                                                              const itemIndex =
                                                                  newData.findIndex(
                                                                      (
                                                                          element
                                                                      ) =>
                                                                          element.id ===
                                                                          item.id
                                                                  );
                                                              newData[
                                                                  itemIndex
                                                              ] = {
                                                                  ...newData[
                                                                      itemIndex
                                                                  ],
                                                                  disable: 0,
                                                              };

                                                              setLocalData(
                                                                  newData
                                                              );
                                                          }
                                                      }}>
                                                      enable
                                                  </Button>
                                              ))}
                                    {onShow && (
                                        <Button
                                            infor
                                            onClick={() => onShow(item)}>
                                            Show
                                        </Button>
                                    )}
                                    {onEdit && (
                                        <Button
                                            edit
                                            style={{ marginRight: '10px' }}
                                            onClick={() => onEdit(item.id)}>
                                            <FontAwesomeIcon icon={faPen} />
                                        </Button>
                                    )}
                                    {onDelete && (
                                        <Button
                                            remove
                                            onClick={async () => {
                                                const isDeleteSuccess =
                                                    await onDelete(item.id);
                                                if (isDeleteSuccess) {
                                                    let newData =
                                                        localData.filter(
                                                            (newItem) =>
                                                                newItem.id !==
                                                                item.id
                                                        );
                                                    setLocalData(newData);
                                                }
                                            }}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={attributesToShow.length + 2}
                                style={{ textAlign: 'center' }}>
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {!!row && getPaginateItemLength > 1 && (
                <div className={cx('paginate')}>
                    <button
                        className={cx('go-prev')}
                        onClick={() =>
                            currentPage > 1 &&
                            setCurrentPage((prev) => prev - 1)
                        }>
                        Trước
                    </button>
                    {renderPaginateItem()}
                    <button
                        className={cx('go-next')}
                        onClick={() =>
                            currentPage < getPaginateItemLength &&
                            setCurrentPage((prev) => prev + 1)
                        }>
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}

export default memo(Table);
