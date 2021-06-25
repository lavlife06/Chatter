import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useSelector } from "react-redux";
import Spinner from "./Layout/Spinner";

const PrivateRoute = ({ component: Component, ...rest }) => {
    const myRoomsLoading = useSelector((state) => state.room.loading);
    const myprofileLoading = useSelector((state) => state.profile.loading);
    const token = useSelector((state) => state.auth.token);
    console.log(!myprofileLoading, !myRoomsLoading, token);
    return (
        <Route
            {...rest}
            render={(props) =>
                !myprofileLoading && !myRoomsLoading && token ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;
