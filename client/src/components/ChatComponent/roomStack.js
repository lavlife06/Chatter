/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    CLEAR_PROFILES,
    UPDATE_PRICHATROOMS,
} from "../../reduxstuff/actions/types";
import "./chat.css";
import { Button, Modal } from "antd";
import CreateRoomModal from "./chatModals/CreateRoomModal";
import ChatPrivateModal from "./chatModals/ChatPrivateModal";
import Rooms from "./rooms";
import ChatWindow from "./chatWindow";
// import Helper from "../helperFunctions/helper";

const RoomStack = () => {
    const dispatch = useDispatch();

    const myprofile = useSelector((state) => state.profile.myprofile);
    const myRooms = useSelector((state) => state.room.myRooms);
    const socket = useSelector((state) => state.auth.socket);

    const [text, setText] = useState("");
    const [roomName, setRoomName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);

    const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
    const [isPriModalVisible, setIsPriModalVisible] = useState(false);

    // const [newMessage] = Helper();

    const [roomMembers, setRoomMembers] = useState([
        {
            user: myprofile.user,
            name: myprofile.name,
        },
    ]);

    const [windowWidth, setWindowWidth] = React.useState(window.outerWidth);
    const breakpoint = 450;

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.outerWidth);
        };
        window.addEventListener("resize", handleWindowResize);

        // Return a function from the effect that removes the event listener
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    useEffect(() => {
        console.log(`printing socketId from Frontend:${socket.id}`);
    }, [socket.id]);

    //  for initialising every room with some more data
    useEffect(() => {
        let theChangedRooms = myRooms.map((theRoom) => {
            return { ...theRoom, unReadMsgLength: 0 };
        });
        setRooms([...theChangedRooms]);
    }, []);

    // handling newcreatedGroup
    useEffect(() => {
        socket.on("addNewGrpChatRoom", ({ room }) => {
            setRooms((prevrooms) => [
                { ...room, unReadMsgLength: 0 },
                ...prevrooms,
            ]);
        });

        return () => {
            socket.off("addNewGrpChatRoom");
            console.log("inside unmount of off.addNewGrpChatRoom");
        };
    }, [rooms]);

    // handling newcreatedPriGroup
    useEffect(() => {
        socket.on("addNewPriChatRoom", ({ room, myprivaterooms }) => {
            setRooms((prevrooms) => [
                { ...room, unReadMsgLength: 0 },
                ...prevrooms,
            ]);

            dispatch({ type: UPDATE_PRICHATROOMS, payload: myprivaterooms });
        });

        return () => {
            socket.off("addNewPriChatRoom");
            console.log("inside unmount of off.addNewPriChatRoom");
        };
    }, [rooms]);

    useEffect(() => {
        socket.on("newMessage", ({ room, user, name, text }) => {
            let theNewArr = [...rooms];

            theNewArr.forEach((arritem, index) => {
                if (arritem._id == room) {
                    theNewArr.splice(index, 1);
                    theNewArr.splice(0, 0, {
                        ...arritem,
                        chats: [...arritem.chats, { user, name, text }],
                        unReadMsgLength: arritem.unReadMsgLength + 1,
                    });
                }
            });
            setRooms([...theNewArr]);
        });

        return () => {
            socket.off("newMessage");
            console.log("inside unmount of off.newMessage");
        };
    }, [rooms]);

    const changeRoomsStack = (rearrangedRooms) => {
        setRooms([...rearrangedRooms]);
    };

    const groupChatModalHandler = () => {
        dispatch({ type: CLEAR_PROFILES });
        setText("");
        setRoomMembers([
            {
                user: myprofile.user,
                name: myprofile.name,
            },
        ]);
        setRoomName("");
        setIsGroupModalVisible(false);
    };

    const privateChatModalHandler = (params) => {
        dispatch({ type: CLEAR_PROFILES });
        setText("");
        setRoomMembers([
            {
                user: myprofile.user,
                name: myprofile.name,
            },
        ]);
        setIsPriModalVisible(false);
    };

    const roomsStack = () => (
        <div className="leftsidebardiv">
            <Rooms
                type={"groupChat"}
                myprofile={myprofile}
                rooms={rooms}
                setRooms={setRooms}
                setSelectedRoom={setSelectedRoom}
                setIsGroupModalVisible={setIsGroupModalVisible}
                setIsPriModalVisible={setIsPriModalVisible}
            />
        </div>
    );

    return (
        <Fragment>
            <Modal
                title="CreateGroup"
                style={{}}
                visible={isGroupModalVisible}
                onOk={() => {
                    socket.emit("createGrpChatRoom", {
                        user: myprofile.user,
                        roomName,
                        roomMembers,
                    });
                    groupChatModalHandler();
                }}
                onCancel={() => {
                    groupChatModalHandler();
                }}
            >
                {" "}
                <CreateRoomModal
                    setText={setText}
                    text={text}
                    socket={socket}
                    roomName={roomName}
                    setRoomName={setRoomName}
                    myprofile={myprofile}
                    roomMembers={roomMembers}
                    setRoomMembers={setRoomMembers}
                />{" "}
            </Modal>
            <Modal
                title="Start Private Chat"
                visible={isPriModalVisible}
                onOk={privateChatModalHandler}
                onCancel={privateChatModalHandler}
            >
                {" "}
                <ChatPrivateModal
                    setText={setText}
                    text={text}
                    socket={socket}
                    myprofile={myprofile}
                    roomMembers={roomMembers}
                    setRoomMembers={setRoomMembers}
                    setSelectedRoom={setSelectedRoom}
                    setIsPriModalVisible={setIsPriModalVisible}
                />{" "}
            </Modal>
            {windowWidth <= breakpoint && !selectedRoom ? roomsStack() : null}
            {windowWidth <= breakpoint && selectedRoom ? (
                <div className="rightsidebardiv">
                    <ChatWindow
                        selectedRoom={selectedRoom}
                        changeRoomsStack={changeRoomsStack}
                        theRooms={rooms}
                        setSelectedRoom={setSelectedRoom}
                    />
                </div>
            ) : null}
            {windowWidth > breakpoint ? roomsStack() : null}
            {windowWidth > breakpoint && selectedRoom ? (
                <div className="rightsidebardiv">
                    <ChatWindow
                        selectedRoom={selectedRoom}
                        changeRoomsStack={changeRoomsStack}
                        theRooms={rooms}
                        setSelectedRoom={setSelectedRoom}
                    />
                </div>
            ) : null}
            {windowWidth > breakpoint && !selectedRoom ? (
                <div
                    className="rightsidebardiv"
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <div>
                        <i
                            onClick={(e) => {
                                setIsGroupModalVisible(true);
                            }}
                            className="far fa-paper-plane sendmessageicon"
                        />
                    </div>
                    <h1
                        style={{
                            marginLeft: "5px",
                            color: "black",
                            fontWeight: "300",
                            marginTop: "20px",
                            fontSize: "25px",
                        }}
                    >
                        Enjoy group chat and chat private
                    </h1>
                    <Button
                        type="primary"
                        htmlType="submit"
                        // className="login-form-button"
                        style={{
                            color: "white",
                            borderRadius: "8px",
                        }}
                        onClick={() => {
                            setIsGroupModalVisible(true);
                        }}
                    >
                        Create Group
                    </Button>
                </div>
            ) : null}
        </Fragment>
    );
};

export default RoomStack;
