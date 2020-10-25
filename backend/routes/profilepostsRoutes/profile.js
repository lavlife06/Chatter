const express = require('express');
const verify = require('../../verifytokenmw/verify_mv');
// const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

module.exports = (app) => {
  // Note:--
  // req.user.id comes from the token

  app.get('/api/profile/me', verify, async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      });

      if (!profile) {
        return res
          .status(400)
          .json({ msg: 'There is no profile for this user' });
      }

      res.json(profile);
    } catch (err) {
      console.error('error from profile: ', err.message);
      res.status(500).send('Server Error');
    }
  });

  app.post('/api/profile/update/me', verify, async (req, res) =>{
    
    let {
      bio
    } = req.body;
  
    let profileFields = {};
    profileFields.bio = bio;
    
    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      console.log('updating new profile....');
      res.json(profile);
    } catch (err) {
      res.status(500).send('Server Error');
      console.error('error from upadteProfile API: ',err.message);
    }
  });

  app.post('/api/profile/me', verify, async (req, res) => {
    let {
      bio,
      gameinterest,
      instagram,
      DOB,
      // followers,
      // following,
      contact,
      // eventname,
      // eventdescription,
      // location,
      // youtube,
      // twitter,
      // facebook,
      // platformname,
      // link,
      name,
      username,
      // tag,
    } = req.body;
    // build profile object
    console.log('createProfile: ',req.user.email)
    let profileFields = {};
    profileFields.email = req.user.email;
    profileFields.user = req.user.id;
    if (name) profileFields.name = name;

    // profileFields.achievements = [];
    // profileFields.otherlinks = [];
    profileFields.bio = bio;
    profileFields.username = username;
    // profileFields.followers = followers;
    // profileFields.following = following;
    // if (location) profileFields.location = location;
    // if (eventname || eventdescription)
    //   profileFields.achievements.push({ eventname, eventdescription });
    // if (platformname && link)
    //   profileFields.otherlinks.push({ platformname, link });
    if (gameinterest) {
      let arr = gameinterest.split(',').map((str) => {
        return str.trim();
      });
      profileFields.gameinterest = arr;
    }

    profileFields.social = {};
    // if (twitter) profileFields.social.twitter = twitter;
    // if (youtube) profileFields.social.youtube = youtube;
    // if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      
      res.json(profile);
    } catch (err) {
      res.status(500).send('Server Error');
      console.error(err.message);
    }
  });

  // @route GET /api/profile/user/:username
  // desc   get profiles of the searched users
  // access Public
  // This is not for specific user because it returns multiple users almost matching with same name
  // This will be helpfull when someone searches for another player or organization
  app.get('/api/profile/userbyname/:username', async (req, res) => {
    try {
      const profile = await Profile.findOne({
        username: req.params.username
      })
      // This {{followers: -1}} means that users with the highest followers will be shown first

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  app.get('/api/profiles/usersbyname/:username', async (req, res) => {
    try {
      const profiles = await Profile.find({
        username: { $regex: '^' + req.params.username, $options: 'i' },
      })
        .sort({ followers: -1 })
        .limit(10);
      // This {{followers: -1}} means that users with the highest followers will be shown first
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route    GET /api/profile/user/:user_id
  // @desc     Get profile by user ID
  // @access   Public
  // This is for specific user searched
  app.get('/api/profile/userbyid/:user_id', async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.params.user_id,
      });
      // .populate('user', ['name']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route    PUT /api/profile/followhandle/:id
  // @desc     Follow a user
  // @access   Private
  //  This is if user want to follow someone
  app.put('/api/profile/followhandle/:id', verify, async (req, res) => {
    try {
      const profile = await Profile.findById(req.params.id); // This is the profile of the person
      // to whom we are going to follow

      // This is our profile that we are gonna update on click to follow
      const myprofile = await Profile.findOne({ user: req.user.id });

      // Check if the profile has already been followed
      if (
        profile.followers.filter(
          (follow) => follow.user.toString() === req.user.id
        ).length > 0
        // Here follow.user.toString === me in the list of followers of the profile of the guy i am
        // looking to follow
      ) {
        return res.status(400).json({ msg: 'You are already following' });
      }

      // This will push into my list of following
      profile.followers.push({ user: req.user.id });

      // This will push into my list of following
      myprofile.following.push({ user: profile.user });

      await profile.save();

      await myprofile.save();

      res.json({
        followerinfo: profile.followers,
        followinginfo: myprofile.following,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route    PUT /api/profile/unfollowhandle/:id
  // @desc     Unfollow a user
  // @access   Private
  //  This is if user want to unfollow someone
  app.put('/api/profile/unfollowhandle/:id', verify, async (req, res) => {
    try {
      const profile = await Profile.findById(req.params.id); // This is the profile of the person
      // to whom we are going to unfollow

      // This is our profile that we are gonna update on click to unfollow
      const myprofile = await Profile.findOne({ user: req.user.id });

      // Check if the profile has already been followed
      if (
        profile.followers.filter(
          (unfollow) => unfollow.user.toString() === req.user.id
        ).length === 0
        // Here unfollow.user.toString = me in the list of followers of the profile of the guy i am
        // looking to unfollow
      ) {
        return res
          .status(400)
          .json({ msg: "You can't unfollow to whom you don't follow" });
      }

      // Get remove index
      const removefollowersIndex = profile.followers
        .map((unfollow) => unfollow.user.toString())
        .indexOf(req.user.id);

      profile.followers.splice(removefollowersIndex, 1);

      await profile.save();

      // Get remove index
      const removefollowingIndex = myprofile.following
        .map((unfollow) => unfollow.user.toString())
        .indexOf(profile.user.toString());

      myprofile.following.splice(removefollowingIndex, 1);

      await myprofile.save();

      res.json({
        followerinfo: profile.followers,
        followinginfo: myprofile.following,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route    DELETE /api/profile
  // @desc     Delete profile, user & posts
  // @access   Private
  // app.delete('/api/profile/', verify, async (req, res) => {
  //   try {
  //     // Remove profile
  //     await Profile.findOneAndRemove({ user: req.user.id });

  //     // Remove user
  //     await User.findOneAndRemove({ _id: req.user.id });

  //     res.json({ msg: 'User deleted' });
  //   } catch (err) {
  //     console.error(err.message);
  //     res.status(500).send('Server Error');
  //   }
  // });
};
