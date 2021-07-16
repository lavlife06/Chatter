import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../reduxstuff/actions/auth";
import "./layout.css";
import { Button } from "antd";

const Navbar = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const myprofileLoading = useSelector((state) => state.profile.loading);
    const myRoomsLoading = useSelector((state) => state.room.loading);
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
                            dispatch(logout());
                        }}
                    >
                        Login
                    </Link>
                </Fragment>
            )}
            {isAuthenticated && !myprofileLoading && !myRoomsLoading && (
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
                                backgroundColor: "white",
                            }}
                            icon={
                                <i
                                    class="fas fa-sign-out-alt"
                                    style={{
                                        fontSize: "2.5vh",
                                        marginRight: "3px",
                                    }}
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
