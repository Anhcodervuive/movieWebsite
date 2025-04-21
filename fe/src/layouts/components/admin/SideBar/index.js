import classNames from 'classnames/bind';
import { BsGridFill } from 'react-icons/bs';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { IoShieldCheckmark } from 'react-icons/io5';
import { TbChairDirector } from 'react-icons/tb';
import { AiFillStar } from 'react-icons/ai';
import { AiFillSketchCircle } from 'react-icons/ai';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFaceSmile,
    faFileInvoice,
    faFlag,
    faLayerGroup,
    faUsers,
    faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FaPager } from 'react-icons/fa';

import styles from './Admin_Sidebar.module.css';
import Button from '@/components/UI/Button';
import { useLocation } from 'react-router-dom';
import config from '@/config';
import ImageAsset from '@/assets/Images';

const cx = classNames.bind(styles);

function SiderBar({ classNames, ...props }) {
    const location = useLocation();
    return (
        <div {...props} className={cx(classNames, 'wrapper')}>
            <Button to='' size='large' classNames={cx('logo')}>
                <img src={ImageAsset.component.logo} alt='logo' />
            </Button>
            <ul>
                <li
                    className={cx({
                        active:
                            location.pathname === config.routes.admin.dashboard,
                    })}>
                    <Button
                        to={config.routes.admin.dashboard}
                        leftIcon={<BsGridFill />}>
                        Báo cáo lượt xem
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.admin.category.home,
                    })}>
                    <Button
                        to={config.routes.admin.category.home}
                        leftIcon={<FontAwesomeIcon icon={faLayerGroup} />}>
                        Category
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.admin.video.home,
                    })}>
                    <Button
                        to={config.routes.admin.video.home}
                        leftIcon={<FontAwesomeIcon icon={faVideo} />}>
                        Video
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.admin.director.home,
                    })}>
                    <Button
                        to={config.routes.admin.director.home}
                        leftIcon={<TbChairDirector />}>
                        Director
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.admin.region.home,
                    })}>
                    <Button
                        to={config.routes.admin.region.home}
                        leftIcon={<FontAwesomeIcon icon={faFlag} />}>
                        Region
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.admin.actor.home,
                    })}>
                    <Button
                        to={config.routes.admin.actor.home}
                        leftIcon={<FontAwesomeIcon icon={faFaceSmile} />}>
                        Diễn viên
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.admin.moive.home,
                    })}>
                    <Button
                        to={config.routes.admin.moive.home}
                        leftIcon={<BiSolidMoviePlay />}>
                        Moive
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.admin.catalog.home,
                    })}>
                    <Button
                        to={config.routes.admin.catalog.home}
                        leftIcon={<FaPager />}>
                        Catalog
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.admin.moviePackageBenefits.home,
                    })}>
                    <Button
                        to={config.routes.admin.moviePackageBenefits.home}
                        leftIcon={<AiFillStar />}>
                        Movie package Benefit
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname ===
                            config.routes.admin.watchingMoviePackage.home,
                    })}>
                    <Button
                        to={config.routes.admin.watchingMoviePackage.home}
                        leftIcon={<AiFillSketchCircle />}>
                        Watching Movie Package
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname === config.routes.admin.bill.home,
                    })}>
                    <Button
                        to={config.routes.admin.bill.home}
                        leftIcon={<FontAwesomeIcon icon={faFileInvoice} />}>
                        Bill
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname === config.routes.admin.role.home,
                    })}>
                    <Button
                        to={config.routes.admin.role.home}
                        leftIcon={<IoShieldCheckmark />}>
                        Role
                    </Button>
                </li>
                <li
                    className={cx({
                        active:
                            location.pathname === config.routes.admin.user.home,
                    })}>
                    <Button
                        to={config.routes.admin.user.home}
                        leftIcon={<FontAwesomeIcon icon={faUsers} />}>
                        User
                    </Button>
                </li>
            </ul>
        </div>
    );
}

export default SiderBar;
