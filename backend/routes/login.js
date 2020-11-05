const express = require("express");
const verify = require("../verifytokenmw/verify_mv");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/User");

module.exports = (app) => {
  app.get("/api/login", verify, async (req, res) => {
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
    try {
      // let user = await User.findOne({ email: email })
      //                  ||
      let user = await User.findOne({ email });

      // See if user exits
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Return jsonwebtokens
      let payload = {
        user: {
          id: user._id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.header("x-auth-token", token).json({ token });
        }
      );
    } catch (err) {
      res.status(500).send("Server Error");
      console.error(err.message);
    }
  });
};
