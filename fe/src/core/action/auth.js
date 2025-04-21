import { LOGIN_USER, LOGOUT_USER, REMMEBER_USER } from '../contant';

const loginUser = (payload) => ({
    type: LOGIN_USER,
    payload,
});

const rememberUser = () => ({
    type: REMMEBER_USER,
});

const logoutUser = (payload) => ({
    type: LOGOUT_USER,
    payload,
});

export { loginUser, rememberUser, logoutUser };
