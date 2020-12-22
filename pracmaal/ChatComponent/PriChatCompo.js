import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfiles } from "../../reduxstuff/actions/profile";
import { createPriChatRoom } from "../../reduxstuff/actions/room";
import { CLEAR_PROFILES } from "../../reduxstuff/actions/types";
// import { getProfiles } from "../reduxstuff/actions/profile";
// import { CLEAR_PROFILES } from "../reduxstuff/actions/types";
// import { createRoom, getMyRooms } from "../reduxstuff/actions/room";
import RightSideBarPriChat from "./RightSideBarPriChat";

const PriChatCompo = ({ location, socket }) => {
  const dispatch = useDispatch();
  // const [roomChats, setRoomChats] = useState("");

  const [text, setText] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const profiles = useSelector((state) => state.profile.profiles);
  const myprofile = useSelector((state) => state.profile.myprofile);
  const myPriChatRooms = useSelector((state) => state.room.myPriChatRooms);

  const [groupMembers, setGroupMembers] = useState([
    {
      user: myprofile.user,
      name: myprofile.name,
    },
  ]);

  return (
    <Fragment>
      <div
        style={{
          flexDirection: "row",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "limegreen",
        }}
      >
        <div
          style={{
            borderColor: "limegreen",
            borderWidth: "1px",
            margin: "2px",
          }}
        >
          <input
            type="search"
            name="search"
            value={text}
            style={{ borderRadius: "5px" }}
            placeholder="Search for users and chat with them"
            onChange={(e) => {
              setText(e.target.value);
              dispatch(getProfiles(e.target.value));
            }}
          />
          <button
            style={{ display: "inline" }}
            onClick={() => {
              setText("");
              dispatch({ type: CLEAR_PROFILES });
            }}
          >
            &#10006;
          </button>
          {profiles &&
            profiles.map((person) => (
              <div>
                <i
                  className="fas fa-user-circle"
                  style={{ fontSize: "25px", marginRight: "7px" }}
                />
                <strong
                  style={{
                    // fontWeight: "normal",
                    fontSize: "25px",
                    color: "limegreen",
                  }}
                >
                  {person.name}
                </strong>
                <button
                  style={{
                    fontSize: "25px",
                    paddingRight: "3px",
                    float: "right",
                  }}
                  onClick={() => {
                    let theSelectedRoom = myprofile.myPrivateChatRooms.filter(
                      (myRoom) => myRoom.user == person.user
                    );
                    console.log(theSelectedRoom);
                    if (myprofile.name === person.name) {
                      alert("You can't message your own account");
                    } else if (theSelectedRoom.length === 0) {
                      dispatch(
                        createPriChatRoom(person.name, [
                          ...groupMembers,
                          { user: person.user, name: person.name },
                        ])
                      );
                      setGroupMembers([
                        ...groupMembers,
                        { user: person.user, name: person.name },
                      ]);
                      setText("");
                      dispatch({ type: CLEAR_PROFILES });
                    } else {
                      socket.current.emit("getRoomById", {
                        roomId: theSelectedRoom[0].roomId,
                      });
                      setSelectedRoom({
                        chatroominfo: theSelectedRoom[0],
                        roomname: person.name,
                      });
                      setText("");
                      dispatch({ type: CLEAR_PROFILES });
                    }
                  }}
                >
                  Message
                </button>
              </div>
            ))}
          {profiles.length == 0 ? (
            <div>
              {myPriChatRooms.map((roomInfo) => (
                <div
                  onClick={() => {
                    console.log(roomInfo.chatRoom._id);
                    socket.current.emit("getRoomById", {
                      roomId: roomInfo.chatRoom._id,
                    });
                    setSelectedRoom({
                      chatroominfo: roomInfo.chatRoom,
                      roomname: roomInfo.roomname,
                    });
                  }}
                  style={{
                    borderBottomColor: "limegreen",
                    color: "yellow",
                    borderBottomWidth: "1px",
                    borderBottomStyle: "solid",
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  {roomInfo.roomname}
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
          {/* {!profiles && (
            <div>
              {myPriChatRooms.map((roomInfo) => (
                <div
                  onClick={() => {
                    console.log(roomInfo.chatRoom._id);
                    socket.current.emit("getRoomById", {
                      roomId: roomInfo.chatRoom._id,
                    });
                    setSelectedRoom({
                      chatroominfo: roomInfo.chatRoom,
                      roomname: roomInfo.roomname,
                    });
                  }}
                  style={{
                    borderBottomColor: "limegreen",
                    color: "yellow",
                    borderBottomWidth: "1px",
                    borderBottomStyle: "solid",
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  {roomInfo.roomname}
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flex: 3,
          borderWidth: "1px",
          borderColor: "limegreen",
          borderStyle: "solid",
          flexDirection: "column",
          padding: "2px",
        }}
      >
        {selectedRoom && (
          <RightSideBarPriChat
            selectedRoom={selectedRoom}
            location={location}
            socket={socket}
            myprofile={myprofile}
          />
        )}
        {!selectedRoom && (
          <h1 style={{ marginLeft: "5px", color: "limegreen" }}>
            Hey why don't you start chatting
          </h1>
        )}
      </div>
    </Fragment>
  );
};

export default PriChatCompo;