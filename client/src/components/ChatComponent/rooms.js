/* eslint-disable eqeqeq */
/* eslint-disable no-lone-blocks */
import React, { Fragment } from "react";
import "./chat.css";
import { useSelector } from "react-redux";
import { Menu, Dropdown, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const Rooms = ({
    myprofile,
    rooms,
    setRooms,
    setSelectedRoom,
    setIsPriModalVisible,
    setIsGroupModalVisible,
}) => {
    const socket = useSelector((state) => state.auth.socket);
    const menu = (
        <Menu>
            <Menu.Item
                key="1"
                onClick={() => {
                    setIsPriModalVisible(false);
                    setIsGroupModalVisible(true);
                }}
            >
                <strong>Create Room</strong>
            </Menu.Item>
            <Menu.Item
                key="1"
                onClick={() => {
                    setIsGroupModalVisible(false);
                    setIsPriModalVisible(true);
                }}
            >
                <strong>Chat Private</strong>
            </Menu.Item>
        </Menu>
    );

    return (
        <Fragment>
            <div className="myinfodiv">
                <div>
                    <i
                        className="far fa-user myprofileicon"
                        style={{
                            borderColor: "white",
                            color: "white",
                        }}
                    />
                    <strong className="mynamedesign">{myprofile.name}</strong>
                </div>
                <Dropdown overlay={menu} trigger={["click"]}>
                    <MoreOutlined
                        style={{ fontSize: "30px", color: "white" }}
                    />
                </Dropdown>
            </div>
            {rooms.length ? (
                <Menu
                    className="menu"
                    style={{
                        overflow: "auto",
                        height: "68vh",
                        borderBottomLeftRadius: "12px",
                        fontSize: "17px",
                        backgroundColor: "#C3E0E5",
                    }}
                    defaultSelectedKeys={["0"]}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                    theme="dark"
                >
                    <Fragment>
                        {rooms.map((room, index) => {
                            return (
                                <Fragment>
                                    <Menu.Item
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            height: "8vh",
                                            margin: "0px",
                                            padding: "0px",
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
                                                    if (
                                                        arritem._id == room._id
                                                    ) {
                                                        arritem.unReadMsgLength = 0;
                                                    }
                                                });
                                                setRooms([...newarr]);
                                            }
                                        }}
                                    >
                                        {room.roomtype === "group" ? (
                                            <i className="fas fa-users roomStack-roomicon" />
                                        ) : (
                                            <i className="far fa-user roomStack-myprofileicon" />
                                        )}
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                marginBottom: "5px",
                                            }}
                                        >
                                            <strong className="roomStack-roomname">
                                                {room.roomName}
                                            </strong>
                                            {room.chats.length != 0 ? (
                                                <strong className="roomStack-username">
                                                    {
                                                        room.chats[
                                                            room.chats.length -
                                                                1
                                                        ].name
                                                    }
                                                    <strong className="roomStack-colondesign">
                                                        :
                                                    </strong>
                                                    <strong
                                                        style={{
                                                            fontWeight:
                                                                "normal",
                                                            color: "black",
                                                        }}
                                                    >
                                                        {room.chats[
                                                            room.chats.length -
                                                                1
                                                        ].text.slice(
                                                            0,
                                                            19 -
                                                                room.chats[
                                                                    room.chats
                                                                        .length -
                                                                        1
                                                                ].name.length
                                                        )}
                                                        {room.chats[
                                                            room.chats.length -
                                                                1
                                                        ].text.length +
                                                            room.chats[
                                                                room.chats
                                                                    .length - 1
                                                            ].name.length >
                                                        23
                                                            ? "..."
                                                            : ""}
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
                        })}
                    </Fragment>
                </Menu>
            ) : (
                <div className="roomStack-createchat">
                    <div>
                        <i
                            onClick={(e) => {
                                setIsGroupModalVisible(true);
                            }}
                            className="far fa-paper-plane sendmessageicon"
                        />
                    </div>
                    <h1 className="textmessage">
                        Enjoy group chat and chat private
                    </h1>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            color: "white",
                            borderRadius: "8px",
                        }}
                        onClick={() => {
                            setIsPriModalVisible(true);
                        }}
                    >
                        Chat private
                    </Button>
                </div>
            )}
        </Fragment>
    );
};

export default Rooms;
