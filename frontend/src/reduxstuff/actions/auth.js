import {
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  AUTH_ERROR,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
  CLEAR_ROOMS,
  CLEAR_PROFILES,
  // CLEAR_PROFILE,
} from "./types";
import axios from "axios";
// import { setAlert } from './alert';
import setAuthToken from "../utils/setAuthToken";
import { createProfile, getCurrentProfile } from "./profile";

//  Load User
export const loadUser = () => async (dispatch) => {
  // set header
  console.log(localStorage.token);
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("http://127.0.0.1:5000/api/login");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.log("there is an error userdata-loading");
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

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
      "http://127.0.0.1:5000/api/signup",
      body,
      config
    );

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(createProfile());
  } catch (err) {
    console.log(err);
    // const errors = err.response.data.errors; // This errors will come from backend that we setted as errors.array

    // if (errors) {
    //   errors.forEach((error) => {
    //     dispatch(setAlert(error.msg, "danger"));
    //   });
    // }

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
      "http://127.0.0.1:5000/api/login",
      body,
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
    dispatch(getCurrentProfile());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        // dispatch(setAlert(error.msg, "danger"));
        alert(error.msg);
      });
    }
    console.log(err);
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
