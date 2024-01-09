/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_ROOM_BY_ID } from "../../reduxstuff/actions/types";
import "./chat.css";
import { Input } from "antd";
import Spinner from "../Layout/Spinner";
import { ArrowLeftOutlined } from "@ant-design/icons";

const ChatWindow = ({
    selectedRoom,
    changeRoomsStack,
    theRooms,
    setSelectedRoom,
}) => {
    const dispatch = useDispatch();

    const myprofile = useSelector((state) => state.profile.myprofile);
    const socket = useSelector((state) => state.auth.socket);

    const [loading, setLoading] = useState(true);
    const [chattext, setChatText] = useState("");
    const [chats, setChats] = useState([]);

    const { user, name } = myprofile;
    const myParticularRoom = useSelector((state) => state.room.particularRoom);

    useEffect(() => {
        socket.on("getRoomById", ({ room }) => {
            dispatch({ type: GET_ROOM_BY_ID, payload: room });
        });
        if (myParticularRoom) {
            if (myParticularRoom._id == selectedRoom._id) {
                setLoading(false);
                setChats(myParticularRoom.chats);
            }
        }
        return () => {
            socket.off("getRoomById");
            // console.log("inside unmount of getroombyid");
        };
    }, [myParticularRoom]);

    useEffect(() => {
        if (myParticularRoom) {
            if (myParticularRoom.roomtype == "private") {
                socket.emit("joinedPriRoom", {
                    roomIds: myParticularRoom.roomIds,
                });
            } else {
                socket.emit(
                    "joinedRoom",
                    {
                        roomId: myParticularRoom._id,
                    },
                    ({ welcomeMessage }) => {
                        alert(welcomeMessage);
                    }
                );
            }
        }
        return () => {
            if (myParticularRoom) {
                if (myParticularRoom.roomtype == "private") {
                    socket.emit("leavePriRoom", {
                        roomIds: myParticularRoom.roomIds,
                    });
                    socket.off("joinedPriRoom");
                } else {
                    socket.emit("leaveRoom", {
                        room: myParticularRoom._id,
                    });
                    socket.off("joinedRoom");
                }
            }
        };
    }, [myParticularRoom]);

    const sendMessage = (e) => {
        e.preventDefault();

        if (myParticularRoom.roomtype == "private") {
            if (chattext) {
                socket.emit("sendPriMessage", {
                    user,
                    name,
                    text: chattext,
                    roomIds: myParticularRoom.roomIds,
                });
            }
        } else {
            if (chattext) {
                socket.emit("sendGrpMessage", {
                    user,
                    name,
                    text: chattext,
                    room: myParticularRoom._id,
                });
            }
        }

        // Changing room stack
        theRooms.forEach((arritem, index) => {
            if (arritem._id == selectedRoom._id) {
                arritem.chats.push({
                    user: myprofile.user,
                    name: myprofile.name,
                    text: chattext,
                });
                if (index != 0) {
                    theRooms.splice(index, 1);
                    theRooms.splice(0, 0, arritem);
                }
            }
        });

        changeRoomsStack(theRooms);
        setChatText("");
    };

    const theScrollToBottom = () => {
        let chatContainer = document.getElementById("chatcontainer");
        if (chatContainer) {
            let scroll =
                chatContainer.scrollHeight - chatContainer.clientHeight;
            chatContainer.scrollTo(0, scroll);
        }
    };

    useEffect(() => {
        if (myParticularRoom) {
            socket.on("message", ({ user, name, text }) => {
                setChats((prevchats) => [...prevchats, { user, name, text }]);
            });
            theScrollToBottom();
        }

        return () => {
            if (myParticularRoom) {
                socket.off("message");
            }
        };
    }, [chats]);

    if (loading) {
        return <Spinner type={"roomloading"} />;
    }
    return (
        // <div style={{ padding: "2px" }}>
        <Fragment>
            <div className="groupinfodiv">
                <ArrowLeftOutlined
                    className="backarrow"
                    onClick={() => {
                        setSelectedRoom(null);
                        if (myParticularRoom.roomtype == "private") {
                            socket.emit("leavePriRoom", {
                                roomIds: myParticularRoom.roomIds,
                            });
                            socket.off("joinedPriRoom");
                        } else {
                            socket.emit("leaveRoom", {
                                room: myParticularRoom._id,
                            });
                            socket.off("joinedRoom");
                        }
                    }}
                />
                {myParticularRoom.roomtype === "group" ? (
                    <i className="fas fa-users roomicon" />
                ) : (
                    <i className="far fa-user roommyprofileicon" />
                )}
                <strong className="roomName">
                    {myParticularRoom.roomName}
                </strong>
            </div>
            <div id="chatcontainer">
                {chats.map((item) => (
                    <Fragment>
                        {item.name === name ? (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    marginBottom: "0.8vh",
                                }}
                            >
                                <strong className="minechatblockdiv">
                                    {item.text}
                                </strong>
                            </div>
                        ) : (
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    marginBottom: "0.8vh",
                                }}
                            >
                                {myParticularRoom.roomtype === "group" ? (
                                    <strong className="groupchatblockdiv">
                                        <div className="groupmembername">
                                            {item.name}
                                        </div>
                                        {item.text}
                                    </strong>
                                ) : (
                                    <strong className="privatechatblockdiv">
                                        {item.text}
                                    </strong>
                                )}
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
            <div className="chatinput">
                <Input
                    type="text"
                    name="text"
                    value={chattext}
                    placeholder="Share your views here"
                    onChange={(e) => {
                        setChatText(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        // console.log(e.key);
                        if (e.key === "Enter") {
                            sendMessage(e);
                        }
                    }}
                    style={{
                        flex: 1,
                        fontWeight: "500",
                        fontSize: "2.2vh",
                        borderRadius: "15px",
                        margin: "5px 0px 5px 10px",
                    }}
                />
                <i
                    onClick={(e) => {
                        // console.log(e);
                        sendMessage(e);
                    }}
                    className="far fa-paper-plane"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "black",
                        backgroundColor: "white",
                        fontSize: "18px",
                        fontWeight: "bold",
                        paddingBottom: "1px",
                        width: "4vw",
                        minWidth: "45px",
                        borderBottomRightRadius: "12px",
                    }}
                />
            </div>
        </Fragment>
    );
};

export default ChatWindow;
