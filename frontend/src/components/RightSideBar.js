import React, { Fragment, useState } from "react";

const RightSideBar = ({ selectedUser }) => {
  const [chattext, setChatText] = useState("");
  const [chat, setChat] = useState(["hii", "kaise", "ho"]);

  return (
    <Fragment>
      <div style={{ height: "10%" }}>{selectedUser}</div>
      <div style={{ height: "80%", flexDirection: "column" }}>
        {chat.map((item) => (
          <div> {item}</div>
        ))}
      </div>
      <div style={{ height: "10%" }}>
        Chat:
        <input
          type="search"
          name="search"
          value={chattext}
          placeholder="Search the user/group"
          onChange={(e) => {
            setChatText(e.target.value);
          }}
        />
        <input
          type="submit"
          value="Submit"
          onClick={() => {
            setChat([...chat, chattext]);
            setChatText("");
          }}
        />
      </div>
    </Fragment>
  );
};

export default RightSideBar;