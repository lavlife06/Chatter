import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import room from "./room";
// import post from './post';

export default combineReducers({
  alert,
  auth,
  profile,
  room,
  // post,
});
