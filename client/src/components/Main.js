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
    const [showGroupChat, setShowGroupChat] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

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
    }, []);

    // useEffect(() => {
    //     console.log(myprofileLoading, myRoomsLoading);

    //     console.log(
    //         "inside mount of Main, socketinstance before",
    //         socketinstance.connected
    //     );

    //     console.log(
    //         "inside mount of Main, socketinstance after",
    //         socketinstance
    //     );

    //     return () => {
    //         console.log(socketinstance);
    //         socketinstance.disconnect(true);
    //         console.log("inside unmount of Main");
    //         socketinstance.off("joined");
    //         console.log(socketinstance);
    //     };
    // }, [socketinstance]);

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
                            onClick={showModal}
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
                            onClick={showModal}
                        >
                            Chat Private
                        </Button>
                    </Fragment>

                    {/* right part of header */}
                    <div style={{ display: "flex", justifyContent: "row" }}>
                        <Button
                            className={
                                showGroupChat ? "truetablink" : "tablink"
                            }
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "800",
                            }}
                            onClick={() => {
                                if (!showGroupChat) {
                                    dispatch({ type: CLEAR_PARTICULAR_ROOM });
                                    setShowGroupChat(true);
                                }
                            }}
                        >
                            GroupChat
                        </Button>
                        <Button
                            className={
                                showGroupChat ? "tablink" : "truetablink"
                            }
                            style={{
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "800",
                            }}
                            onClick={() => {
                                if (showGroupChat) {
                                    dispatch({ type: CLEAR_PARTICULAR_ROOM });
                                    setShowGroupChat(false);
                                }
                            }}
                        >
                            PrivateChat
                        </Button>
                    </div>
                </div>
                <div className="maindiv2">
                    {showGroupChat ? (
                        <GrpChatCompo
                            socket={socket}
                            isModalVisible={isModalVisible}
                            setIsModalVisible={setIsModalVisible}
                        />
                    ) : (
                        <PriChatCompo
                            socket={socket}
                            isModalVisible={isModalVisible}
                            setIsModalVisible={setIsModalVisible}
                        />
                    )}
                </div>
            </div>
        );
    } else {
        return <Spinner />;
    }
};

export default Main;
