const verify = require("../verifytokenmw/verify_mv");
const User = require("../models/User");
const Profile = require("../models/Profile");

module.exports = (app) => {
    app.get("/api/profile/me", verify, async (req, res) => {
        try {
            const profile = await Profile.findOne({
                user: req.user.id,
            });

            if (!profile) {
                return res
                    .status(400)
                    .json({ msg: "There is no profile for this user" });
            }

            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

    // @route POST /api/profile/me
    // desc   post personal profile
    // access Private
    app.post("/api/profile/me", verify, async (req, res) => {
        // build profile object
        const { socketId } = req.body;

        let profileFields = {};

        profileFields.user = req.user.id;
        profileFields.name = req.user.name;
        profileFields.email = req.user.email;

        if (socketId) profileFields.socketId = socketId;
        profileFields.tag = `@${req.user.name}`;

        try {
            // Using upsert option (creates new doc if no match is found):
            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, upsert: true }
            );
            console.log("updating new profile");
            res.json(profile);
        } catch (err) {
            res.status(500).send("Server Error");
            console.error(err.message);
        }
    });

    // @route GET /api/profile/user/:username
    // desc   get profiles of the searched users
    // access Public
    app.get("/api/profile/user/:username", async (req, res) => {
        try {
            const profiles = await Profile.find({
                name: { $regex: "^" + req.params.username, $options: "i" },
            });
            // .sort({ followers: -1 })
            // .limit(10);
            // This {{followers: -1}} means that users with the highest followers will be shown first
            res.json(profiles);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });
};
