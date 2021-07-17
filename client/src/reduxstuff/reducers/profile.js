import {
    CLEAR_PROFILE,
    CLEAR_PROFILES,
    GET_PROFILE,
    GET_PROFILES,
    REGISTER_SUCCESS,
    UPDATE_PRICHATROOMS,
    UPDATE_PROFILE,
} from "../actions/types";

const initialState = {
    myprofile: {},
    profiles: [],
    loading: true,
    error: {},
};

const reducers = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_PROFILE:
            return {
                ...state,
                myprofile: payload,
                loading: false,
            };
        case UPDATE_PROFILE:
            return {
                ...state,
                myprofile: payload.profile,
                loading: false,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                myprofile: payload.profile,
                loading: false,
            };
        case UPDATE_PRICHATROOMS:
            return {
                ...state,
                myprofile: { ...state.myprofile, myPrivateChatRooms: payload },
                loading: false,
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false,
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                myprofile: {},
                profiles: [],
                loading: true,
            };
        case CLEAR_PROFILES:
            return {
                ...state,
                profiles: [],
                loading: false,
            };
        default:
            return state;
    }
};

export default reducers;
