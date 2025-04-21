import config from '@/config';
import { logoutUser } from '../action/auth';
import { LOGOUT_USER } from '../contant';

import AuthService from '@/service/auth.service';

const expirationMiddleware = (store) => (next) => async (action) => {
    const state = store.getState();

    const EXPIRATION_TIME = parseInt(config.auth.expLogin); // 1 giờ = 3600 giây
    const EXPIRATION_IF_REMEMBER = parseInt(config.auth.expRememberLogin); // 1 tuần 604800
    const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại (giây)

    if (action.type === LOGOUT_USER) {
        return next(action);
    }
    if (
        state.auth.lastUpdated &&
        ((!state.auth.isRememberUser &&
            currentTime - state.auth.lastUpdated > EXPIRATION_TIME) ||
            (state.auth.isRememberUser &&
                currentTime - state.auth.lastUpdated > EXPIRATION_IF_REMEMBER))
    ) {
        console.log('💡 Đăng xuất');
        await AuthService.logout();
        store.dispatch(logoutUser({}));

        return;
    }

    return next(action);
};

export { expirationMiddleware };
