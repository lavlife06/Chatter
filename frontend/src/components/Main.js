import React, { useState, useEffect, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyRooms } from "../reduxstuff/actions/room";
import io from "socket.io-client";
import GrpChatCompo from "./ChatComponent/GrpChatCompo";
import PriChatCompo from "./ChatComponent/PriChatCompo";
let socket;

const Main = ({ location }) => {
  const dispatch = useDispatch();

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

  const myprofile = useSelector((state) => state.profile.myprofile);

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

  return (
    <div
      style={{
        display: "flex",
        marginLeft: "10%",
        marginRight: "10%",
        height: "80vh",
        backgroundColor: "black",
        borderColor: "limegreen",
        borderWidth: "1px",
      }}
    >
      <div
        style={{
          flexDirection: "row",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "limegreen",
        }}
      >
        <div className="tab">
          <button
            className="tablinks"
            onclick={() => {
              setShowGroupChat(true);
            }}
          >
            GroupChat
          </button>
          <button
            className="tablinks"
            onclick={() => {
              setShowGroupChat(false);
            }}
          >
            PrivateChat
          </button>
        </div>
      </div>
      {showGroupChat ? (
        <GrpChatCompo socket={socket} />
      ) : (
        <PriChatCompo socket={socket} />
      )}
    </div>
  );
};

export default Main;
