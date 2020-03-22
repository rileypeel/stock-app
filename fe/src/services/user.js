// service for handling user auth and information

// constants
import httpService from '../services/http.js';
// private variables and functions

// service object
const userService = {
  async login(loginDetails) {
    var response = await httpService.post('api/user/token/', loginDetails);
    console.log(response.status);
    if(response.status == 200) {
      var data = await response.json();
      localStorage.setItem('token', data['token']);
      return true;
    }
    return false;
  },
  async newUser(userDetails) {
    var response = await httpService.post('api/user/create/', userDetails)
    if(response.status == 201){
      return true;
    } else {
      return false;
    }
  },

}

export default userService 