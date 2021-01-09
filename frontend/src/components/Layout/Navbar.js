import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../reduxstuff/actions/auth";
import "./layout.css";
import { Button } from "antd";

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="navbardiv">
      <div className="appname">Chatter</div>
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
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "800",
                borderRadius: "15px",
                fontSize: "2.5vh",
                backgroundColor: "cyan",
              }}
              icon={
                <i
                  class="fas fa-sign-out-alt"
                  style={{ fontSize: "2.5vh", marginRight: "3px" }}
                />
              }
              onClick={() => {
                dispatch(logout());
              }}
            >
              Log Out
            </Button>
          </Link>
        </Fragment>
      )}
    </div>
  );
};

export default Navbar;
