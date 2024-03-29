import { GET_MYROOMS } from "./types";
import axios from "axios";
import { ApiEndPoints, ApiServerHost } from "../../utils/constants";

// get my rooms
export const getMyRooms = (token) => async (dispatch) => {
    try {
        const res = await axios.get(`${ApiServerHost}${ApiEndPoints.getMyRooms}`, {
            headers: {
                "x-auth-token": token,
            },
        });

        dispatch({
            type: GET_MYROOMS,
            payload: res.data,
        });
    } catch (err) {
        console.log("there is an error in getmyRooms");
    }
};
