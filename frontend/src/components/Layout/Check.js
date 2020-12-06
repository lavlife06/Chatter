import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { login } from "../../reduxstuff/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "./Spinner";

const Check = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const myprofile = useSelector((state) => state.profile.myprofile);

  if (isAuthenticated && !myprofile) {
    return <Spinner />;
  } else if (isAuthenticated && myprofile) {
    return <Redirect to="/main" />;
  } else {
    <Redirect to="/login" />;
  }
};
export default Check;