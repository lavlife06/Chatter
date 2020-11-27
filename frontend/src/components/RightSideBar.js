import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RightSideBar = ({ selectedRoom, socket, location }) => {
  useEffect(() => {
    setChats(selectedRoom.chats);
    console.log("inside useEffect for setChats");
  }, [selectedRoom]);

  const [chattext, setChatText] = useState("");
  const [chats, setChats] = useState([]);

  const myprofile = useSelector((state) => state.profile.myprofile);

  const { user, name } = myprofile;

  useEffect(() => {
    // socket = io("localhost:5000");
    socket.current.emit(
      "joined",
      { name, room: selectedRoom.roomName },
      ({ welcomeMessage }) => {
        alert(welcomeMessage);
      }
    );
    console.log("inside useEffect for joined");
    return () => {
      socket.current.emit("disconnect");

      socket.current.off();
    };
  }, [name, socket, selectedRoom]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (chattext) {
      socket.current.emit("sendMessage", {
        user,
        name,
        text: chattext,
        room: selectedRoom.roomName,
      });
    }
    setChatText("");
  };

  useEffect(() => {
    socket.current.on("message", (chattext) => {
      setChats((prevchats) => [...prevchats, { user, name, text: chattext }]);
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
      <div style={{ height: "10%" }}>
        <h1 style={{ textAlign: "center" }}>{selectedRoom.roomName}</h1>
      </div>
      <div style={{ height: "80%", flexDirection: "column" }}>
        {/* {chats.map((item) => (
          <div> {item.text}</div>
        ))} */}
        Hii
      </div>
      <div style={{ height: "10%" }}>
        Chat:
        <input
          type="text"
          name="text"
          value={chattext}
          placeholder="Share your views here"
          onChange={(e) => {
            setChatText(e.target.value);
          }}
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
