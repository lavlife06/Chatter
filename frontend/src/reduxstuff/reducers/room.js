import { CREATE_ROOM, GET_MYROOMS } from "../actions/types";

const initialState = {
  myRooms: [],
};

const reducers = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_MYROOMS:
      return {
        ...state,
        myRooms: payload,
        loading: false,
      };
    case CREATE_ROOM:
      return {
        ...state,
        myRooms: [payload, ...state.myRooms],
        loading: false,
      };
    // case CLEAR_PROFILES:
    //   return {
    //     ...state,
    //     profile: null,
    //     repos: [],
    //     loading: false,
    //   };

    default:
      return state;
  }
};

export default reducers;
