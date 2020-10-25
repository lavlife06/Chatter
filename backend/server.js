const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const keys = require('./config/keys')
const connectDB = require('./config/db');
const User = require('./backend/models/User');
const POST = require('./backend/models/Post');
const app = express();

// Implementing cors
app.use(cors());

// connect to database
connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./backend/routes/authRoutes/signup')(app);
require('./backend/routes/authRoutes/login')(app);
require('./backend/routes/authRoutes/googleAuth')(app);
require('./backend/routes/profilepostsRoutes/profile')(app);
require('./backend/routes/profilepostsRoutes/post')(app);
require('./backend/routes/event')(app);
require('./backend/routes/hostProfileRoutes/hostProfile')(app);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('Listen to Port to 3000');
});


// const io = require('socket.io')(server);

// io.on('connection', (socket) => {
//   console.log('Hey i am socket.io and it seems that i am connected');

//   socket.on('changed like', async (data) => {
//     const {token, postId, liked} = data;
//     if(liked){
//       const decoded = jwt.verify(token, keys.jwtSecret);
//       const user = decoded.user;
      
//       try {
//         let post = await POST.findById(postId);
//         // Check if the post has already been liked
//         if (
//           post.likes.filter((like) => like.user.toString() === user.id).length > 0
//         ) {
          
//           post.likes = post.likes.filter((like) => like.user.toString() !== user.id);
//           // Save in our global post
//           await post.save();
      
//           socket.emit('changed like', post.likes);
//         }
//         else{
          
//           post.likes.push({ user: user.id, name: user.name });
          
//           await post.save();

//           socket.emit('changed like', post.likes);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     }
    
//   });
// });
