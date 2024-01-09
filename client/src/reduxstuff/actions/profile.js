import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

import {
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
} from "./types";

// Get current users profile
export const getCurrentProfile = (token) => async (dispatch) => {
    try {
        const res = await axios.get("/api/profile/me", {
            headers: {
                "x-auth-token": token,
            },
        });
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });
    } catch (err) {
        // console.error(err.response.data.msg);
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Get all profiles
export const getProfiles = (username) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/profile/user/${username}`);

        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};

// Create or update profile
export const updateProfile = (socketId) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify({ socketId });

        const res = await axios.post("/api/profile/me", body, config);

        setAuthToken(res.data.token);

        localStorage.setItem("token", res.data.token);
        dispatch({
            type: UPDATE_PROFILE,
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

        dispatch({
            type: PROFILE_ERROR,
            payload: {
                msg: err.response.statusText,
                status: err.response.status,
            },
        });
    }
};
