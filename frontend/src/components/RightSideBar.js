import React, { Fragment, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
let socket;

const RightSideBar = ({ selectedRoom, socket, location }) => {
  socket = useRef(
    io("localhost:5000", {
      query: {
        token: localStorage.getItem("token"),
      },
    })
  );

  useEffect(() => {
    setChats(selectedRoom.chats);
    console.log("inside useEffect for setChats");
  }, [selectedRoom]);

  const [chattext, setChatText] = useState("");
  const [chats, setChats] = useState([]);

  const myprofile = useSelector((state) => state.profile.myprofile);

  const { user, name } = myprofile;

  useEffect(() => {
    socket.current.emit(
      "joined",
      { user, name, room: selectedRoom.roomName },
      ({ welcomeMessage }) => {
        alert(welcomeMessage);
      }
    );
    console.log("inside useEffect for joined");
    return () => {
      socket.current.emit("disconnect");

      socket.current.off();
    };
  }, [selectedRoom]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (chattext) {
      socket.current.emit("sendMessage", {
        user,
        name,
        text: chattext,
        room: selectedRoom.roomName,
        roomId: selectedRoom._id,
      });
    }
    setChatText("");
  };

  useEffect(() => {
    socket.current.on("message", ({ user, name, text }) => {
      setChats((prevchats) => [...prevchats, { user, name, text }]);
    });
    console.log("inside useEffect for message");
    // socket.on("roomData", ({ users }) => {
    //   setUsers(users);
    // });
  }, [setChats]);

  console.log(chats);
  console.log(chattext);

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "20px",
          marginTop: "8px",
          marginBottom: "8px",
        }}
      >
        <h1 style={{}}>{selectedRoom.roomName}</h1>
      </div>
      <div style={{ height: "90%" }}>
        {chats.map((item) => (
          <div
            style={{
              display: "inline-block",
              borderRadius: "5%",
              borderWidth: "1px",
              borderColor: "black",
              borderStyle: "solid",
            }}
          >
            {" "}
            {item.text}
          </div>
        ))}
      </div>
      <div style={{ height: "20px", display: "flex", flexDirection: "row" }}>
        Chat:
        <input
          type="text"
          name="text"
          value={chattext}
          placeholder="Share your views here"
          onChange={(e) => {
            setChatText(e.target.value);
          }}
          style={{ flex: 1 }}
        />
        <input
          type="submit"
          value="Submit"
          onClick={(e) => {
            sendMessage(e);
          }}
        />
      </div>
    </Fragment>
  );
};

export default RightSideBar;
