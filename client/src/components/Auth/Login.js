import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { login } from "../../reduxstuff/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import "../Layout/layout.css";
import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox } from "antd";
import { LockOutlined } from "@ant-design/icons";
import loginImage from "./loginImage.jpg";
import { getCurrentProfile } from "../../reduxstuff/actions/profile";
import { getMyRooms } from "../../reduxstuff/actions/room";

const Login = () => {
    const [formData, setformData] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const myprofileLoading = useSelector((state) => state.profile.loading);
    const myRoomsLoading = useSelector((state) => state.room.loading);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getCurrentProfile());
            dispatch(getMyRooms());
        }
    }, [isAuthenticated]);

    const handleSubmit = () => {
        // e.preventDefault();

        dispatch(login(formData.email, formData.password));
        return false;
    };

    const changeHandler = (e) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    if (isAuthenticated && !myprofileLoading && !myRoomsLoading) {
        console.log(isAuthenticated, myprofileLoading, myRoomsLoading);
        return <Redirect to="/main" />;
    }
    console.log(formData);
    return (
        <div
            style={{
                marginRight: "20%",
                marginLeft: "20%",
                borderRadius: "5px",
                backgroundColor: "#f2f2f2",
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
                                // lineHeight: "4vh",
                                // fontSize: "3vh",
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
                                // lineHeight: "4vh",
                                // fontSize: "3vh",
                            }}
                            name="password"
                            prefix={
                                <LockOutlined className="site-form-item-icon" />
                            }
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
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            noStyle
                        >
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
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
                <p>
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
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
                            SignUp
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    );
};
export default Login;
