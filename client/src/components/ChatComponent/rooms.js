/* eslint-disable eqeqeq */
/* eslint-disable no-lone-blocks */
import React, { Fragment } from "react";
import "./chat.css";
import { useSelector } from "react-redux";
import { Menu, Dropdown } from "antd";
import { BarsOutlined, MoreOutlined } from "@ant-design/icons";

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
                        className="far fa-user usersIcon"
                        style={{
                            color: "aquamarine",
                            fontSize: "25px",
                            borderColor: "aquamarine",
                            padding: "5px 7px",
                            marginRight: "15px",
                        }}
                    />
                    <strong
                        style={{
                            color: "white",
                            fontSize: "25px",
                            marginBottom: "5px",
                        }}
                    >
                        {myprofile.name}
                    </strong>
                </div>
                <Dropdown overlay={menu} trigger={["click"]}>
                    <MoreOutlined style={{ fontSize: "30px" }} />
                </Dropdown>
            </div>
            <Menu
                style={{
                    overflowY: "scroll",
                    height: "68vh",
                    borderRadius: "12px",
                    fontSize: "17px",
                }}
                defaultSelectedKeys={["0"]}
                defaultOpenKeys={["sub1"]}
                mode="inline"
                theme="dark"
            >
                <Fragment>
                    {rooms.map((room, index) => {
                        return (
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
                                            {
                                                room.chats[
                                                    room.chats.length - 1
                                                ].name
                                            }
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
                                                {
                                                    room.chats[
                                                        room.chats.length - 1
                                                    ].text
                                                }
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
                        );
                    })}
                </Fragment>
            </Menu>
        </Fragment>
    );
};

export default Rooms;
