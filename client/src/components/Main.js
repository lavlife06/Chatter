/* eslint-disable eqeqeq */
import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import Spinner from "./Layout/Spinner";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { updateProfile } from "../reduxstuff/actions/profile";
import RoomStack from "./ChatComponent/roomStack";
import { SETUP_SOCKET } from "../reduxstuff/actions/types";

const Main = () => {
    const dispatch = useDispatch();

    const myRoomsLoading = useSelector((state) => state.room.loading);
    const myprofileLoading = useSelector((state) => state.profile.loading);
    const myprofile = useSelector((state) => state.profile.myprofile);
    const socket = useSelector((state) => state.auth.socket);
    const token = useSelector((state) => state.auth.token);

    const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
    const [isPriModalVisible, setIsPriModalVisible] = useState(false);

    useEffect(() => {
        let socketinstance;
        if (token) {
            socketinstance = io("localhost:5000", {
                query: {
                    token,
                },
            });
            // let mysocketid;
            let checker = setInterval(() => {
                if (socketinstance.connected) {
                    if (myprofile.socketId != "") {
                        socketinstance.id = myprofile.socketId;
                    } else {
                        dispatch(updateProfile(socketinstance.id));
                    }
                    dispatch({ type: SETUP_SOCKET, payload: socketinstance });

                    socketinstance.emit("joined", {
                        name: myprofile.name,
                    });

                    clearInterval(checker);
                }
            }, 700);
        }

        return () => {
            if (token) {
                socketinstance.disconnect(true);
                socketinstance.off("joined");
            }
        };
    }, []);

    if (!myRoomsLoading && !myprofileLoading && socket) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div className="maindiv1">
                    {/* left part of header */}
                    <Fragment>
                        <Button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "800",
                                marginLeft: "1vw",
                                borderRadius: "15px",
                                fontSize: "2.5vh",
                            }}
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setIsPriModalVisible(false);
                                setIsGroupModalVisible(true);
                            }}
                        >
                            Create Room
                        </Button>
                        <Button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "800",
                                marginLeft: "1vw",
                                borderRadius: "15px",
                                fontSize: "2.5vh",
                            }}
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setIsGroupModalVisible(false);
                                setIsPriModalVisible(true);
                            }}
                        >
                            Chat Private
                        </Button>
                    </Fragment>
                </div>
                <div className="maindiv2">
                    <RoomStack
                        isGroupModalVisible={isGroupModalVisible}
                        setIsGroupModalVisible={setIsGroupModalVisible}
                        isPriModalVisible={isPriModalVisible}
                        setIsPriModalVisible={setIsPriModalVisible}
                    />
                </div>
            </div>
        );
    } else {
        return <Spinner />;
    }
};

export default Main;
