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
                            <Fragment>
                                <Menu.Item
                                    // className="ant-menu-item"
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        height: "8vh",
                                        margin: "0px",
                                        padding: "0px",
                                        // paddingLeft: "2vw",
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
                                        <i
                                            className="fas fa-users roomicon"
                                            style={{
                                                marginRight: "1vw",
                                                padding:
                                                    "calc(0.7vh + 3px) calc(0.8vh)",
                                                fontSize:
                                                    "calc(1.5vh + calc(1.1vw))",
                                            }}
                                        />
                                    ) : (
                                        <i
                                            className="far fa-user myprofileicon"
                                            style={{
                                                marginRight: "1vw",
                                                padding:
                                                    "calc(0.7vh + 3px) calc(1.37vh)",
                                                fontSize:
                                                    "calc(1.5vh + calc(1.1vw))",
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
                                                fontWeight: "500",
                                                fontSize:
                                                    "calc(1.5vh + 0.35vw + 3.7px)",
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
                                                    fontSize:
                                                        "calc(1.5vh + 0.1vw + 3px)",
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
                                                    {room.chats[
                                                        room.chats.length - 1
                                                    ].text.slice(
                                                        0,
                                                        22 -
                                                            room.chats[
                                                                room.chats
                                                                    .length - 1
                                                            ].name.length
                                                    )}
                                                    {room.chats[
                                                        room.chats.length - 1
                                                    ].text.length +
                                                        room.chats[
                                                            room.chats.length -
                                                                1
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
                                {/* <hr
                                    style={{
                                        border: "1px solid gray",
                                        borderRadius: "5px",
                                        margin: "0 1vw 0 2vw",
                                    }}
                                /> */}
                            </Fragment>
                        );
                    })}
                </Fragment>
            </Menu>
        </Fragment>
    );
};

export default Rooms;
