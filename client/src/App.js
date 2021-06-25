/* eslint-disable no-unused-vars */
import React, { useState, Fragment, useEffect } from "react";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Main from "./components/Main";
import "./App.css";
import TheAlertCompo from "./components/Layout/Alert";
import PrivateRoute from "./components/privateRoute";
import store from "./reduxstuff/store";
import { useDispatch, useSelector } from "react-redux";
import setAuthToken from "./reduxstuff/utils/setAuthToken";
import { getCurrentProfile } from "./reduxstuff/actions/profile";
import { getMyRooms } from "./reduxstuff/actions/room";
import { LOGIN_SUCCESS } from "./reduxstuff/actions/types";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            setAuthToken(token);
            dispatch({ type: LOGIN_SUCCESS, payload: { token } });
            dispatch(getCurrentProfile(token));
            dispatch(getMyRooms(token));
        }
    }, []);

    return (
        <Router>
            <Fragment>
                <Navbar />
                <PrivateRoute exact path="/" component={Login} />
                <TheAlertCompo />
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={Register} />
                    <PrivateRoute exact path="/main" component={Main} />
                </Switch>
            </Fragment>
        </Router>
    );
};

export default App;
