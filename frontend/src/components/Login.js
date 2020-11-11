import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { login } from "../reduxstuff/actions/auth";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login(formData.email, formData.password));
    setformData({
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
    return <Redirect to="/main" />;
  }
  return (
    <div
      style={{
        marginRight: "20%",
        marginLeft: "20%",
        borderRadius: "5px",
        backgroundColor: "#f2f2f2",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <form action="form" onSubmit={(e) => handleSubmit(e)}>
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
        <input type="submit" value="Login" />
      </form>
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};
export default Login;
