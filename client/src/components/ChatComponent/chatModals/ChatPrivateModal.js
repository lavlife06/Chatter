/* eslint-disable eqeqeq */
import React, { Fragment } from "react";
import { Input, Button } from "antd";
import { CLEAR_PROFILES } from "../../../reduxstuff/actions/types";
import { getProfiles } from "../../../reduxstuff/actions/profile";
import { useDispatch, useSelector } from "react-redux";
// import "./chat.css";
import { PlusOutlined } from "@ant-design/icons";

const ChatPrivateModal = ({
    text,
    setText,
    myprofile,
    roomMembers,
    setRoomMembers,
    setSelectedRoom,
    setIsPriModalVisible,
}) => {
    const dispatch = useDispatch();

    const profiles = useSelector((state) => state.profile.profiles);
    const socket = useSelector((state) => state.auth.socket);

    return (
        <>
            {/* <div className="modal-content"> */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    fontSize: "20px",
                }}
            >
                <strong>Friends:</strong>
                <Input
                    type="search"
                    name="search"
                    style={{
                        borderRadius: "12px",
                        marginLeft: "10px",
                        fontWeight: "500",
                    }}
                    value={text}
                    placeholder="Search for users and chat with them"
                    onChange={(e) => {
                        // console.log(e.target.value);
                        if (!e.target.value) {
                            setText("");
                            dispatch({ type: CLEAR_PROFILES });
                        } else {
                            setText(e.target.value);
                            dispatch(getProfiles(e.target.value));
                        }
                    }}
                />
            </div>
            <hr style={{ height: "2px", backgroundColor: "black" }} />
            <div style={{ overflowY: "scroll", maxHeight: "150px" }}>
                <div
                    style={{
                        fontSize: "17px",
                        color: "gray",
                        marginBottom: "3px",
                    }}
                >
                    Suggested
                </div>
                {profiles &&
                    profiles.map((person) => (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                // fontSize: "20px",
                            }}
                        >
                            <div>
                                <i
                                    className="fas fa-user-circle"
                                    style={{
                                        fontSize: "25px",
                                        marginRight: "7px",
                                    }}
                                />
                                <strong
                                    style={{
                                        // fontWeight: "normal",
                                        fontSize: "25px",
                                    }}
                                >
                                    {person.name}
                                </strong>
                            </div>

                            <Button
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    fontWeight: "500",
                                    borderRadius: "15px",
                                    fontSize: "2.5vh",
                                    marginRight: "10px",
                                    backgroundColor: "black",
                                    color: "white",
                                }}
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    let theSelectedRoom =
                                        myprofile.myPrivateChatRooms.filter(
                                            (myRoom) =>
                                                myRoom.user == person.user
                                        );
                                    console.log(theSelectedRoom);
                                    if (myprofile.name === person.name) {
                                        alert(
                                            "You can't message your own account"
                                        );
                                    } else if (theSelectedRoom.length === 0) {
                                        socket.emit("createPriChatRoom", {
                                            user: myprofile.user,
                                            roomMembers: [
                                                ...roomMembers,
                                                {
                                                    user: person.user,
                                                    name: person.name,
                                                },
                                            ],
                                        });
                                        setText("");
                                        setRoomMembers([
                                            {
                                                user: myprofile.user,
                                                name: myprofile.name,
                                            },
                                        ]);
                                        dispatch({ type: CLEAR_PROFILES });
                                        setIsPriModalVisible(false);
                                    } else {
                                        socket.emit("getRoomById", {
                                            roomId: theSelectedRoom[0].roomId,
                                        });
                                        setSelectedRoom(theSelectedRoom[0]);
                                        setText("");
                                        dispatch({ type: CLEAR_PROFILES });
                                        setIsPriModalVisible(false);
                                    }
                                }}
                            >
                                Chat
                            </Button>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default ChatPrivateModal;
