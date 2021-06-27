/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    CLEAR_PROFILES,
    UPDATE_PRICHATROOMS,
} from "../../reduxstuff/actions/types";
import "./chat.css";
import { Modal } from "antd";
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
                }}
                onCancel={() => {
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
                onOk={() => {
                    dispatch({ type: CLEAR_PROFILES });
                    setText("");
                    setRoomMembers([
                        {
                            user: myprofile.user,
                            name: myprofile.name,
                        },
                    ]);
                    setIsPriModalVisible(false);
                }}
                onCancel={() => {
                    dispatch({ type: CLEAR_PROFILES });
                    setText("");
                    setRoomMembers([
                        {
                            user: myprofile.user,
                            name: myprofile.name,
                        },
                    ]);
                    setIsPriModalVisible(false);
                }}
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
            <div className="rightsidebardiv">
                {selectedRoom && (
                    <ChatWindow
                        selectedRoom={selectedRoom}
                        changeRoomsStack={changeRoomsStack}
                        theRooms={rooms}
                    />
                )}
                {!selectedRoom && (
                    <h1 style={{ marginLeft: "5px", color: "black" }}>
                        Hey Join any room and start chatting
                    </h1>
                )}
            </div>
        </Fragment>
    );
};

export default RoomStack;
