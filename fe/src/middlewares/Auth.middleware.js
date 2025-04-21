import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';

import config from '@/config';

function CheckLogin() {
    const user = useSelector((state) => state.auth.currentUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            console.log('Chưa đăng nhập');

            navigate(config.routes.login);
        } else {
            console.log('Người dùng đã đăng nhập');
        }
    }, [user, navigate]);

    return !!user;
}

function CheckRoles() {
    const user = useSelector((state) => state.auth.currentUser);
    // const navigate = useNavigate();

    // const isCorrectRole = useMemo(
    //     () =>
    //         user ? user.roles.some((element) => role.includes(element)) : false,
    //     [user, role]
    // );
    // useEffect(() => {
    //     if (!isCorrectRole) {
    //         console.log('Không có quyền truy cập');
    //         navigate('/error403');
    //     } else {
    //         console.log('Có quyền truy cập');
    //     }
    // });

    return true;
}

export { CheckLogin, CheckRoles };
