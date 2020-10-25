const express = require('express');
const verify = require('../../verifytokenmw/verify_mv');
// const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const HostProfile = require('../../models/HostProfile');

module.exports = (app) => {

  app.get('/api/profile/host', verify, async (req, res) => {
    try {
      const hostProfile = await HostProfile.findOne({
        user: req.user.id,
      });

      if (!hostProfile) {
        return res
          .status(400)
          .json({ msg: 'There is no profile for this user' });
      }

      res.json(hostProfile);
    } catch (err) {
      console.error('error from host profile: ', err.message);
      res.status(500).send('Server Error');
    }
  });

  app.post('/api/profile/update/host', verify, async (req, res) =>{
    
    let {
      bio
    } = req.body;
  
    let profileFields = {};
    profileFields.bio = bio;
    
    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await HostProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      console.log('updating new host profile....');
      res.json(profile);
    } catch (err) {
      res.status(500).send('Server Error');
      console.error('error from upadteHostProfile API: ',err.message);
    }
  });

  app.post('/api/profile/host', verify, async (req, res) => {
    let {
      bio,
      DOB,
      contact,
      name,
      username,
      // tag,
    } = req.body;
    // build profile object
    console.log('from host profile: ',name)
    let profileFields = {};
    profileFields.email = req.user.email;
    profileFields.user = req.user.id;
    if (name !== undefined) profileFields.name = name;
    profileFields.bio = bio;
    profileFields.username = username;
    
    try {
      // Using upsert option (creates new doc if no match is found):
      let hostProfile = await HostProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      
      res.json(hostProfile);
    } catch (err) {
      res.status(500).send('Server Error');
      console.error(err.message);
    }
  });

  app.get('/api/profile/host-by-id/:user_id', async (req, res) => {
    try {
      const hostProfile = await HostProfile.findOne({
        user: req.params.user_id,
      });
      // .populate('user', ['name']);

      if (!hostProfile) return res.status(400).json({ msg: 'Profile not found' });
  
      res.json(hostProfile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
};
