import { Menu } from "antd";
import React, { Fragment } from "react";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import "./chat.css";

const LeftSideBar = ({
  type,
  myprofile,
  rooms,
  socket,
  setRooms,
  setSelectedRoom,
}) => {
  return (
    <Fragment>
      <div className="myinfodiv">
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
          style={{ color: "white", fontSize: "25px", marginBottom: "5px" }}
        >
          {myprofile.name}
        </strong>
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
        {type == "groupChat" ? (
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
                    socket.emit("getRoomById", { roomId: room._id });
                    setSelectedRoom(room);
                    if (room.unReadMsgLength > 0) {
                      let newarr = [...rooms];
                      newarr.forEach((arritem) => {
                        if (arritem.roomName == room.roomName) {
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
              );
            })}
          </Fragment>
        ) : (
          <Fragment>
            {rooms.map((roomInfo, index) => (
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
                  console.log(roomInfo.chatRoom);
                  socket.emit("getRoomById", {
                    roomId: roomInfo.chatRoom._id,
                  });
                  setSelectedRoom({
                    chatroominfo: roomInfo.chatRoom,
                    roomname: roomInfo.roomname,
                  });
                  if (roomInfo.unReadMsgLength > 0) {
                    let newarr = [...rooms];
                    newarr.forEach((arritem) => {
                      if (arritem.roomname == roomInfo.roomname) {
                        arritem.unReadMsgLength = 0;
                      }
                    });
                    setRooms([...newarr]);
                  }
                }}
              >
                <i
                  className="far fa-user usersIcon"
                  style={{
                    // color: "rgba(255, 255, 255, 0.65)",
                    color: "white",
                    borderColor: "white",
                    borderWidth: "1px",
                    padding: "7px 8px",
                    fontSize: "25px",
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
                    {roomInfo.roomname}
                  </strong>
                  {roomInfo.chatRoom.chats.length != 0 ? (
                    <strong
                      style={{
                        lineHeight: "2vh",
                        fontWeight: "normal",
                        fontSize: "15px",
                      }}
                    >
                      {
                        roomInfo.chatRoom.chats[
                          roomInfo.chatRoom.chats.length - 1
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
                          roomInfo.chatRoom.chats[
                            roomInfo.chatRoom.chats.length - 1
                          ].text
                        }
                      </strong>
                    </strong>
                  ) : null}
                </div>
                {roomInfo.unReadMsgLength != 0 ? (
                  <strong className="unreadmsg">
                    {roomInfo.unReadMsgLength}
                  </strong>
                ) : null}
              </Menu.Item>
            ))}
          </Fragment>
        )}
      </Menu>
    </Fragment>
  );
};

export default LeftSideBar;
// {room.chats[chats.length - 1].name}
