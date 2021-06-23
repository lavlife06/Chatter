import {
    CLEAR_PROFILE,
    CLEAR_PROFILES,
    GET_PROFILE,
    GET_PROFILES,
    REGISTER_SUCCESS,
    // GET_PROFILES,
    // PROFILE_ERROR,
    UPDATE_PROFILE,
    // GET_REPOS,
    // NO_REPOS,
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
        case UPDATE_PROFILE:
            return {
                ...state,
                myprofile: payload,
                loading: false,
            };
        case REGISTER_SUCCESS:
            return {
                ...state,
                myprofile: payload.profile,
                loading: false,
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false,
            };
        // case PROFILE_ERROR:
        //   return {
        //     ...state,
        //     error: payload,
        //     loading: false,
        //     profile: null,
        //   };
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
        // case GET_REPOS:
        //   return {
        //     ...state,
        //     repos: payload,
        //     loading: false,
        //   };
        // case NO_REPOS:
        //   return {
        //     ...state,
        //     repos: [],
        //   };
        default:
            return state;
    }
};

export default reducers;
