const verify = require("../verifytokenmw/verify_mv");
const User = require("../models/User");
const Profile = require("../models/Profile");
const Room = require("../models/Room");

module.exports = (app) => {
    app.get("/api/room/myRooms", verify, async (req, res) => {
        try {
            let rooms = await Room.find();
            let myprofile = await Profile.findOne({
                user: req.user.id,
            });

            let myGrpChatallrooms = [];
            let myPriChatallrooms = [];

            if (myprofile.myRooms.length) {
                myprofile.myRooms.map((item) => {
                    let foundedroom = rooms.filter(
                        (roomitem) => roomitem._id.toString() == item.roomId
                    );
                    myGrpChatallrooms = [...myGrpChatallrooms, ...foundedroom];
                });
            }

            if (myprofile.myPrivateChatRooms.length) {
                myprofile.myPrivateChatRooms.map((item) => {
                    let foundedroom = rooms.filter(
                        (roomitem) => roomitem._id.toString() == item.roomId
                    );
                    myPriChatallrooms = [...myPriChatallrooms, ...foundedroom];
                });
            }

            res.json({ myGrpChatallrooms, myPriChatallrooms });
        } catch (err) {
            res.status(500).send("Server Error");
            console.error(err.message);
        }
    });
};
