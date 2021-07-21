/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { register } from "../../reduxstuff/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import "../Layout/layout.css";
import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import AuthSvg from "../../svg/authSvg";

const Register = () => {
    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const myprofileLoading = useSelector((state) => state.profile.loading);
    const myRoomsLoading = useSelector((state) => state.room.loading);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && !myprofileLoading && !myRoomsLoading) {
            setLoading(false);
        }
    }, [isAuthenticated, myprofileLoading, myRoomsLoading]);

    const handleSubmit = () => {
        // e.preventDefault();
        dispatch(register(formData.name, formData.email, formData.password));
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
        return false;
    };

    const changeHandler = (e) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    if (isAuthenticated && !myprofileLoading && !myRoomsLoading) {
        // console.log(isAuthenticated, myprofileLoading, myRoomsLoading);
        return <Redirect to="/main" />;
    }

    return (
        <div className="auth">
            <div
                className="authsvgregister"
                style={{ flex: 3, marginRight: "2%", height: "55vh" }}
            >
                <AuthSvg />
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
                        style={{
                            marginBottom: "13px",
                        }}
                    >
                        <Input
                            style={{
                                borderRadius: "15px",
                            }}
                            name="name"
                            prefix={
                                <UserOutlined className="site-form-item-icon" />
                            }
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
                        style={{
                            marginBottom: "13px",
                        }}
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
                        style={{
                            marginBottom: "13px",
                        }}
                    >
                        <Input.Password
                            style={{
                                borderRadius: "15px",
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
                            margin: "0px",
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

                    <Form.Item
                        style={{
                            marginBottom: "9px",
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={loading}
                            style={{
                                width: "100%",
                                backgroundColor: "white",
                                color: "rgb(24, 144, 255)",
                                padding: "0px",
                                height: "5vh",
                            }}
                            onSubmit={handleSubmit}
                        >
                            Sign Up
                        </Button>
                    </Form.Item>
                </Form>
                <p
                    style={{
                        fontSize: "20px",
                        marginBottom: "0px",
                    }}
                >
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
                                display: "flex",
                                backgroundColor: "rgb(24, 144, 255)",
                                color: "white",
                                borderRadius: "15px",
                                height: "5vh",
                                alignItems: "center",
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
