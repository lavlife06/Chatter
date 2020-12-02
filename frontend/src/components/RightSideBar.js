import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_ROOM_BY_ID } from "../reduxstuff/actions/types";

const RightSideBar = ({ selectedRoom, location, socket }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const myParticularRoom = useSelector((state) => state.room.particularRoom);

  useEffect(() => {
    socket.current.on("getRoomById", ({ room }) => {
      dispatch({ type: GET_ROOM_BY_ID, payload: room });
    });
    if (myParticularRoom) {
      if (myParticularRoom.roomName == selectedRoom.roomName) {
        setLoading(false);
        setChats(myParticularRoom.chats);
      }
    }
  }, [myParticularRoom]);

  useEffect(() => {
    if (myParticularRoom) {
      socket.current.emit(
        "joinedRoom",
        { user, name, room: myParticularRoom.roomName },
        ({ welcomeMessage }) => {
          alert(welcomeMessage);
        }
      );
      console.log("inside useEffect for joined");
    }
    return () => {
      if (myParticularRoom) {
        socket.current.emit("leaveRoom", {
          user,
          name,
          room: myParticularRoom.roomName,
        });
        socket.current.emit("disconnect");
        console.log("inside unmount of RightSideBar");
        socket.current.off("joinedRoom");
      }
    };
  }, [myParticularRoom]);

  const [chattext, setChatText] = useState("");
  const [chats, setChats] = useState([]);

  const myprofile = useSelector((state) => state.profile.myprofile);

  const { user, name } = myprofile;

  const sendMessage = (e) => {
    e.preventDefault();

    if (chattext) {
      socket.current.emit("sendMessage", {
        user,
        name,
        text: chattext,
        room: myParticularRoom.roomName,
        roomId: myParticularRoom._id,
      });
    }
    setChatText("");
  };

  useEffect(() => {
    if (myParticularRoom) {
      socket.current.on("message", ({ user, name, text }) => {
        setChats((prevchats) => [...prevchats, { user, name, text }]);
      });

      console.log("inside useEffect for message");
    }

    return () => {
      if (myParticularRoom) {
        socket.current.off("message");
        console.log("inside unmount of off.message(RightSideBar)");
      }
    };
  }, [chats]);
  if (loading) {
    return <div>Loading...</div>;
  }
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
        <h1 style={{}}>{myParticularRoom.roomName}</h1>
      </div>
      <div style={{ height: "90%", overflow: "scroll" }}>
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
                    borderRadius: "5%",
                    borderWidth: "1px",
                    borderColor: "black",
                    borderStyle: "solid",
                    fontWeight: "normal",
                    padding: "5px",
                    marginBottom: "3px",
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
                    borderRadius: "5%",
                    borderWidth: "1px",
                    borderColor: "black",
                    borderStyle: "solid",
                    fontWeight: "normal",
                    padding: "5px",
                  }}
                >
                  {" "}
                  {item.text}
                </strong>
              </div>
            )}
          </Fragment>
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
