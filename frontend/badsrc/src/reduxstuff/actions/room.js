import { CREATE_PRICHATROOM, CREATE_ROOM, GET_MYROOMS } from "./types";
import axios from "axios";
import { getCurrentProfile } from "./profile";
// import { setAlert } from './alert';
// import setAuthToken from "../utils/setAuthToken";
// import { createProfile, getCurrentProfile } from "./profile";

// get my rooms
export const getMyRooms = () => async (dispatch) => {
  try {
    const res = await axios.get("http://127.0.0.1:5000/api/room/myRooms");

    dispatch({
      type: GET_MYROOMS,
      payload: res.data,
    });
  } catch (err) {
    console.log("there is an error in getmyRooms");
  }
};

// Create room
export const createRoom = (roomName, roomMembers) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ roomName, roomMembers });

  try {
    const res = await axios.post(
      "http://127.0.0.1:5000/api/room/createroom",
      body,
      config
    );

    dispatch({
      type: CREATE_ROOM,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        // dispatch(setAlert(error.msg, "danger"));
        alert(error.msg);
      });
    }
  }
};

// Create Private Message room
export const createPriChatRoom = (roomName, roomMembers) => async (
  dispatch
) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ roomMembers });

  try {
    const res = await axios.post(
      "http://127.0.0.1:5000/api/room/createPrivateChatroom",
      body,
      config
    );

    dispatch({
      type: CREATE_PRICHATROOM,
      payload: { theCreatedRoom: res.data, roomName },
    });
    dispatch(getCurrentProfile());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        // dispatch(setAlert(error.msg, "danger"));
        alert(error.msg);
      });
    }
  }
};
