import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../reduxstuff/actions/auth";
import "./layout.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="navbardiv">
      <h2
        style={{
          /*textAlign: "center" */
          flex: 5,
        }}
      >
        LavChatApp
      </h2>
      {!isAuthenticated && (
        <Fragment>
          <Link
            id="register"
            className="register"
            to="/signup"
            onClick={() => {
              let login = document.getElementById("login");
              let register = document.getElementById("register");
              register.style.backgroundColor = "#a9fd00";
              login.style.backgroundColor = "#3ff5df";
              dispatch(logout());
            }}
          >
            SignUp
          </Link>
          <Link
            id="login"
            className="login"
            to="/login"
            onClick={() => {
              let login = document.getElementById("login");
              let register = document.getElementById("register");
              login.style.backgroundColor = "#a9fd00";
              register.style.backgroundColor = "#3ff5df";
              dispatch(logout());
            }}
          >
            Login
          </Link>
        </Fragment>
      )}
      {isAuthenticated && (
        <Fragment>
          <Link
            to="/login"
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </Link>
        </Fragment>
      )}
    </div>
  );
};

export default Navbar;
