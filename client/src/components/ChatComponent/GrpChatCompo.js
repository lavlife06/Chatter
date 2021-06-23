import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightSideBarGrpChat from "./RightSideBarGrpChat";
// import { getProfiles, updateProfile } from "../../reduxstuff/actions/profile";
import { CLEAR_PROFILES, CREATE_ROOM } from "../../reduxstuff/actions/types";
// import { getMyRooms } from "../../reduxstuff/actions/room";
import "./chat.css";
import { Modal } from "antd";
import LeftSideBar from "./LeftSideBar";
import CreateRoomModal from "./CreateRoomModal";

const GrpChatCompo = ({
    location,
    socket,
    isModalVisible,
    setIsModalVisible,
}) => {
    const dispatch = useDispatch();

    const myprofile = useSelector((state) => state.profile.myprofile);
    const myRooms = useSelector((state) => state.room.myRooms);

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
        console.log(myRooms);
        let theChangedRooms = myRooms.map((theRoom) => {
            return { ...theRoom, unReadMsgLength: 0 };
        });
        setRooms([...theChangedRooms]);
        console.log("inside setRooms");
    }, []);

    // handling newcreatedGroup
    useEffect(() => {
        socket.on("addNewGrpChatRoom", ({ room }) => {
            console.log(room);
            setRooms((prevrooms) => [
                { ...room, unReadMsgLength: 0 },
                ...prevrooms,
            ]);
            dispatch({ type: CREATE_ROOM, payload: room });
        });

        console.log("inside on event addNewGrpChatRoom");

        return () => {
            socket.off("addNewGrpChatRoom");
            console.log("inside unmount of off.addNewGrpChatRoom");
        };
    }, [rooms]);

    useEffect(() => {
        socket.on("newMessage", ({ room, user, name, text }) => {
            console.log(selectedRoom);

            let theNewArr = [...rooms];

            console.log(theNewArr);

            theNewArr.forEach((arritem, index) => {
                if (arritem.roomName == room) { //room = roomname
                    theNewArr.splice(index, 1);
                    theNewArr.splice(0, 0, {
                        ...arritem,
                        chats: [...arritem.chats, { user, name, text }],
                        unReadMsgLength: arritem.unReadMsgLength + 1,
                    });
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
                visible={isModalVisible}
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
                    setIsModalVisible(false);
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
                    setIsModalVisible(false);
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
            <div className="leftsidebardiv">
                <LeftSideBar
                    type={"groupChat"}
                    myprofile={myprofile}
                    rooms={rooms}
                    socket={socket}
                    setRooms={setRooms}
                    setSelectedRoom={setSelectedRoom}
                />
            </div>
            <div className="rightsidebardiv">
                {selectedRoom && (
                    <RightSideBarGrpChat
                        selectedRoom={selectedRoom}
                        location={location}
                        socket={socket}
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

export default GrpChatCompo;
