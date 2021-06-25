import { Menu } from "antd";
import React, { Fragment } from "react";
import "./chat.css";

const Room = ({ room, index, socket, setSelectedRoom, setRooms, rooms }) => {
    return (
        <Fragment>
            <Menu.Item
                style={{
                    paddingLeft: "1px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    height: "8vh",
                }}
                key={index}
                onClick={() => {
                    socket.emit("getRoomById", {
                        roomId: room._id,
                    });
                    setSelectedRoom(room);
                    if (room.unReadMsgLength > 0) {
                        let newarr = [...rooms];
                        newarr.forEach((arritem) => {
                            if (arritem._id == room._id) {
                                arritem.unReadMsgLength = 0;
                            }
                        });
                        setRooms([...newarr]);
                    }
                }}
            >
                <i
                    className="fas fa-users usersIcon"
                    style={{
                        // color: "rgba(255, 255, 255, 0.65)",
                        color: "white",
                        borderColor: "white",
                        borderWidth: "1px",
                        padding: "9px 7px",
                        fontSize: "23px",
                        marginRight: "15px",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        marginBottom: "5px",
                    }}
                >
                    <strong
                        style={{
                            lineHeight: "initial",
                            fontWeight: "400",
                            fontSize: "20px",
                            marginBottom: "4px",
                            color: "white",
                        }}
                    >
                        {room.roomName}
                    </strong>
                    {room.chats.length != 0 ? (
                        <strong
                            style={{
                                lineHeight: "2vh",
                                fontWeight: "normal",
                                fontSize: "15px",
                            }}
                        >
                            {room.chats[room.chats.length - 1].name}
                            <strong
                                style={{
                                    paddingLeft: "2px",
                                    paddingRight: "3px",
                                    fontWeight: "normal",
                                }}
                            >
                                :
                            </strong>
                            <strong
                                style={{
                                    fontWeight: "normal",
                                }}
                            >
                                {room.chats[room.chats.length - 1].text}
                            </strong>
                        </strong>
                    ) : null}
                </div>
                {room.unReadMsgLength != 0 ? (
                    <strong className="unreadmsg">
                        {room.unReadMsgLength}
                    </strong>
                ) : null}
            </Menu.Item>
        </Fragment>
    );
};

export default Room;
