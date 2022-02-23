import { GET_MYROOMS } from "./types";
import axios from "axios";

// get my rooms
export const getMyRooms = (token) => async (dispatch) => {
    try {
        const res = await axios.get(
            "https://chatter-chatapplication.herokuapp.com/api/room/myRooms",
            {
                headers: {
                    "x-auth-token": token,
                },
            }
        );

        dispatch({
            type: GET_MYROOMS,
            payload: res.data,
        });
    } catch (err) {
        console.log("there is an error in getmyRooms");
    }
};
