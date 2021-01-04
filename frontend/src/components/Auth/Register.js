import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { register } from "../../reduxstuff/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Layout/Spinner";
import "../Layout/layout.css";
import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import loginImage from "./loginImage.jpg";

const Register = () => {
  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const myprofile = useSelector((state) => state.profile.myprofile);

  const handleSubmit = () => {
    // e.preventDefault();
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
        flexDirection: "row",
        backgroundColor: "#01ffb6",
        fontSize: "4vh",
      }}
    >
      <div style={{ flex: 3, marginRight: "2%" }}>
        <img
          src={loginImage}
          style={{ width: "100%", height: "100%" }}
          alt="login image"
        />
      </div>
      <div
        style={{
          flex: 2,
        }}
      >
        <Form
          size="large"
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
            hasFeedback
          >
            <Input
              style={{
                borderRadius: "15px",
              }}
              name="name"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={(e) => {
                changeHandler(e);
              }}
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
            hasFeedback
          >
            <Input
              style={{
                borderRadius: "15px",
              }}
              name="email"
              prefix={<i class="far fa-envelope" />}
              placeholder="Email"
              type="email"
              onChange={(e) => {
                changeHandler(e);
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password
              style={{
                borderRadius: "15px",
              }}
              name="password"
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              onChange={(e) => {
                changeHandler(e);
              }}
            />
          </Form.Item>
          <Form.Item
            style={{
              fontSize: "2.5vh",
              fontWeight: "500",
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
              onSubmit={handleSubmit}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <p>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              display: "inline-block",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              size="large"
              style={{
                backgroundColor: "rgb(0, 21, 41)",
                color: "#a9fd00",
                borderRadius: "15px",
              }}
            >
              Login
            </Button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
