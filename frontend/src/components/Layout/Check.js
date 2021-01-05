import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { login } from "../../reduxstuff/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./Spinner";
import { getMyRooms } from "../../reduxstuff/actions/room";
import { getCurrentProfile } from "../../reduxstuff/actions/profile";

const Check = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(getCurrentProfile());
    dispatch(getMyRooms());
  }, [isAuthenticated]);

  const myprofile = useSelector((state) => state.profile.myprofile);
  const myprofileLoading = useSelector((state) => state.profile.loading);

  console.log(myprofile);
  if (isAuthenticated && myprofileLoading) {
    return <Spinner />;
  } else if (isAuthenticated && !myprofileLoading) {
    return <Redirect to="/main" />;
  } else {
    return <Redirect to="/login" />;
  }
};
export default Check;
