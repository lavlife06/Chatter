import React, { useState, useEffect, useRef } from "react";
import RightSideBar from "./RightSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getProfiles } from "../reduxstuff/actions/profile";
import { CLEAR_PROFILES } from "../reduxstuff/actions/types";
import { createRoom, getMyRooms } from "../reduxstuff/actions/room";
import io from "socket.io-client";
let socket;

const Main = ({ location }) => {
  const dispatch = useDispatch();
  // const [roomChats, setRoomChats] = useState("");

  socket = useRef(
    io("localhost:5000", {
      // query: {
      //   token: localStorage.getItem("token"),
      // },
    })
  );
  useEffect(() => {
    dispatch(getMyRooms());
  }, [getMyRooms]);

  const [text, setText] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const profiles = useSelector((state) => state.profile.profiles);
  const myprofile = useSelector((state) => state.profile.myprofile);
  const myRooms = useSelector((state) => state.room.myRooms);

  useEffect(() => {
    socket.current.emit("joined", { name: myprofile.name }, ({ wlcmsg }) => {
      alert(wlcmsg);
    });
    console.log("inside useEffect for joined");
    return () => {
      socket.current.emit("disconnect");

      socket.current.off();
    };
  }, []);

  const [groupMembers, setGroupMembers] = useState([
    {
      user: myprofile.user,
      name: myprofile.name,
    },
  ]);

  return (
    <div
      style={{
        display: "flex",
        marginLeft: "10%",
        marginRight: "10%",
        height: "80vh",
      }}
    >
      <div
        style={{
          flexDirection: "row",
          borderWidth: "1px",
          borderColor: "black",
          borderStyle: "solid",
        }}
      >
        <div>
          <div>
            <input
              type="search"
              name="search"
              value={text}
              placeholder="Search your Rooms"
              onChange={(e) => {
                setText(e.target.value);
                console.log("isko baadme dekh lenge");
              }}
            />
            <i
              className="fas fa-bars"
              id="modalBtn"
              onClick={() => {
                let modal = document.getElementById("myModal");
                modal.style.display = "block";
              }}
            />
            <div id="myModal" className="modal">
              <div className="modal-content">
                <i
                  className="fas fa-times CloseBtn"
                  onClick={() => {
                    let modal = document.getElementById("myModal");
                    modal.style.display = "none";
                    dispatch({ type: CLEAR_PROFILES });
                  }}
                />
                <input
                  type="search"
                  name="search"
                  value={text}
                  placeholder="Search the user/group"
                  onChange={(e) => {
                    setText(e.target.value);
                    dispatch(getProfiles(e.target.value));
                  }}
                />
                <div>
                  {profiles &&
                    profiles.map((person) => (
                      <div>
                        {person.name}
                        <i
                          class="fas fa-plus-circle CloseBtn"
                          onClick={() => {
                            if (myprofile.name === person.name) {
                              alert(
                                "You can't add yourself twice in same group"
                              );
                            } else {
                              setGroupMembers([
                                ...groupMembers,
                                { user: person.user, name: person.name },
                              ]);
                            }
                          }}
                        >
                          Add
                        </i>
                      </div>
                    ))}
                </div>
                <div>
                  GroupName:
                  <input
                    type="text"
                    name="text"
                    value={groupName}
                    placeholder="Enter your group name here"
                    onChange={(e) => {
                      setGroupName(e.target.value);
                    }}
                  />
                </div>
                {groupMembers && (
                  <div>
                    {groupMembers.map((member) => (
                      <div>{member.name}</div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => {
                    dispatch(createRoom(groupName, groupMembers));
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div>
            {myRooms.map((room) => (
              <div
                onClick={() => {
                  // if (selectedRoom.roomName !== "") {
                  //   socket.current.emit("leaveRoom", {
                  //     user: myprofile.user,
                  //     name: myprofile.name,
                  //     room: selectedRoom.roomName,
                  //   });
                  // }
                  socket.current.emit("getRoomById", { roomId: room._id });
                  setSelectedRoom(room);
                }}
              >
                {room.roomName}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flex: 3,
          borderWidth: "1px",
          borderColor: "black",
          borderStyle: "solid",
          flexDirection: "column",
        }}
      >
        {selectedRoom && (
          <RightSideBar
            selectedRoom={selectedRoom}
            location={location}
            socket={socket}
          />
        )}
        {!selectedRoom && <h1>Hey Join any room and start chatting</h1>}
      </div>
    </div>
  );
};

export default Main;
