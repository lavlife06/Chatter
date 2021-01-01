import { v4 as uuid } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

// We can use => dispatch => because of thunk middleware
export const setAlert = (msg, alertType, timeout = 3000) => (dispatch) => {
  const id = uuid();
  console.log(id);
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
