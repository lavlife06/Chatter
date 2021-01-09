import React, { useState, useEffect, useRef, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightSideBarGrpChat from "./RightSideBarGrpChat";
import { getProfiles, updateProfile } from "../../reduxstuff/actions/profile";
import { CLEAR_PROFILES, CREATE_ROOM } from "../../reduxstuff/actions/types";
import { getMyRooms } from "../../reduxstuff/actions/room";
import "./chat.css";
import { Input, Modal } from "antd";
import LeftSideBar from "./LeftSideBar";
import CreateRoomModal from "./CreateRoomModal";

const GrpChatCompo = ({
  location,
  socket,
  isModalVisible,
  setIsModalVisible,
}) => {
  const dispatch = useDispatch();

  const myprofile = useSelector((state) => state.profile.myprofile);
  const myRooms = useSelector((state) => state.room.myRooms);

  const [text, setText] = useState("");
  const [roomName, setRoomName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [roomMembers, setRoomMembers] = useState([
    {
      user: myprofile.user,
      name: myprofile.name,
    },
  ]);

  useEffect(() => {
    console.log(`printing socketId from Frontend:${socket.id}`);
    dispatch(updateProfile(socket.id));
  }, [socket.id]);

  useEffect(() => {
    console.log(myRooms);
    let theChangedRooms = myRooms.map((theRoom) => {
      return { ...theRoom, unReadMsgLength: 0 };
    });
    setRooms([...theChangedRooms]);
    console.log("inside setRooms");
  }, []);

  useEffect(() => {
    socket.on("addNewGrpChatRoom", ({ room }) => {
      setRooms((prevrooms) => [{ ...room, unReadMsgLength: 0 }, ...prevrooms]);
      dispatch({ type: CREATE_ROOM, payload: room });
      console.log(room);
    });
    console.log("inside on event addNewGrpChatRoom");

    return () => {
      socket.off("addNewGrpChatRoom");
      console.log("inside unmount of off.addNewGrpChatRoom");
    };
  }, [rooms]);

  useEffect(() => {
    socket.on("newMessage", ({ room, user, name, text }) => {
      console.log(selectedRoom);
      if (rooms.length <= 1) {
        setRooms((prevRooms) => [
          {
            ...prevRooms[0],
            chats: [...prevRooms[0].chats, { user, name, text }],
            unReadMsgLength: prevRooms[0].unReadMsgLength + 1,
          },
        ]);
      } else {
        let theNewArr = [...rooms];
        console.log(theNewArr);
        theNewArr.forEach((arritem, index) => {
          if (arritem.roomName == room.roomName) {
            theNewArr.splice(index, 1);
            theNewArr.splice(0, 0, {
              ...arritem,
              chats: [...arritem.chats, { user, name, text }],
              unReadMsgLength: arritem.unReadMsgLength + 1,
            });
          }
        });
        console.log(theNewArr);
        setRooms([...theNewArr]);
      }
    });
    console.log("inside on event newMessage");

    return () => {
      socket.off("newMessage");
      console.log("inside unmount of off.newMessage");
    };
  }, [rooms]);

  const changeRoomsStack = (rearrangedRooms) => {
    setRooms([...rearrangedRooms]);
  };
  console.log(rooms);
  console.log(selectedRoom);
  return (
    <Fragment>
      <Modal
        title="CreateGroup"
        style={{}}
        visible={isModalVisible}
        onOk={() => {
          socket.emit("createGrpChatRoom", {
            user: myprofile.user,
            roomName,
            roomMembers,
          });
          dispatch({ type: CLEAR_PROFILES });
          setText("");
          setRoomMembers([
            {
              user: myprofile.user,
              name: myprofile.name,
            },
          ]);
          setRoomName("");
          setIsModalVisible(false);
        }}
        onCancel={() => {
          dispatch({ type: CLEAR_PROFILES });
          setText("");
          setRoomMembers([
            {
              user: myprofile.user,
              name: myprofile.name,
            },
          ]);
          setRoomName("");
          setIsModalVisible(false);
        }}
      >
        {" "}
        <CreateRoomModal
          setText={setText}
          text={text}
          socket={socket}
          roomName={roomName}
          setRoomName={setRoomName}
          myprofile={myprofile}
          roomMembers={roomMembers}
          setRoomMembers={setRoomMembers}
        />{" "}
      </Modal>
      <div className="leftsidebardiv">
        <LeftSideBar
          type={"groupChat"}
          myprofile={myprofile}
          rooms={rooms}
          socket={socket}
          setRooms={setRooms}
          setSelectedRoom={setSelectedRoom}
        />
      </div>
      <div className="rightsidebardiv">
        {selectedRoom && (
          <RightSideBarGrpChat
            selectedRoom={selectedRoom}
            location={location}
            socket={socket}
            changeRoomsStack={changeRoomsStack}
            theRooms={rooms}
          />
        )}
        {!selectedRoom && (
          <h1 style={{ marginLeft: "5px", color: "black" }}>
            Hey Join any room and start chatting
          </h1>
        )}
      </div>
    </Fragment>
  );
};

export default GrpChatCompo;

{
  /* <Input
  type="search"
  style={{ borderRadius: "5px" }}
  value={text}
  name="search"
  placeholder="Search your Rooms"
  onChange={(e) => {
    console.log(e.target.value);
    if (!e.target.value) {
      setText("");
      dispatch({ type: CLEAR_PROFILES });
    } else {
      setText(e.target.value);
      console.log("isko baadme dekh lenge");
    }
  }}
/> */
}
