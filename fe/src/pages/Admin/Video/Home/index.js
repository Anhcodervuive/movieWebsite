import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';
import classNames from 'classnames/bind';

import styles from './VideoHome.module.css';

import Table from '@/components/admin/Table';
import Button from '@/components/UI/Button';
import config from '@/config';

import VideoService from '@/service/admin/video.service';
import useGetAPIData from '@/hooks/useGetAPIData';
import Loading from '@/components/UI/Loading';
import { DefaultToast } from '@/components/UI/ToastMessage';
import PreviewVideo from '../components/PreviewVideo';

const cx = classNames.bind(styles);

function useQuery() {
    return new URLSearchParams(useLocation().state);
}

function VideoHome() {
    const query = useQuery();
    const navigator = useNavigate();
    const [isPreviewViewOpen, setIsPreviewViewOpen] = useState(false);
    const [videoSrc, setVideoSrc] = useState('');
    const message = query.get('message');
    const type = query.get('type');
    const { data, isLoading, isError } = useGetAPIData(
        async () => await VideoService.getAll(),
        null,
        []
    );

    const onDeleteActor = useCallback(async (id) => {
        const result = await VideoService.delete(id)
            .then((res) => {
                console.log(res);
                toast(DefaultToast, {
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'success',
                        title: 'Thành công',
                        message: res.message,
                    },
                });

                return true;
            })
            .catch((err) => {
                console.log(err);

                toast(DefaultToast, {
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'error',
                        title: 'Lỗi',
                        message: err.response.data.message,
                    },
                });

                return false;
            });

        return result;
    }, []);

    const onShow = useCallback(async (item) => {
        setVideoSrc(`${config.apiServer}${item.url}`);
        setIsPreviewViewOpen(true);
    }, []);

    useEffect(() => {
        if (message && type) {
            console.log(type, message);
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: type,
                    title: 'Thành công',
                    message: message,
                },
            });
            navigator('.', { replace: true });
        }
    }, [message, navigator, type]);

    if (isLoading || isError) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2>Danh sách video:</h2>
                <Button
                    success
                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    to={config.routes.admin.video.create}>
                    Thêm video
                </Button>
            </div>
            {data && (
                <Table
                    data={data.videos}
                    attributesToShow={['name', 'type', 'created_at']}
                    onDelete={onDeleteActor}
                    onShow={onShow}
                />
            )}
            <ToastContainer theme='dark' />
            <PreviewVideo
                isOpen={isPreviewViewOpen}
                onRequestClose={() => setIsPreviewViewOpen(false)}
                src={videoSrc}
            />
        </div>
    );
}

export default VideoHome;
