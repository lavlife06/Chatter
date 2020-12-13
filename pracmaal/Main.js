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
  const myRooms = useSelector((state) => state.room.myRooms);

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

    dispatch(getMyRooms());

    return () => {
      socket.emit("disconnect");
      console.log("inside unmount of Main");
      socket.off();
    };
  }, [location]);

  const [showGroupChat, setShowGroupChat] = useState(true);

  const myprofile = useSelector((state) => state.profile.myprofile);

  if (!(myprofile.name && socket && myRooms.length)) {
    console.log(myRooms);
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
              onClick={() => {
                dispatch({ type: CLEAR_PARTICULAR_ROOM });
                setShowGroupChat(true);
                console.log("groupchat clicked");
              }}
            >
              GroupChat
            </button>
            <button
              className="tablinks"
              onClick={() => {
                dispatch({ type: CLEAR_PARTICULAR_ROOM });
                setShowGroupChat(false);
                console.log("prichat clicked");
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
  }
};

export default Main;
