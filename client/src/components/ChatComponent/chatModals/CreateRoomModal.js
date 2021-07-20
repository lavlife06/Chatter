import React, { Fragment } from "react";
import { getProfiles } from "../../../reduxstuff/actions/profile";
import { useDispatch, useSelector } from "react-redux";
// import "./chat.css";
import { Input } from "antd";
import { CLEAR_PROFILES } from "../../../reduxstuff/actions/types";

const CreateRoomModal = ({
    text,
    setText,
    roomName,
    setRoomName,
    myprofile,
    roomMembers,
    setRoomMembers,
}) => {
    const dispatch = useDispatch();

    const profiles = useSelector((state) => state.profile.profiles);

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
                <strong>GroupName:</strong>
                <Input
                    type="text"
                    name="text"
                    style={{
                        borderStyle: "none",
                        marginLeft: "10px",
                        fontWeight: "500",
                    }}
                    value={roomName}
                    placeholder="Enter your group name here"
                    onChange={(e) => {
                        setRoomName(e.target.value);
                    }}
                />
            </div>
            <hr style={{ height: "2px", backgroundColor: "black" }} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    fontSize: "20px",
                }}
            >
                <strong>Users:</strong>
                <Input
                    type="search"
                    name="search"
                    value={text}
                    style={{
                        borderStyle: "none",
                        marginLeft: "10px",
                        fontWeight: "500",
                    }}
                    placeholder="Search Users here"
                    onChange={(e) => {
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
            <hr />
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
                            <i
                                className="fas fa-plus-circle"
                                style={{
                                    fontSize: "25px",
                                    paddingRight: "10px",
                                }}
                                onClick={() => {
                                    if (myprofile.name === person.name) {
                                        alert(
                                            "You can't add yourself twice in same group"
                                        );
                                    } else {
                                        setRoomMembers([
                                            ...roomMembers,
                                            {
                                                user: person.user,
                                                name: person.name,
                                                socketId: person.socketId,
                                            },
                                        ]);
                                    }
                                }}
                            />
                        </div>
                    ))}
            </div>

            {roomMembers && (
                <Fragment>
                    <div style={{ overflowY: "scroll", maxHeight: "150px" }}>
                        <div
                            style={{
                                fontSize: "17px",
                                color: "gray",
                                marginBottom: "3px",
                            }}
                        >
                            GroupMembers:
                        </div>

                        {roomMembers.map((member) => (
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
                                    {member.name}
                                </strong>
                            </div>
                        ))}
                    </div>
                </Fragment>
            )}
            {/* </div> */}
        </>
    );
};

export default CreateRoomModal;
