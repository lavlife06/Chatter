import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../reduxstuff/actions/profile";

const RightSideBarGrpChat = ({ location, socket }) => {
  const dispatch = useDispatch();

  const myprofile = useSelector((state) => state.profile.myprofile);

  useEffect(() => {
    // console.log(`my name ${name},my socketId: ${socket.id},from frontend`);
    socket.emit("tjoinedRoom", { user, name }, ({ welcomeMessage }) => {
      alert(welcomeMessage);
    });
    console.log("inside useEffect for joined");
    // return () => {
    //   socket.emit("leaveRoom", {
    //     user,
    //     name,
    //   });
    //   socket.emit("disconnect");
    //   console.log("inside unmount of RightSideBar");
    //   socket.off("joinedRoom");
    // };
  }, [location]);

  const [chattext, setChatText] = useState("");
  const [chats, setChats] = useState([]);
  const [rooms, setRooms] = useState([]);

  const { user, name } = myprofile;

  const sendMessage = (e) => {
    e.preventDefault();

    if (chattext) {
      socket.emit("tsendMessage", {
        user,
        name,
        text: chattext,
      });
    }
    setChatText("");
  };

  useEffect(() => {
    socket.on("tcreateroom", ({ room }) => {
      setRooms((prevrooms) => [...prevrooms, room]);
      console.log(room);
    });
    console.log("inside useEffect for message");

    return () => {
      socket.off("tcreateroom");
      console.log("inside unmount of off.message(RightSideBar)");
    };
  }, [rooms]);

  useEffect(() => {
    socket.on("message", ({ user, name, text }) => {
      setChats((prevchats) => [...prevchats, { user, name, text }]);
    });

    console.log("inside useEffect for message");

    return () => {
      socket.off("message");
      console.log("inside unmount of off.message(RightSideBar)");
    };
  }, [chats]);

  return (
    // <div style={{ padding: "2px" }}>
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
        {rooms.map((room) => (
          <h1 style={{ color: "limegreen" }}>{room}</h1>
        ))}
        <h1 style={{ color: "limegreen" }}>GlobalRoom hai Re</h1>
      </div>
      <div style={{ height: "90%", overflowY: "scroll" }}>
        {chats.map((item) => (
          <Fragment>
            {item.name === name ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <strong
                  style={{
                    // backgroundColor: "limegreen",
                    borderRadius: "10%",
                    borderWidth: "1px",
                    borderColor: "limegreen",
                    borderStyle: "solid",
                    fontWeight: "normal",
                    padding: "5px",
                    marginBottom: "3px",
                    color: "yellow",
                  }}
                >
                  {" "}
                  {item.text}
                </strong>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <strong
                  style={{
                    // backgroundColor: "limegreen",
                    borderRadius: "10%",
                    borderWidth: "1px",
                    borderColor: "limegreen",
                    borderStyle: "solid",
                    fontWeight: "normal",
                    padding: "5px",
                    marginBottom: "3px",
                    color: "yellow",
                  }}
                >
                  <div style={{ color: "deepskyblue" }}>{item.name}</div>
                  {item.text}
                </strong>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div style={{ height: "20px", display: "flex", flexDirection: "row" }}>
        <strong
          style={{
            color: "limegreen",
            paddingLeft: "2px",
            paddingRight: "2px",
          }}
        >
          Chat:
        </strong>
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
          style={{
            color: "limegreen",
            backgroundColor: "black",
            fontSize: "15px",
            fontWeight: "bold",
            paddingBottom: "1px",
          }}
          onClick={(e) => {
            sendMessage(e);
          }}
        />
        <div>
          <button
            onClick={() => {
              // setRooms((prevrooms) => [...prevrooms, "achaRoomHai"]);
              socket.emit("bhaicreateroom", {
                room: "achaRoomHai",
                withGuy: "karan",
              });
            }}
          >
            CreateRoom
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default RightSideBarGrpChat;
