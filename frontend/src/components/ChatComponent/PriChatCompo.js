import React, { useState, useEffect, useRef, Fragment } from "react";
import RightSideBar from "./RightSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getProfiles } from "../reduxstuff/actions/profile";
import { CLEAR_PROFILES } from "../reduxstuff/actions/types";
import { createRoom, getMyRooms } from "../reduxstuff/actions/room";
import io from "socket.io-client";
let socket;

const PriChatCompo = ({ location }) => {
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

  const [showGroupChat, setShowGroupChat] = useState(true);
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
          {/* <i
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
        /> */}
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
          <RightSideBar
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

export default PriChatCompo;
