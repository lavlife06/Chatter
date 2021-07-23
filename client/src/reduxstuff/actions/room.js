import { GET_MYROOMS } from "./types";
import axios from "axios";

// get my rooms
export const getMyRooms = (token) => async (dispatch) => {
    try {
        const res = await axios.get(
            "http://192.168.0.116:5000/api/room/myRooms",
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
