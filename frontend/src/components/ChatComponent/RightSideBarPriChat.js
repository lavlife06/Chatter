import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_ROOM_BY_ID } from "../../reduxstuff/actions/types";
import "./chat.css";

const RightSideBarPriChat = ({
  selectedRoom,
  location,
  socket,
  myprofile,
  changePriRoomsStack,
  theRooms,
}) => {
  const dispatch = useDispatch();
  const [chattext, setChatText] = useState("");
  const [chats, setChats] = useState([]);

  const { user, name } = myprofile;
  const [loading, setLoading] = useState(true);

  const particularRoom = useSelector((state) => state.room.particularRoom);

  useEffect(() => {
    socket.on("getRoomById", ({ room }) => {
      dispatch({ type: GET_ROOM_BY_ID, payload: room });
    });
    console.log("dispatch for get_room_byid triggered");
    return () => {
      socket.off("getRoomById");
      console.log("inside unmount of getroombyid");
    };
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
      socket.emit("joinedPriRoom", {
        roomId: particularRoom._id,
      });
      console.log("inside useEffect for joined");
    }
    return () => {
      if (particularRoom) {
        socket.emit("leavePriRoom", {
          roomId: particularRoom._id,
        });
        console.log("inside unmount of RightSideBarPriChat");
        socket.off("joinedPriRoom");
        // socket.off("leavePriRoom");
      }
    };
  }, [particularRoom]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (chattext) {
      socket.emit("sendPriMessage", {
        user,
        name,
        text: chattext,
        roomId: particularRoom._id,
      });
    }
    setChatText("");

    // Changing room stack
    if (theRooms.length > 1) {
      if (theRooms[0].roomname != selectedRoom.roomname) {
        theRooms.forEach((arritem, index) => {
          if (arritem.roomname == selectedRoom.roomname) {
            theRooms.splice(index, 1);
            theRooms.splice(0, 0, arritem);
          }
        });
        console.log(theRooms);
        changePriRoomsStack(theRooms);
      }
    }
  };

  const theScrollToBottom = () => {
    let chatContainer = document.getElementById("chatcontainer");
    if (chatContainer) {
      let scroll = chatContainer.scrollHeight - chatContainer.clientHeight;
      chatContainer.scrollTo(0, scroll);
    }
  };

  useEffect(() => {
    if (particularRoom) {
      socket.on("message", ({ user, name, text }) => {
        setChats((prevchats) => [...prevchats, { user, name, text }]);
      });
      theScrollToBottom();
      console.log("inside useEffect for message");
    }

    return () => {
      if (particularRoom) {
        socket.off("message");
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
        <h1 style={{ color: "black" }}>{selectedRoom.roomname}</h1>
      </div>
      <div id="chatcontainer" style={{ height: "90%", overflowY: "scroll" }}>
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

export default RightSideBarPriChat;
