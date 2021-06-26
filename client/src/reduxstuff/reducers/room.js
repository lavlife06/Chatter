import {
    CREATE_ROOM,
    GET_MYROOMS,
    GET_ROOM_BY_ID,
    CLEAR_ROOMS,
    CREATE_PRICHATROOM,
    CLEAR_PARTICULAR_ROOM,
} from "../actions/types";

const initialState = {
    myRooms: [],
    myPriChatRooms: [],
    particularRoom: null,
    loading: true,
};

const reducers = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_MYROOMS:
            return {
                ...state,
                myRooms: payload.myGrpChatallrooms,
                myPriChatRooms: payload.myPriChatallrooms,
                loading: false,
            };
        case CREATE_ROOM:
            return {
                ...state,
                myRooms: [payload, ...state.myRooms],
                loading: false,
            };
        case GET_ROOM_BY_ID:
            return {
                ...state,
                particularRoom: payload,
                loading: false,
            };
        case CLEAR_ROOMS:
            return {
                ...state,
                myRooms: [],
                myPriChatRooms: [],
                particularRoom: null,
                loading: true,
            };
        case CLEAR_PARTICULAR_ROOM:
            return {
                ...state,
                particularRoom: null,
                loading: false,
            };
        default:
            return state;
    }
};

export default reducers;
