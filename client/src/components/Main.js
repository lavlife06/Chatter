import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import GrpChatCompo from "./ChatComponent/GrpChatCompo";
import PriChatCompo from "./ChatComponent/PriChatCompo";
import { CLEAR_PARTICULAR_ROOM } from "../reduxstuff/actions/types";
import Spinner from "./Layout/Spinner";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { updateProfile } from "../reduxstuff/actions/profile";
let socket;

const Main = ({ location }) => {
    const dispatch = useDispatch();

    const myRoomsLoading = useSelector((state) => state.room.loading);
    const myprofileLoading = useSelector((state) => state.profile.loading);
    const myprofile = useSelector((state) => state.profile.myprofile);

    // const [socket, setSocket] = useState(null);
    const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
    const [isPriModalVisible, setIsPriModalVisible] = useState(false);

    useEffect(() => {
        socket = io("localhost:5000", {
            // query: {
            //   token: localStorage.getItem("token"),
            // },
        });
        // let mysocketid;
        let checker = setInterval(() => {
            if (socket.connected) {
                console.log(socket.id);

                dispatch(updateProfile(socket.id));

                socket.emit("joined", {
                    name: myprofile.name,
                });

                clearInterval(checker);
            }
        }, 700);

        return () => {
            console.log(socket);
            socket.disconnect(true);
            console.log("inside unmount of Main");
            socket.off("joined");
            console.log(socket);
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
                    <GrpChatCompo
                        socket={socket}
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
