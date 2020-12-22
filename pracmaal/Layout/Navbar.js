import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../reduxstuff/actions/auth";

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        marginRight: "10%",
        marginLeft: "10%",
        paddingRight: "10px",
        paddingLeft: "10px",
        borderWidth: "2px",
        borderColor: "black",
        borderStyle: "solid",
        borderRadius: "5px",
        backgroundColor: "#12f5a4de",
        lineHeight: "20px",
        marginBottom: "10px",
      }}
    >
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
            className
            to="/signup"
            onClick={() => {
              dispatch(logout());
            }}
          >
            SignUp
          </Link>
          <Link
            to="/login"
            onClick={() => {
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