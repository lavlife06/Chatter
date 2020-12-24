import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_ROOM_BY_ID } from "../../reduxstuff/actions/types";
import "./chat.css";

const RightSideBarGrpChat = ({
  selectedRoom,
  location,
  socket,
  changeRoomsStack,
  theRooms,
}) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const myParticularRoom = useSelector((state) => state.room.particularRoom);

  useEffect(() => {
    socket.on("getRoomById", ({ room }) => {
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
      socket.emit(
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
        socket.emit("leaveRoom", {
          user,
          name,
          room: myParticularRoom.roomName,
        });
        socket.emit("disconnect");
        console.log("inside unmount of RightSideBar");
        socket.off("joinedRoom");
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
      socket.emit("sendGrpMessage", {
        user,
        name,
        text: chattext,
        room: myParticularRoom.roomName,
        roomId: myParticularRoom._id,
      });
    }
    setChatText("");

    // Changing room stack
    if (theRooms.length > 1) {
      if (theRooms[0].roomName != selectedRoom.roomName) {
        theRooms.forEach((arritem, index) => {
          if (arritem.roomName == selectedRoom.roomName) {
            theRooms.splice(index, 1);
            theRooms.splice(0, 0, arritem);
          }
        });
        console.log(theRooms);

        changeRoomsStack(theRooms);
      }
    }
  };

  useEffect(() => {
    if (myParticularRoom) {
      socket.on("message", ({ user, name, text }) => {
        setChats((prevchats) => [...prevchats, { user, name, text }]);
      });

      console.log("inside useEffect for message");
    }

    return () => {
      if (myParticularRoom) {
        socket.off("message");
        console.log("inside unmount of off.message(RightSideBar)");
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
        <h1 style={{ color: "black" }}>{myParticularRoom.roomName}</h1>
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
                  className="chatblockdiv"
                  style={{ borderTopRightRadius: "initial" }}
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
                  className="chatblockdiv"
                  style={{ borderTopLeftRadius: "initial" }}
                >
                  <div style={{ color: "yellow" }}>{item.name}</div>
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
            color: "black",
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
            color: "aquamarine",
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

export default RightSideBarGrpChat;
