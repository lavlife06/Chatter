import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyRooms } from "../reduxstuff/actions/room";
import io from "socket.io-client";
import GrpChatCompo from "./ChatComponent/GrpChatCompo";
import PriChatCompo from "./ChatComponent/PriChatCompo";
import { CLEAR_PARTICULAR_ROOM } from "../reduxstuff/actions/types";
import Spinner from "./Layout/Spinner";
let socket;

const Main = ({ location }) => {
  const dispatch = useDispatch();
  const myRoomsLoading = useSelector((state) => state.room.loading);
  const myprofileLoading = useSelector((state) => state.profile.loading);
  const myprofile = useSelector((state) => state.profile.myprofile);

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
      }
      // ({ wlcmsg }) => {
      //   alert(wlcmsg);
      // }
    );

    // dispatch(getMyRooms());

    return () => {
      console.log(socket);
      socket.disconnect(true);
      console.log("inside unmount of Main");
      socket.off("joined");
      console.log(socket);
    };
  }, [location]);

  const [showGroupChat, setShowGroupChat] = useState(true);

  if (!myRoomsLoading && !myprofileLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="maindiv1">
          <button
            className={showGroupChat ? "truetablink" : "tablink"}
            style={{
              display: "flex",
              borderRadius: "15px",
            }}
            onClick={() => {
              dispatch({ type: CLEAR_PARTICULAR_ROOM });
              setShowGroupChat(true);
              console.log("groupchat clicked");
            }}
          >
            GroupChat
          </button>
          <button
            className={showGroupChat ? "tablink" : "truetablink"}
            style={{
              display: "flex",
              borderRadius: "15px",
            }}
            onClick={() => {
              dispatch({ type: CLEAR_PARTICULAR_ROOM });
              setShowGroupChat(false);
              console.log("prichat clicked");
            }}
          >
            PrivateChat
          </button>
        </div>
        <div className="maindiv2">
          {showGroupChat ? (
            <GrpChatCompo socket={socket} />
          ) : (
            <PriChatCompo socket={socket} />
          )}
        </div>
      </div>
    );
  }
  //  else if (!(myprofile.name && socket && myRooms.length)) {
  //   console.log(myRooms);
  //   // if (myprofile.myRooms.length!=0) {
  //   return <Spinner />;
  //   // }
  // }
  else {
    return <Spinner />;
  }
};

export default Main;
