import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
const Helper = () => {
    const dispatch = useDispatch();

    const myprofile = useSelector((state) => state.profile.myprofile);
    const myRooms = useSelector((state) => state.room.myRooms);
    const socket = useSelector((state) => state.auth.socket);

    const newMessage = (room, user, name, text) => {
        let theNewArr = [...myRooms];

        theNewArr.forEach((arritem, index) => {
            if (arritem._id == room) {
                theNewArr.splice(index, 1);
                theNewArr.splice(0, 0, {
                    ...arritem,
                    chats: [...arritem.chats, { user, name, text }],
                    unReadMsgLength: arritem.unReadMsgLength + 1,
                });
            }
        });

        return theNewArr;
    };

    return [newMessage];
};

export default Helper;
