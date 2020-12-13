import React, { Fragment } from "react";
import RightSideBarGrpChat from "./RightSideBarGrpChat";

const GrpChatCompo = ({ location, socket }) => {
  return (
    <Fragment>
      <div
        style={{
          flexDirection: "row",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "limegreen",
        }}
      >
        <div
          style={{
            borderColor: "limegreen",
            borderWidth: "1px",
            margin: "2px",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flex: 3,
            borderWidth: "1px",
            borderColor: "limegreen",
            borderStyle: "solid",
            flexDirection: "column",
            padding: "2px",
          }}
        >
          <RightSideBarGrpChat location={location} socket={socket} />
        </div>
      </div>
    </Fragment>
  );
};

export default GrpChatCompo;
