/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { getProfiles, updateProfile } from "../../reduxstuff/actions/profile";
import {
    CLEAR_PROFILES,
    CREATE_ROOM,
    UPDATE_PRICHATROOMS,
} from "../../reduxstuff/actions/types";
// import { getMyRooms } from "../../reduxstuff/actions/room";
import "./chat.css";
import { Modal } from "antd";
import CreateRoomModal from "./chatModals/CreateRoomModal";
import ChatPrivateModal from "./chatModals/ChatPrivateModal";
import Rooms from "./rooms";
import ChatWindow from "./chatWindow";

const RoomStack = ({
    location,
    isGroupModalVisible,
    setIsGroupModalVisible,
    isPriModalVisible,
    setIsPriModalVisible,
}) => {
    const dispatch = useDispatch();

    const myprofile = useSelector((state) => state.profile.myprofile);
    const myRooms = useSelector((state) => state.room.myRooms);
    const socket = useSelector((state) => state.auth.socket);

    const [text, setText] = useState("");
    const [roomName, setRoomName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);

    const [roomMembers, setRoomMembers] = useState([
        {
            user: myprofile.user,
            name: myprofile.name,
        },
    ]);

    useEffect(() => {
        console.log(`printing socketId from Frontend:${socket.id}`);
        // dispatch(updateProfile(socket.id));
    }, [socket.id]);

    //  for initialising every room with some more data
    useEffect(() => {
        let theChangedRooms = myRooms.map((theRoom) => {
            return { ...theRoom, unReadMsgLength: 0 };
        });
        setRooms([...theChangedRooms]);
        console.log("inside setRooms", myRooms);
    }, []);

    // handling newcreatedGroup
    useEffect(() => {
        socket.on("addNewGrpChatRoom", ({ room }) => {
            console.log("inside on event addNewGrpChatRoom", room);
            setRooms((prevrooms) => [
                { ...room, unReadMsgLength: 0 },
                ...prevrooms,
            ]);
            dispatch({ type: CREATE_ROOM, payload: room });
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

            dispatch({ type: CREATE_ROOM, payload: { room } });
            dispatch({ type: UPDATE_PRICHATROOMS, payload: myprivaterooms });
            console.log("inside on event addNewPriChatRoom", room);
        });

        return () => {
            socket.off("addNewPriChatRoom");
            console.log("inside unmount of off.addNewPriChatRoom");
        };
    }, [rooms]);

    useEffect(() => {
        socket.on("newMessage", ({ room, user, name, text }) => {
            console.log(selectedRoom);

            let theNewArr = [...rooms];

            console.log(theNewArr);

            theNewArr.forEach((arritem, index) => {
                console.log(arritem._id, room, "outside if statement");

                if (arritem._id == room) {
                    console.log(arritem._id, room, "inside if statement");
                    let slicedpart1 = theNewArr.splice(index, 1);
                    let slicedpart2 = theNewArr.splice(0, 0, {
                        ...arritem,
                        chats: [...arritem.chats, { user, name, text }],
                        unReadMsgLength: arritem.unReadMsgLength + 1,
                    });
                    console.log(slicedpart1, "1", slicedpart2, "2");
                    console.log(theNewArr, "in if statement");
                }
            });

            console.log(theNewArr);

            setRooms([...theNewArr]);
        });
        console.log("inside on event newMessage");

        return () => {
            socket.off("newMessage");
            console.log("inside unmount of off.newMessage");
        };
    }, [rooms]);

    const changeRoomsStack = (rearrangedRooms) => {
        setRooms([...rearrangedRooms]);
    };
    console.log(rooms);
    console.log(selectedRoom);
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
                />
            </div>
            <div className="rightsidebardiv">
                {selectedRoom && (
                    <ChatWindow
                        selectedRoom={selectedRoom}
                        location={location}
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
