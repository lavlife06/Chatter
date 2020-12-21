import React, { useState, useEffect, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightSideBarGrpChat from "./RightSideBarGrpChat";
import { getProfiles, updateProfile } from "../../reduxstuff/actions/profile";
import { CLEAR_PROFILES } from "../../reduxstuff/actions/types";
import { getMyRooms } from "../../reduxstuff/actions/room";

const GrpChatCompo = ({ location, socket }) => {
  const dispatch = useDispatch();

  const profiles = useSelector((state) => state.profile.profiles);
  const myprofile = useSelector((state) => state.profile.myprofile);
  const myRooms = useSelector((state) => state.room.myRooms);

  const [text, setText] = useState("");
  const [roomName, setRoomName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    console.log(`printing socketId from Frontend:${socket.id}`);
    dispatch(updateProfile(socket.id));
  }, [socket.id]);

  useEffect(() => {
    console.log(myRooms);
    let theChangedRooms = myRooms.map((theRoom) => {
      return { ...theRoom, unReadMsgLength: 0 };
    });
    setRooms([...theChangedRooms]);
    console.log("inside setRooms");
  }, [location]);

  useEffect(() => {
    socket.on("addNewGrpChatRoom", ({ room }) => {
      setRooms((prevrooms) => [...prevrooms, room]);
      console.log(room);
    });
    console.log("inside on event addNewGrpChatRoom");

    return () => {
      socket.off("addNewGrpChatRoom");
      console.log("inside unmount of off.addNewGrpChatRoom");
    };
  }, [rooms]);

  const [roomMembers, setRoomMembers] = useState([
    {
      user: myprofile.user,
      name: myprofile.name,
    },
  ]);

  useEffect(() => {
    socket.on("newMessage", ({ room }) => {
      if (rooms[0].roomName != room.roomName) {
        if (rooms.length <= 1) {
          setRooms((prevRooms) => [
            {
              ...prevRooms[0],
              unReadMsgLength: prevRooms[0].unReadMsgLength + 1,
            },
          ]);
        } else {
          let theNewArr = [...rooms];
          console.log(theNewArr);
          theNewArr.forEach((arritem, index) => {
            console.log(arritem);
            console.log(room);
            if (arritem.roomName == room.roomName) {
              console.log("matched");
              theNewArr.splice(index, 1);
              theNewArr.splice(0, 0, {
                ...arritem,
                unReadMsgLength: arritem.unReadMsgLength + 1,
              });
            }
          });
          console.log(theNewArr);
          setRooms([...theNewArr]);
        }
      }
    });
    console.log("inside on event newMessage");

    return () => {
      socket.off("newMessage");
      console.log("inside unmount of off.newMessage");
    };
  }, [rooms]);

  const changeRoomsStack = (rearrangedRooms) => {
    setRooms([...rearrangedRooms]);
  };

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
            className="fas fa-window-close clearBtn"
            onClick={() => {
              setText("");
              dispatch({ type: CLEAR_PROFILES });
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
                  setText("");
                  setRoomMembers([
                    {
                      user: myprofile.user,
                      name: myprofile.name,
                    },
                  ]);
                  setRoomName("");
                }}
              />
              <div>
                <strong>GroupName:</strong>
                <input
                  type="text"
                  name="text"
                  style={{ borderStyle: "none" }}
                  value={roomName}
                  placeholder="Enter your group name here"
                  onChange={(e) => {
                    setRoomName(e.target.value);
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
                        className="fas fa-user-circle"
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
                        className="fas fa-plus-circle"
                        style={{
                          fontSize: "25px",
                          paddingRight: "3px",
                          float: "right",
                        }}
                        onClick={() => {
                          if (myprofile.name === person.name) {
                            alert("You can't add yourself twice in same group");
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
                    console.log(roomMembers, roomName);
                    socket.emit("createGrpChatRoom", {
                      user: myprofile.user,
                      roomName,
                      roomMembers,
                    });
                    let modal = document.getElementById("myModal");
                    modal.style.display = "none";
                    dispatch({ type: CLEAR_PROFILES });
                    setText("");
                    setRoomMembers([
                      {
                        user: myprofile.user,
                        name: myprofile.name,
                      },
                    ]);
                    setRoomName("");
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div>
            {rooms.map((room) => (
              <div
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
                <strong style={{ fontWeight: "normal", float: "right" }}>
                  {room.unReadMsgLength}
                </strong>
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
            changeRoomsStack={changeRoomsStack}
            theRooms={rooms}
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
