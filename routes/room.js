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
      // myprofile.myRooms.forEach((item) => {
      //   // let foundedroom = rooms.filter(
      //   //   (roomitem) => roomitem._id === item.roomId
      //   // );
      //   rooms.forEach((roomitem) => {
      //     console.log(roomitem._id);
      //     console.log(item.roomId);
      //     if (roomitem._id.toString() == item.roomId) {
      //       console.log("entered");
      //       myGrpChatallrooms.push(roomitem);
      //     }
      //   });
      //   console.log(myGrpChatallrooms);
      // });
      myprofile.myRooms.map((item) => {
        let foundedroom = rooms.filter(
          (roomitem) => roomitem._id.toString() == item.roomId
        );
        myGrpChatallrooms = [...myGrpChatallrooms, ...foundedroom];
      });

      myprofile.myPrivateChatRooms.map((item) => {
        let foundedroom = rooms.filter(
          (roomitem) => roomitem._id.toString() == item.roomId
        );
        myPriChatallrooms = [
          ...myPriChatallrooms,
          { chatRoom: foundedroom[0], roomname: item.name },
        ];
      });

      res.json({ myGrpChatallrooms, myPriChatallrooms });
    } catch (err) {
      res.status(500).send("Server Error");
      console.error(err.message);
    }
  });

  // app.post("/api/room/createroom", verify, async (req, res) => {
  //   const { roomName, roomMembers } = req.body;
  //   try {
  //     let room = new Room({
  //       user: req.user.id,
  //       roomName,
  //       roomMembers,
  //     });
  //     await room.save();

  //     roomMembers.forEach(async (memberDetail) => {
  //       let roomId = room._id;
  //       try {
  //         let memberProfile = await Profile.findOne({
  //           user: memberDetail.user,
  //         });

  //         memberProfile.myRooms.push({ roomId, roomName });

  //         await memberProfile.save();
  //       } catch (err) {
  //         console.error(err.message);
  //       }
  //     });

  //     res.json(room);
  //   } catch (err) {
  //     res.status(500).send("Server Error");
  //     console.error(err.message);
  //   }
  // });

  //for PrivateRoomMessage
  app.post("/api/room/createPrivateChatroom", verify, async (req, res) => {
    const { roomMembers } = req.body;
    try {
      let room = new Room({
        user: req.user.id,
        roomMembers,
      });

      await room.save();

      let theRoomMembers = [...roomMembers];

      roomMembers.forEach(async (memberDetail, index) => {
        let roomId = room._id;

        try {
          let memberProfile = await Profile.findOne({
            user: memberDetail.user,
          });

          if (index == 0) {
            memberProfile.myPrivateChatRooms.push({
              roomId,
              user: theRoomMembers[1].user,
              name: theRoomMembers[1].name,
            });
          } else {
            memberProfile.myPrivateChatRooms.push({
              roomId,
              user: theRoomMembers[0].user,
              name: theRoomMembers[0].name,
            });
          }

          await memberProfile.save();
        } catch (err) {
          console.error(err.message);
        }
      });

      res.json(room);
    } catch (err) {
      res.status(500).send("Server Error");
      console.error(err.message);
    }
  });

  // app.post("/api/room/saveMessage/:roomId", verify, async (req, res) => {
  //   const { title, description, link } = req.body;
  //   try {
  //     let classroom = await ClassRoom.findOne({
  //       classRoomCode: req.params.classroomId,
  //     });

  //     classroom.fileLinks.push({ title, description, link });

  //     await classroom.save();

  //     res.json(classroom.fileLinks);
  //   } catch (err) {
  //     res.status(500).send("Server Error");
  //     console.error(err.message);
  //   }
  // });

  // app.post(
  //   "/api/classroom/announcement/:classroomId",
  //   verify,
  //   async (req, res) => {
  //     const { title, description } = req.body;
  //     try {
  //       let classroom = await ClassRoom.findOne({
  //         classRoomCode: req.params.classroomId,
  //       });

  //       classroom.announcements.push({ title, description });

  //       await classroom.save();

  //       res.json(classroom.announcements);
  //     } catch (err) {
  //       res.status(500).send("Server Error");
  //       console.error(err.message);
  //     }
  //   }
  // );

  // app.post("/api/classroom/joinclassroom", verify, async (req, res) => {
  //   const { classRoomCode } = req.body;
  //   try {
  //     const student = await StudentUser.findById(req.user.id);

  //     let classroom = await ClassRoom.findOne({
  //       classRoomCode,
  //     });

  //     if (
  //       classroom.students.filter(
  //         (student) => student.user.toString() === req.user.id
  //       ).length > 0
  //     ) {
  //       return res
  //         .status(400)
  //         .json({ msg: "Already student of the classroom" });
  //     }

  //     classroom.students.push({
  //       user: req.user.id,
  //       name: req.user.name,
  //       email: req.user.email,
  //     });

  //     student.classroomcodes.push({ classRoomCode });

  //     await classroom.save();
  //     await student.save();

  //     res.json(classroom);
  //   } catch (err) {
  //     res.status(500).send("Server Error");
  //     console.error(err.message);
  //   }
  // });

  // app.get(
  //   "/api/classroom/student/getmyclassrooms",
  //   verify,
  //   async (req, res) => {
  //     try {
  //       let myallclassrooms = [];
  //       console.log(req.user.id);
  //       let student = await StudentUser.findById(req.user.id);
  //       let classrooms = await ClassRoom.find();
  //       console.log(student);
  //       student.classroomcodes.map((item) => {
  //         let foundedclassroom = classrooms.filter(
  //           (classroomitem) =>
  //             classroomitem.classRoomCode === item.classRoomCode
  //         );
  //         myallclassrooms = [...myallclassrooms, ...foundedclassroom];
  //       });
  //       // let myclassrooms = classrooms

  //       res.json(myallclassrooms);
  //     } catch (err) {
  //       res.status(500).send("Server Error");
  //       console.error(err.message);
  //     }
  //   }
  // );

  // app.get(
  //   "/api/classroom/teacher/getmyclassrooms",
  //   verify,
  //   async (req, res) => {
  //     try {
  //       let teacher = await TeacherUser.findById(req.user.id);
  //       let classrooms = await ClassRoom.find({ user: req.user.id });

  //       res.json(classrooms);
  //     } catch (err) {
  //       res.status(500).send("Server Error");
  //       console.error(err.message);
  //     }
  //   }
  // );
};
