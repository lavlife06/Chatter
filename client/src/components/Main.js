/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import Spinner from "./Layout/Spinner";
import { updateProfile } from "../reduxstuff/actions/profile";
import RoomStack from "./ChatComponent/roomStack";
import { SETUP_SOCKET } from "../reduxstuff/actions/types";

const Main = () => {
    const dispatch = useDispatch();

    const myRoomsLoading = useSelector((state) => state.room.loading);
    const myprofileLoading = useSelector((state) => state.profile.loading);
    const myprofile = useSelector((state) => state.profile.myprofile);
    const socket = useSelector((state) => state.auth.socket);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        let socketinstance;
        if (token) {
            socketinstance = io(
                "https://chatter-chatapplication.herokuapp.com",
                {
                    query: {
                        token,
                    },
                }
            );
            // let mysocketid;
            let checker = setInterval(() => {
                if (socketinstance.connected) {
                    if (myprofile.socketId != "") {
                        socketinstance.id = myprofile.socketId;
                    } else {
                        dispatch(updateProfile(socketinstance.id));
                    }
                    dispatch({ type: SETUP_SOCKET, payload: socketinstance });

                    socketinstance.emit("joined", {
                        name: myprofile.name,
                    });

                    clearInterval(checker);
                }
            }, 700);
        }

        return () => {
            if (token) {
                socketinstance.disconnect(true);
                socketinstance.off("joined");
            }
        };
    }, []);

    if (!myRoomsLoading && !myprofileLoading && socket) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div className="maindiv2">
                    <RoomStack />
                </div>
            </div>
        );
    } else {
        return <Spinner type={"dataloading"} />;
    }
};

export default Main;
