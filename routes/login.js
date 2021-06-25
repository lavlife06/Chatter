const express = require("express");
const verify = require("../verifytokenmw/verify_mv");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/User");
const Profile = require("../models/Profile");

module.exports = (app) => {
    app.get("/api/login", async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

    app.post("/api/login", async (req, res) => {
        let { email, password } = req.body;
        console.log(req.body);
        try {
            // let user = await User.findOne({ email: email })
            //                  ||
            let user = await User.findOne({ email });
            let profile = await Profile.findOne({ email });

            // See if user exits
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid credentials" }] });
            }

            if (!profile) {
                return res.status(400).json({
                    errors: [
                        { msg: "Something went wrong, please try again " },
                    ],
                });
            }

            if (password !== user.password) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Invalid credentials" }] });
            }

            // Return jsonwebtokens
            let payload = {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                socketid: profile.socketId || null,
            };

            jwt.sign(payload, keys.jwtSecret, (err, token) => {
                if (err) throw err;
                res.header("x-auth-token", token).json({ token });
            });
        } catch (err) {
            res.status(500).send("Server Error");
            console.error(err.message);
        }
    });
};
