import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_ROOM_BY_ID } from "../../reduxstuff/actions/types";

const RightSideBarPriChat = ({ selectedRoom, location, socket, myprofile }) => {
  const dispatch = useDispatch();
  const [chattext, setChatText] = useState("");
  const [chats, setChats] = useState([]);

  const { user, name } = myprofile;
  const [loading, setLoading] = useState(true);

  const particularRoom = useSelector((state) => state.room.particularRoom);

  useEffect(() => {
    socket.current.on("getRoomById", ({ room }) => {
      dispatch({ type: GET_ROOM_BY_ID, payload: room });
    });
    console.log("dispatch for get_room_byid triggered");
  }, [particularRoom]);

  useEffect(() => {
    console.log(selectedRoom);
    if (particularRoom) {
      if (particularRoom._id == selectedRoom.chatroominfo._id) {
        setLoading(false);
        setChats(particularRoom.chats);
      }
    }
  }, [particularRoom]);

  useEffect(() => {
    if (particularRoom) {
      socket.current.emit(
        "joinedRoom",
        { user, name, room: particularRoom.roomName },
        ({ welcomeMessage }) => {
          alert(welcomeMessage);
        }
      );
      console.log("inside useEffect for joined");
    }
    return () => {
      if (particularRoom) {
        socket.current.emit("leaveRoom", {
          user,
          name,
          room: particularRoom.roomName,
        });
        socket.current.emit("disconnect");
        console.log("inside unmount of RightSideBarPriChat");
        socket.current.off("joinedRoom");
      }
    };
  }, [particularRoom]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (chattext) {
      socket.current.emit("sendMessage", {
        user,
        name,
        text: chattext,
        room: particularRoom.roomName,
        roomId: particularRoom._id,
      });
    }
    setChatText("");
  };

  useEffect(() => {
    if (particularRoom) {
      socket.current.on("message", ({ user, name, text }) => {
        setChats((prevchats) => [...prevchats, { user, name, text }]);
      });

      console.log("inside useEffect for message");
    }

    return () => {
      if (particularRoom) {
        socket.current.off("message");
        console.log("inside unmount of off.message(RightSideBarPriChat)");
      }
    };
  }, [chats]);
  if (loading) {
    return <div>Loading...</div>;
  }
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
        <h1 style={{ color: "limegreen" }}>{selectedRoom.roomname}</h1>
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
      </div>
    </Fragment>
  );
};

export default RightSideBarPriChat;
