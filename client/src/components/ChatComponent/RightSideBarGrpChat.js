import React, { Fragment, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_ROOM_BY_ID } from "../../reduxstuff/actions/types";
import "./chat.css";
import { SendOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";

const RightSideBarGrpChat = ({
    selectedRoom,
    location,
    socket,
    changeRoomsStack,
    theRooms,
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [chattext, setChatText] = useState("");
    const [chats, setChats] = useState([]);

    const myprofile = useSelector((state) => state.profile.myprofile);

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
            console.log("inside unmount of getroombyid");
        };
    }, [myParticularRoom]);

    useEffect(() => {
        if (myParticularRoom) {
            if (myParticularRoom.roomtype == "private") {
                console.log("inside useEffect for joined", myParticularRoom);
                socket.emit("joinedPriRoom", {
                    roomIds: myParticularRoom.roomIds,
                });
            } else {
                socket.emit(
                    "joinedRoom",
                    {
                        user,
                        name,
                        room: myParticularRoom.roomName,
                        roomId: myParticularRoom._id,
                    },
                    ({ welcomeMessage }) => {
                        alert(welcomeMessage);
                    }
                );
            }
            console.log("inside useEffect for joined");
        }
        return () => {
            if (myParticularRoom) {
                if (myParticularRoom.roomtype == "private") {
                    socket.emit("leavePriRoom", {
                        roomIds: myParticularRoom.roomIds,
                    });
                    console.log("inside unmount of RightSideBarPriChat");
                    socket.off("joinedPriRoom");
                } else {
                    socket.emit("leaveRoom", {
                        user,
                        name,
                        room: myParticularRoom._id,
                    });
                    console.log("inside unmount of RightSideBar");
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
        // if (theRooms.length > 1) {
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
        console.log(theRooms);

        changeRoomsStack(theRooms);
        // }
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
            console.log("inside useEffect for message");
            theScrollToBottom();
        }

        return () => {
            if (myParticularRoom) {
                socket.off("message");
                console.log("inside unmount of off.message(RightSideBar)");
            }
        };
    }, [chats]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        // <div style={{ padding: "2px" }}>
        <Fragment>
            <div className="groupinfodiv">
                <i
                    className="fas fa-users usersIcon"
                    style={{
                        fontSize: "20px",
                        borderColor: "aquamarine",
                        padding: "7px 5px",
                    }}
                />
                <strong
                    style={{
                        color: "aquamarine",
                        fontSize: "25px",
                        marginBottom: "6px",
                    }}
                >
                    {myParticularRoom.roomName}
                </strong>
            </div>
            <div
                id="chatcontainer"
                style={{ height: "90%", overflowY: "scroll", padding: "7px" }}
            >
                {/* <ScrollToBottom className="scrollBottom"> */}
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
                                <strong
                                    className="chatblockdiv"
                                    style={{
                                        borderTopRightRadius: "initial",
                                        fontSize: "17px",
                                        padding: "5px 10px",
                                    }}
                                >
                                    {" "}
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
                                <strong
                                    className="chatblockdiv"
                                    style={{
                                        borderTopLeftRadius: "initial",
                                        fontSize: "17px",
                                        padding: "5px 10px",
                                    }}
                                >
                                    <div style={{ color: "yellow" }}>
                                        {item.name}
                                    </div>
                                    {item.text}
                                </strong>
                            </div>
                        )}
                    </Fragment>
                ))}
            </div>
            {/* </ScrollToBottom> */}

            <div
                style={{
                    height: "42px",
                    display: "flex",
                    flexDirection: "row",
                    padding: "2px",
                    backgroundColor: "black",
                }}
            >
                <Input
                    type="text"
                    name="text"
                    value={chattext}
                    placeholder="Share your views here"
                    onChange={(e) => {
                        setChatText(e.target.value);
                    }}
                    onKeyPress={(e) => {
                        console.log(e.key);
                        if (e.key === "Enter") {
                            sendMessage(e);
                        }
                    }}
                    style={{
                        flex: 1,
                        fontWeight: "500",
                        fontSize: "3vh",
                        borderRadius: "15px",
                        margin: "5px 0px 5px 10px",
                    }}
                />
                <i
                    onClick={(e) => {
                        console.log(e);
                        sendMessage(e);
                    }}
                    className="far fa-paper-plane"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "aquamarine",
                        backgroundColor: "black",
                        fontSize: "18px",
                        fontWeight: "bold",
                        paddingBottom: "1px",
                        width: "4vw",
                        minWidth: "45px",
                    }}
                />
            </div>
        </Fragment>
    );
};

export default RightSideBarGrpChat;
