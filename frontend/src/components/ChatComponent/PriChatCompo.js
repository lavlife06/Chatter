import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfiles, updateProfile } from "../../reduxstuff/actions/profile";
import {
  CLEAR_PROFILES,
  CREATE_PRICHATROOM,
} from "../../reduxstuff/actions/types";
import RightSideBarPriChat from "./RightSideBarPriChat";
import "./chat.css";
import LeftSideBar from "./LeftSideBar";
import { Input, Modal } from "antd";
import ChatPrivateModal from "./ChatPrivateModal";

const PriChatCompo = ({
  location,
  socket,
  isModalVisible,
  setIsModalVisible,
}) => {
  const dispatch = useDispatch();
  // const [roomChats, setRoomChats] = useState("");

  const [text, setText] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const profiles = useSelector((state) => state.profile.profiles);
  const myprofile = useSelector((state) => state.profile.myprofile);
  const myPriChatRooms = useSelector((state) => state.room.myPriChatRooms);
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
    console.log(myPriChatRooms);
    let theChangedRooms = myPriChatRooms.map((theRoom) => {
      return { ...theRoom, unReadMsgLength: 0 };
    });
    setRooms([...theChangedRooms]);
    console.log("inside setRooms");
  }, []);

  useEffect(() => {
    socket.on("addNewPriChatRoom", ({ roomName, room }) => {
      setRooms((prevrooms) => [
        { chatRoom: room, roomname: roomName, unReadMsgLength: 0 },
        ...prevrooms,
      ]);

      dispatch({ type: CREATE_PRICHATROOM, payload: { room, roomName } });
      console.log(room);
    });
    console.log("inside on event addNewPriChatRoom");

    return () => {
      socket.off("addNewPriChatRoom");
      console.log("inside unmount of off.addNewPriChatRoom");
    };
  }, [rooms]);

  useEffect(() => {
    socket.on("newMessage", ({ room }) => {
      let theFirstRoom;
      if (selectedRoom) {
        theFirstRoom = selectedRoom.chatroominfo;
      } else {
        theFirstRoom = rooms[0].chatRoom;
      }
      console.log(theFirstRoom);
      if (theFirstRoom._id != room._id) {
        if (rooms.length <= 1) {
          setRooms((prevRooms) => [
            {
              ...prevRooms[0],
              unReadMsgLength: prevRooms[0].unReadMsgLength + 1,
            },
          ]);
        } else {
          let theNewArr = [...rooms];
          console.log(theNewArr);
          theNewArr.forEach((arritem, index) => {
            if (arritem.chatRoom._id == room._id) {
              theNewArr.splice(index, 1);
              theNewArr.splice(0, 0, {
                ...arritem,
                unReadMsgLength: arritem.unReadMsgLength + 1,
              });
            }
          });

          console.log(theNewArr);
          setRooms([...theNewArr]);
        }
      }
    });
    console.log("inside on event newMessage");

    return () => {
      socket.off("newMessage");
      console.log("inside unmount of off.newMessage");
    };
  }, [rooms, socket]);

  const changePriRoomsStack = (rearrangedRooms) => {
    setRooms([...rearrangedRooms]);
  };
  console.log(rooms);
  return (
    <Fragment>
      <Modal
        title="Start Private Chat"
        visible={isModalVisible}
        onOk={() => {
          dispatch({ type: CLEAR_PROFILES });
          setText("");
          setRoomMembers([
            {
              user: myprofile.user,
              name: myprofile.name,
            },
          ]);
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
          setIsModalVisible(false);
        }}
      >
        {" "}
        <ChatPrivateModal
          setText={setText}
          text={text}
          socket={socket}
          myprofile={myprofile}
          roomMembers={roomMembers}
          setRoomMembers={setRoomMembers}
          setSelectedRoom={setSelectedRoom}
          setIsModalVisible={setIsModalVisible}
        />{" "}
      </Modal>
      <div className="leftsidebardiv">
        <LeftSideBar
          type={"privateChat"}
          myprofile={myprofile}
          rooms={rooms}
          socket={socket}
          setRooms={setRooms}
          setSelectedRoom={setSelectedRoom}
        />
      </div>
      <div className="rightsidebardiv">
        {selectedRoom && (
          <RightSideBarPriChat
            selectedRoom={selectedRoom}
            location={location}
            socket={socket}
            myprofile={myprofile}
            changePriRoomsStack={changePriRoomsStack}
            theRooms={rooms}
          />
        )}
        {!selectedRoom && (
          <h1 style={{ marginLeft: "5px", color: "black" }}>
            Hey why don't you start chatting
          </h1>
        )}
      </div>
    </Fragment>
  );
};

export default PriChatCompo;

// {profiles &&
//   profiles.map((person) => (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         borderBottomColor: "limegreen",
//         borderBottomWidth: "1px",
//         borderBottomStyle: "solid",
//         lineHeight: "7vh",
//         borderRadius: "5px",
//         margin: "2px",
//         paddingLeft: "2px",
//         paddingRight: "2px",
//         alignItems: "center",
//       }}
//     >
//       <i
//         className="fas fa-user-circle"
//         style={{
//           fontSize: "3.8vh",
//           marginRight: "7px",
//           color: "lightcyan",
//         }}
//       />
//       <strong
//         style={{
//           // fontWeight: "normal",
//           fontSize: "3.8vh",
//           color: "limegreen",
//         }}
//       >
//         {person.name}
//       </strong>
//       <div
//         style={{
//           display: "flex",
//           fontSize: "3vh",
//           paddingRight: "3px",
//           // float: "right",
//           borderRadius: "10%",
//           backgroundColor: "yellow",
//           color: "black",
//           height: "3.7vh",
//           width: "4vw",
//           justifyContent: "center",
//           alignItems: "center",
//           fontWeight: "bold",
//           cursor: "pointer",
//         }}
//         onClick={() => {
//           let theSelectedRoom = myprofile.myPrivateChatRooms.filter(
//             (myRoom) => myRoom.user == person.user
//           );
//           console.log(theSelectedRoom);
//           if (myprofile.name === person.name) {
//             alert("You can't message your own account");
//           } else if (theSelectedRoom.length === 0) {
//             socket.emit("createPriChatRoom", {
//               user: myprofile.user,
//               roomMembers: [
//                 ...roomMembers,
//                 { user: person.user, name: person.name },
//               ],
//             });
//             setText("");
//             setRoomMembers([
//               {
//                 user: myprofile.user,
//                 name: myprofile.name,
//               },
//             ]);
//             dispatch({ type: CLEAR_PROFILES });
//           } else {
//             socket.emit("getRoomById", {
//               roomId: theSelectedRoom[0].roomId,
//             });
//             setSelectedRoom({
//               chatroominfo: theSelectedRoom[0],
//               roomname: person.name,
//             });
//             setText("");
//             dispatch({ type: CLEAR_PROFILES });
//           }
//         }}
//       >
//         Chat
//       </div>
//     </div>
//   ))}

// <input
//   type="search"
//   name="search"
//   value={text}
//   style={{ borderRadius: "5px" }}
//   placeholder="Search for users and chat with them"
//   onChange={(e) => {
//     console.log(e.target.value);
//     if (!e.target.value) {
//       setText("");
//       dispatch({ type: CLEAR_PROFILES });
//     } else {
//       setText(e.target.value);
//       dispatch(getProfiles(e.target.value));
//     }
//   }}
// />
