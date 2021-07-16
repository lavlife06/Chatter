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
                        className="far fa-user myprofileicon"
                        style={{
                            borderColor: "white",
                            color: "white",
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
                    <MoreOutlined
                        style={{ fontSize: "30px", color: "white" }}
                    />
                </Dropdown>
            </div>
            <Menu
                className="menu"
                style={{
                    overflow: "auto",
                    height: "68vh",
                    // borderRadius: "12px",
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
                            <Menu.Item
                                // className="menuitem"
                                style={{
                                    paddingLeft: "2.2vw",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    height: "8vh",
                                    // borderBottom: "1px solid black",
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
                                {room.roomtype === "group" ? (
                                    <i className="fas fa-users roomicon" />
                                ) : (
                                    <i
                                        className="far fa-user myprofileicon"
                                        style={{
                                            padding: "7px 10px",
                                        }}
                                    />
                                )}
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
                                            color: "black",
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
                                                color: "black",
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
                                                    color: "black",
                                                }}
                                            >
                                                :
                                            </strong>
                                            <strong
                                                style={{
                                                    fontWeight: "normal",
                                                    color: "black",
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
