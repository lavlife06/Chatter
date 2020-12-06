import React, { useState, useEffect, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightSideBarGrpChat from "./RightSideBarGrpChat";
import { getProfiles } from "../../reduxstuff/actions/profile";
import { CLEAR_PROFILES } from "../../reduxstuff/actions/types";
import { createRoom } from "../../reduxstuff/actions/room";

const GrpChatCompo = ({ location, socket }) => {
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  const profiles = useSelector((state) => state.profile.profiles);
  const myprofile = useSelector((state) => state.profile.myprofile);
  const myRooms = useSelector((state) => state.room.myRooms);

  // useEffect(() => {
  //   socket.current.emit("joined", { name: myprofile.name }, ({ wlcmsg }) => {
  //     alert(wlcmsg);
  //   });
  //   console.log("inside useEffect for joined");
  //   return () => {
  //     socket.current.emit("disconnect");

  //     socket.current.off();
  //   };
  // }, []);

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
            placeholder="Search your Rooms"
            onChange={(e) => {
              setText(e.target.value);
              console.log("isko baadme dekh lenge");
            }}
          />
          <i
            className="fas fa-bars"
            style={{
              color: "yellow",
              paddingLeft: "3px",
              paddingRight: "2px",
              marginTop: "auto",
              marginBottom: "auto",
            }}
            id="modalBtn"
            onClick={() => {
              let modal = document.getElementById("myModal");
              modal.style.display = "block";
            }}
          />
          <div style={{ fontSize: "20px" }} id="myModal" className="modal">
            <div className="modal-content">
              <i
                className="fas fa-times CloseBtn"
                onClick={() => {
                  let modal = document.getElementById("myModal");
                  modal.style.display = "none";
                  dispatch({ type: CLEAR_PROFILES });
                }}
              />
              <div>
                <strong>GroupName:</strong>
                <input
                  type="text"
                  name="text"
                  style={{ borderStyle: "none" }}
                  value={groupName}
                  placeholder="Enter your group name here"
                  onChange={(e) => {
                    setGroupName(e.target.value);
                  }}
                />
              </div>
              <hr style={{ height: "2px", backgroundColor: "black" }} />

              <label for="search">Users:</label>
              <input
                type="search"
                name="search"
                value={text}
                style={{ borderStyle: "none" }}
                placeholder="Search Users here"
                onChange={(e) => {
                  setText(e.target.value);
                  dispatch(getProfiles(e.target.value));
                }}
              />
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
                    <div>
                      <i
                        class="fas fa-user-circle"
                        style={{ fontSize: "25px", marginRight: "7px" }}
                      />
                      <strong
                        style={{
                          // fontWeight: "normal",
                          fontSize: "25px",
                        }}
                      >
                        {person.name}
                      </strong>
                      <i
                        class="fas fa-plus-circle"
                        style={{
                          fontSize: "25px",
                          paddingRight: "3px",
                          float: "right",
                        }}
                        onClick={() => {
                          if (myprofile.name === person.name) {
                            alert("You can't add yourself twice in same group");
                          } else {
                            setGroupMembers([
                              ...groupMembers,
                              { user: person.user, name: person.name },
                            ]);
                          }
                        }}
                      />
                    </div>
                  ))}
              </div>

              {groupMembers && (
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

                    {groupMembers.map((member) => (
                      <div>
                        <i
                          class="fas fa-user-circle"
                          style={{ fontSize: "25px", marginRight: "7px" }}
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
              <div style={{ textAlign: "center" }}>
                <button
                  style={{}}
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
                  socket.current.emit("getRoomById", { roomId: room._id });
                  setSelectedRoom(room);
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
          borderColor: "limegreen",
          borderStyle: "solid",
          flexDirection: "column",
          padding: "2px",
        }}
      >
        {selectedRoom && (
          <RightSideBarGrpChat
            selectedRoom={selectedRoom}
            location={location}
            socket={socket}
          />
        )}
        {!selectedRoom && (
          <h1 style={{ marginLeft: "5px", color: "limegreen" }}>
            Hey Join any room and start chatting
          </h1>
        )}
      </div>
    </Fragment>
  );
};

export default GrpChatCompo;
