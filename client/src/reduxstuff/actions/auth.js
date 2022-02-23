import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_PROFILE,
    CLEAR_ROOMS,
    CLEAR_PROFILES,
    // CLEAR_PROFILE,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import { getCurrentProfile } from "./profile";
import { getMyRooms } from "./room";

// Regiseter user
export const register = (name, email, password) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post(
            "https://chatter-chatapplication.herokuapp.com/api/signup",
            body,
            config
        );

        setAuthToken(res.data.token);

        localStorage.setItem("token", res.data.token);

        dispatch(getMyRooms(res.data.token));

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        // console.log(err);
        const errors = err.response.data.errors; // This errors will come from backend that we setted as errors.array

        if (errors) {
            errors.forEach((error) => {
                dispatch(setAlert(error.msg, "error"));
            });
        }

        dispatch({
            type: REGISTER_FAIL,
        });
    }
};

// Login user
export const login = (email, password) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post(
            "https://chatter-chatapplication.herokuapp.com/api/login",
            body,
            config
        );

        setAuthToken(res.data.token);

        localStorage.setItem("token", res.data.token);

        dispatch(getCurrentProfile(res.data.token));
        dispatch(getMyRooms(res.data.token));

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
        });
    } catch (err) {
        const errors = err.response.data.errors;
        // console.log(err);
        if (errors) {
            errors.forEach((error) => {
                dispatch(setAlert(error.msg, "error"));
                // alert(error.msg);
            });
        }
        // console.log(err);
        dispatch({
            type: LOGIN_FAIL,
        });
    }
};

// Logout / Clear Profile
export const logout = () => (dispatch) => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: CLEAR_PROFILES });
    dispatch({ type: CLEAR_ROOMS });
    dispatch({ type: LOGOUT });
};
