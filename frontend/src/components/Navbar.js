import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../reduxstuff/actions/auth";

const Navbar = () => {
  const dispatch = useDispatch();

  return (
    <div
      style={{
        marginRight: "10%",
        marginLeft: "10%",
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
        style={
          {
            /*textAlign: "center" */
          }
        }
      >
        LavChat
      </h2>
      <Link
        to="/login"
        onClick={() => {
          dispatch(logout());
        }}
      >
        Logout
      </Link>
    </div>
  );
};

export default Navbar;
