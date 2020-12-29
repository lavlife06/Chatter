import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { register } from "../../reduxstuff/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Layout/Spinner";
import "../Layout/layout.css";

const Register = () => {
  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const myprofile = useSelector((state) => state.profile.myprofile);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData.name, formData.email, formData.password));
    setformData({
      name: "",
      email: "",
      password: "",
    });
  };

  const changeHandler = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  if (isAuthenticated) {
    return <Redirect to="/check" />;
  }

  return (
    <div
      style={{
        marginRight: "20%",
        marginLeft: "20%",
        borderRadius: "5px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#01ffb6",
      }}
    >
      <form action="form" onSubmit={(e) => handleSubmit(e)}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Your name.."
          value={formData.name}
          onChange={(e) => changeHandler(e)}
          style={{ width: "100%" }}
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Your email.."
          value={formData.email}
          onChange={(e) => changeHandler(e)}
          style={{ width: "100%" }}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Your password..."
          value={formData.password}
          onChange={(e) => changeHandler(e)}
          style={{ width: "100%", marginBottom: "12px" }}
        />
        <input type="submit" value="SignUp" />
      </form>
      <p>
        Already have an account?{" "}
        <Link
          className="login"
          to="/login"
          style={{
            display: "inline-block",
            paddingTop: "3px",
            paddingBottom: "3px",
            backgroundColor: "rgb(0, 21, 41)",
            alignItems: "center",
            color: "#a9fd00",
          }}
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
