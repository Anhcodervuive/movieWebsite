import classNames from 'classnames/bind';

import styles from './SelectBox.module.css';

import Image from '@/assets/Images';

const cx = classNames.bind(styles);

function SelectBox({
    mutiple,
    name,
    value,
    options,
    onChange,
    size,
    ...props
}) {
    return (
        <div
            className={cx('wrapper', {
                mutiple,
            })}
            {...props}>
            <select
                multiple={mutiple}
                name={name}
                value={value}
                onChange={onChange}
                size={size}
                style={{
                    backgroundImage:
                        !mutiple && `url(${Image.component.dropdownIcon})`,
                }}>
                {options.map((item, index) => (
                    <option key={index} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectBox;
