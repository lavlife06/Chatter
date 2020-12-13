import React, { useState, useEffect, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyRooms } from "../reduxstuff/actions/room";
import io from "socket.io-client";
import GrpChatCompo from "./ChatComponent/GrpChatCompo";
import PriChatCompo from "./ChatComponent/PriChatCompo";
import {
  CLEAR_PARTICULAR_ROOM,
  CLEAR_PROFILES,
} from "../reduxstuff/actions/types";
import { updateProfile } from "../reduxstuff/actions/profile";
import Spinner from "./Layout/Spinner";
let socket;

const Main = ({ location }) => {
  useEffect(() => {
    socket = io("localhost:5000", {
      // query: {
      //   token: localStorage.getItem("token"),
      // },
    });
    console.log("inside mount of Main");
    socket.emit(
      "joined",
      {
        name: myprofile.name,
        user: myprofile.user,
      },
      ({ wlcmsg }) => {
        alert(wlcmsg);
      }
    );
    dispatch(updateProfile(socket.id));
    return () => {
      socket.emit("disconnect");
      console.log("inside unmount of Main");
      socket.off();
    };
  }, []);

  const dispatch = useDispatch();

  const [showGroupChat, setShowGroupChat] = useState(true);

  const myprofile = useSelector((state) => state.profile.myprofile);

  if (!(myprofile.name && socket)) {
    return <Spinner />;
  } else {
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
        {/* <div
        style={{
          flexDirection: "row",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "limegreen",
        }}
      >
        
      </div> */}
        {showGroupChat ? (
          <GrpChatCompo socket={socket} location={location} />
        ) : (
          <PriChatCompo socket={socket} />
        )}
      </div>
    );
  }
};

export default Main;
