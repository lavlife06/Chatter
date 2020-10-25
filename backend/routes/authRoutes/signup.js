const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/keys');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Host = require('../../models/Host');

// @route POST api/signup
// desc   test route
// access Public
module.exports = (app) => {

  app.post('/api/signup/:email/:username', async (req ,res)=>{
    try{
      const {fromHost} = req.body;
      const username = req.params.username;
      const email = req.params.email;
      console.log(req.body, username)
      let user;
      if(fromHost){
        user = await Host.findOne({ username });
      }else{
        user = await User.findOne({ username });
      }

      if(user === null){
        if(fromHost){
          user = await Host.findOne({ email });
        }else{
          user = await User.findOne({ email });
        }
        user.username = username;
        await user.save() 
        return res.json(user)
      }
      if(user){
        return res
        .status(404)
        .json({ errors: [{ msg: 'Username already taken!' }] });
      }else{
        user.username = username;
        await user.save() 
        return res.json(user)
      }
    }catch(e){
      res.status(500).send('Server Error');
      console.error('login error username signup server: ', e.message);
    }
  });

  app.post(
    '/api/signup',
    [
      // We want the info of user according to the given below condition

      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'PLease enter password with >6 letter').isLength({
        min: 6,
      }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
      }
      let { name, email, password } = req.body;

      try {
        let user = await User.findOne({ email });
        // See if user exits
        if (user) {
          return res
            .status(404)
            .json({ errors: [{ msg: 'You Already Have An Account' }] });
        }

        user = new User({
          name,
          email,
          password,
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.username = '';
        // Save data to atlas
        await user.save(); // In atlas data will be saved

        // create jsonwebtoken
        let payload = {
          user: {
            id: user._id,
            name,
            email,
          },
        };

        jwt.sign(
          payload,
          keys.jwtSecret,
          /*{ expiresIn: 3600 },*/ (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
        jwt.sign(
          payload,
          keys.jwtSecret,
          { expiresIn: '40d' },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        res.status(500).send('Server Error');
        console.error('login error server: ', err.message);
      }
    }
  );
};
