import React, { useState, useEffect, useRef } from "react";
import RightSideBar from "./RightSideBar";
import io from "socket.io-client";
let socket;

const Main = () => {
  const [searchedUser, setSearchedUser] = useState([]);
  const [searchedModalUser, setSearchedModalUser] = useState([]);
  const [text, setText] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [groupMembers, setGroupMembers] = useState("");

  socket = useRef(io("localhost:5000"));

  const [users, setUsers] = useState([
    "lav",
    "karan",
    "lavv",
    "kkaran",
    "bhavesh",
    "bhavin",
  ]);

  useEffect(() => {
    // socket = io("localhost:5000");
    socket.current.emit("joined/", () => {});

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
      }}
    >
      <div
        style={{
          flexDirection: "row",
          borderWidth: "1px",
          borderColor: "black",
          borderStyle: "solid",
        }}
      >
        <div>
          <div className>
            <input
              type="search"
              name="search"
              value={text}
              placeholder="Search the user/group"
              onChange={(e) => {
                setText(e.target.value);
                setSearchedUser(
                  users.filter((name) => name === e.target.value)
                );
              }}
            />
            <i
              className="fas fa-bars"
              id="modalBtn"
              onClick={() => {
                let modal = document.getElementById("myModal");
                modal.style.display = "block";
              }}
            />
            <div id="myModal" className="modal">
              <div className="modal-content">
                <i
                  className="fas fa-times CloseBtn"
                  onClick={() => {
                    let modal = document.getElementById("myModal");
                    modal.style.display = "none";
                  }}
                />
                <input
                  type="search"
                  name="search"
                  value={text}
                  placeholder="Search the user/group"
                  onChange={(e) => {
                    setText(e.target.value);
                    setSearchedModalUser(
                      users.filter((name) => name === e.target.value)
                    );
                  }}
                />
                <div>
                  {searchedModalUser.map((user) => (
                    <div>
                      {user}
                      <i
                        class="fas fa-plus-circle CloseBtn"
                        onClick={() => {
                          setGroupMembers([...groupMembers, user]);
                        }}
                      >
                        Add
                      </i>
                    </div>
                  ))}
                </div>
                {groupMembers}
              </div>
            </div>
          </div>
        </div>
        <div>
          {searchedUser.map((user) => (
            <div>
              <input
                type="submit"
                value={user}
                onClick={() => {
                  setSelectedUser(user);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          flex: 3,
          borderWidth: "1px",
          borderColor: "black",
          borderStyle: "solid",
          flexDirection: "column",
        }}
      >
        <RightSideBar selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default Main;
