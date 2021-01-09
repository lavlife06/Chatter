import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { login } from "../../reduxstuff/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./Spinner";
import { getMyRooms } from "../../reduxstuff/actions/room";

const Check = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const myprofile = useSelector((state) => state.profile.myprofile);
  const myprofileLoading = useSelector((state) => state.profile.loading);

  console.log(myprofile);
  if (isAuthenticated && myprofileLoading) {
    return <Spinner />;
  } else if (isAuthenticated && !myprofileLoading) {
    console.log(myprofile);
    dispatch(getMyRooms());
    return <Redirect to="/main" />;
  } else {
    return <Spinner />;

    // <Redirect to="/login" />;
  }
};
export default Check;
