import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    AUTH_ERROR,
    USER_LOADED,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SETUP_SOCKET,
    UPDATE_PROFILE,
    // ACCOUNT_DELETED,
} from "../actions/types";

const initialState = {
    token: null,
    socket: null,
    isAuthenticated: null,
    loading: true,
    user: null,
};

const reducers = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload,
            };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: payload.token,
                isAuthenticated: true,
                loading: false,
            };
        case UPDATE_PROFILE:
            return {
                ...state,
                token: payload.token,
                loading: false,
            };
        case SETUP_SOCKET:
            return {
                ...state,
                socket: payload,
            };
        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case AUTH_ERROR:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
            };
        case LOGOUT:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
            };
        // case ACCOUNT_DELETED:
        //   return {
        //     ...state,
        //     token: null,
        //     isAuthenticated: false,
        //     loading: false,
        //     user: null,
        //   };
        default:
            return state;
    }
};

export default reducers;
