import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { login } from "../reduxstuff/actions/auth";
import { useDispatch, useSelector } from "react-redux";

const Landing = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const myprofile = useSelector((state) => state.profile.myprofile);

  // if (isAuthenticated && !myprofile) {
  //   return <div>Loading your data</div>;
  // } else if (isAuthenticated && myprofile) {
  //   return <Redirect to="/main" />;
  // } else {
  //   <Redirect to="/login" />;
  // }

  // const Landing = ({ isAuthenticated }) => {
  // if (isAuthenticated) {
  //   return <Redirect to="/main" />;
  // }

  return (
    <section className="">
      <h1 className="" style={{ textAlign: "center" }}>
        LavChatApp...
      </h1>
      <p style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Create a group/room with your friends, idols and do networking ,share
        your thoughts, enjoyments and chat with them...
      </p>
      <div
        className
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Link to="/signup" className="" style={{}}>
          Sign Up
        </Link>
        <Link to="/login" className="">
          Login
        </Link>
      </div>
    </section>
  );
  // };
};
export default Landing;
