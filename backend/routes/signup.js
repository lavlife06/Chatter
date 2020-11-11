const express = require("express");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/User");

// @route POST api/signup
// desc   test route
// access Public
module.exports = (app) => {
  app.post(
    "/api/signup",
    // We want the info of user accordinf to the given below condition
    async (req, res) => {
      let { name, email, password } = req.body;

      // Clear the spce between user firstname and lastname
      // name = name.trim().split(" ").join("");

      try {
        // let user = await User.findOne({ email: email })
        //                  ||
        let user = await User.findOne({ email });

        // See if user exits
        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "User already exits" }] });
        }

        // Create tag
        let tag = `@${name}`;

        // Creating user instance
        user = new User({
          name,
          email,
          password,
          tag,
        });

        await user.save(); // In atlas data will be saved

        // Return jsonwebtokens
        let payload = {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            tag: user.tag,
          },
        };

        jwt.sign(
          payload,
          keys.jwtSecret,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.header("x-auth-token").json({ token });
          }
        );
      } catch (err) {
        res.status(500).send("Server Error");
        console.error(err.message);
      }
    }
  );
};
