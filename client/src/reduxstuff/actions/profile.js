import axios from "axios";

import {
    GET_PROFILE,
    GET_PROFILES,
    // GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    // UPDATE_PROFILE,
    // CLEAR_PROFILE,
    // ACCOUNT_DELETED,
    // GET_REPOS,
    // NO_REPOS,
} from "./types";

// Get current users profile
export const getCurrentProfile = (token) => async (dispatch) => {
    try {
        const res = await axios.get("http://localhost:5000/api/profile/me", {
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
        const res = await axios.get(
            `http://localhost:5000/api/profile/user/${username}`
        );

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
export const createProfile = () => async (dispatch) => {
    try {
        // const config = {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // };

        // const body = JSON.stringify({ name, email });

        const res = await axios.post(
            "http://localhost:5000/api/profile/me"
            // body,
            // config
        );

        dispatch({
            type: GET_PROFILE,
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

// Create or update profile
export const updateProfile = (socketId) => async (dispatch) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify({ socketId });

        const res = await axios.post(
            "http://localhost:5000/api/profile/me",
            body,
            config
        );

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

// Get profile by ID
export const getProfileById = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(
            `http://localhost:5000/api/profile/user/${userId}`
        );

        dispatch({
            type: GET_PROFILE,
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

// // Add Experience
// export const addExperience = (formData, history) => async (dispatch) => {
//   try {
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     };

//     const res = await axios.put(
//       "http://localhost:5000/api/profile/experience",
//       formData,
//       config
//     );

//     dispatch({
//       type: UPDATE_PROFILE,
//       payload: res.data,
//     });

//     dispatch(setAlert("Experience Added", "success"));

//     history.push("/dashboard");
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
//     }

//     dispatch({
//       type: PROFILE_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status },
//     });
//   }
// };

// // Add Education
// export const addEducation = (formData, history) => async dispatch => {
//   try {
//     const config = {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     };

//     const res = await axios.put('http://localhost:5000/api/profile/education', formData, config);

//     dispatch({
//       type: UPDATE_PROFILE,
//       payload: res.data
//     });

//     dispatch(setAlert('Education Added', 'success'));

//     history.push('/dashboard');
//   } catch (err) {
//     const errors = err.response.data.errors;

//     if (errors) {
//       errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
//     }

//     dispatch({
//       type: PROFILE_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

// Delete experience
// export const deleteExperience = (id) => async (dispatch) => {
//   try {
//     const res = await axios.delete(
//       `http://localhost:5000/api/profile/experience/${id}`
//     );

//     dispatch({
//       type: UPDATE_PROFILE,
//       payload: res.data,
//     });

//     dispatch(setAlert("Experience Removed", "success"));
//   } catch (err) {
//     dispatch({
//       type: PROFILE_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status },
//     });
//   }
// };

// // Delete education
// export const deleteEducation = id => async dispatch => {
//   try {
//     const res = await axios.delete(`http://localhost:5000/api/profile/education/${id}`);

//     dispatch({
//       type: UPDATE_PROFILE,
//       payload: res.data
//     });

//     dispatch(setAlert('Education Removed', 'success'));
//   } catch (err) {
//     dispatch({
//       type: PROFILE_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

// Delete account & profile
// export const deleteAccount = () => async (dispatch) => {
//   if (window.confirm("Are you sure? This can NOT be undone!")) {
//     try {
//       await axios.delete("http://localhost:5000/api/profile");

//       dispatch({ type: CLEAR_PROFILE });
//       dispatch({ type: ACCOUNT_DELETED });

//       dispatch(setAlert("Your account has been permanantly deleted"));
//     } catch (err) {
//       dispatch({
//         type: PROFILE_ERROR,
//         payload: { msg: err.response.statusText, status: err.response.status },
//       });
//     }
//   }
// };
