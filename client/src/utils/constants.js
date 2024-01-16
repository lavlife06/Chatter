export const ApiServerHost = process.env.REACT_APP_API_ENDPOINT;

export const ApiEndPoints = {
  getMyRooms: "api/room/myRooms",
  register: "api/signup",
  login: "api/login",
  getCurrentProfile: "api/profile/me",
  getProfiles: (username) => `api/profile/user/${username}`,
  updateProfile: "api/profile/me"
};