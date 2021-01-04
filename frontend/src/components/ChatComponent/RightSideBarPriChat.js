import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_ROOM_BY_ID } from "../../reduxstuff/actions/types";
import "./chat.css";
import { Input } from "antd";

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
      <div className="groupinfodiv">
        <i
          className="fas fa-users usersIcon"
          style={{
            fontSize: "20px",
            borderColor: "aquamarine",
            padding: "7px 5px",
          }}
        />
        <strong
          style={{ color: "aquamarine", fontSize: "25px", marginBottom: "6px" }}
        >
          {selectedRoom.roomname}
        </strong>
      </div>
      <div
        id="chatcontainer"
        style={{ height: "90%", overflowY: "scroll", padding: "7px" }}
      >
        {chats.map((item) => (
          <Fragment>
            {item.name === name ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: "0.8vh",
                }}
              >
                <strong
                  className="chatblockdiv"
                  style={{
                    borderTopRightRadius: "initial",
                    fontSize: "17px",
                    padding: "5px 10px",
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
                  marginBottom: "0.8vh",
                }}
              >
                <strong
                  className="chatblockdiv"
                  style={{
                    borderTopLeftRadius: "initial",
                    fontSize: "17px",
                    padding: "5px 10px",
                  }}
                >
                  <div style={{ color: "yellow" }}>{item.name}</div>
                  {item.text}
                </strong>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div
        style={{
          height: "42px",
          display: "flex",
          flexDirection: "row",
          padding: "2px",
          backgroundColor: "black",
        }}
      >
        <Input
          type="text"
          name="text"
          value={chattext}
          placeholder="Share your views here"
          onChange={(e) => {
            setChatText(e.target.value);
          }}
          onKeyPress={(e) => {
            console.log(e.key);
            if (e.key === "Enter") {
              sendMessage(e);
            }
          }}
          style={{
            flex: 1,
            fontWeight: "500",
            fontSize: "3vh",
            borderRadius: "15px",
            margin: "5px 0px 5px 10px",
          }}
        />
        <i
          onClick={(e) => {
            console.log(e);
            sendMessage(e);
          }}
          className="far fa-paper-plane"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "aquamarine",
            backgroundColor: "black",
            fontSize: "18px",
            fontWeight: "bold",
            paddingBottom: "1px",
            width: "4vw",
            minWidth: "45px",
          }}
        />
      </div>
    </Fragment>
  );
};

export default RightSideBarPriChat;
