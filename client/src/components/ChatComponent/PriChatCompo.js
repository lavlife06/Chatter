import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfiles, updateProfile } from "../../reduxstuff/actions/profile";
import {
    CLEAR_PROFILES,
    CREATE_PRICHATROOM,
} from "../../reduxstuff/actions/types";
import RightSideBarPriChat from "./RightSideBarPriChat";
import "./chat.css";
import LeftSideBar from "./LeftSideBar";
import { Input, Modal } from "antd";
import ChatPrivateModal from "./ChatPrivateModal";

const PriChatCompo = ({
    location,
    socket,
    isModalVisible,
    setIsModalVisible,
}) => {
    const dispatch = useDispatch();
    // const [roomChats, setRoomChats] = useState("");

    const [text, setText] = useState("");
    const [selectedRoom, setSelectedRoom] = useState(null);

    const profiles = useSelector((state) => state.profile.profiles);
    const myprofile = useSelector((state) => state.profile.myprofile);
    const myPriChatRooms = useSelector((state) => state.room.myPriChatRooms);
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

    useEffect(() => {
        console.log(myPriChatRooms);
        let theChangedRooms = myPriChatRooms.map((theRoom) => {
            return { ...theRoom, unReadMsgLength: 0 };
        });
        setRooms([...theChangedRooms]);
        console.log("inside setRooms");
    }, []);

    useEffect(() => {
        socket.on("addNewPriChatRoom", ({ room }) => {
            setRooms((prevrooms) => [
                { ...room, unReadMsgLength: 0 },
                ...prevrooms,
            ]);

            dispatch({ type: CREATE_PRICHATROOM, payload: { room } });
            console.log("inside on event addNewPriChatRoom", room);
        });

        return () => {
            socket.off("addNewPriChatRoom");
            console.log("inside unmount of off.addNewPriChatRoom");
        };
    }, [rooms]);

    useEffect(() => {
        socket.on("newMessage", ({ room, user, name, text }) => {
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
    }, [rooms, socket]);

    const changePriRoomsStack = (rearrangedRooms) => {
        setRooms([...rearrangedRooms]);
    };
    return (
        <Fragment>
            <Modal
                title="Start Private Chat"
                visible={isModalVisible}
                onOk={() => {
                    dispatch({ type: CLEAR_PROFILES });
                    setText("");
                    setRoomMembers([
                        {
                            user: myprofile.user,
                            name: myprofile.name,
                        },
                    ]);
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
                    setIsModalVisible(false);
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
                    setIsModalVisible={setIsModalVisible}
                />{" "}
            </Modal>
            <div className="leftsidebardiv">
                <LeftSideBar
                    type={"privateChat"}
                    myprofile={myprofile}
                    rooms={rooms}
                    socket={socket}
                    setRooms={setRooms}
                    setSelectedRoom={setSelectedRoom}
                />
            </div>
            <div className="rightsidebardiv">
                {selectedRoom && (
                    <RightSideBarPriChat
                        selectedRoom={selectedRoom}
                        location={location}
                        socket={socket}
                        myprofile={myprofile}
                        changePriRoomsStack={changePriRoomsStack}
                        theRooms={rooms}
                    />
                )}
                {!selectedRoom && (
                    <h1 style={{ marginLeft: "5px", color: "black" }}>
                        Hey why don't you start chatting
                    </h1>
                )}
            </div>
        </Fragment>
    );
};

export default PriChatCompo;
