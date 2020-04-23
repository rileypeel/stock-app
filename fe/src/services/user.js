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
    if(response.status == 201) {
      return true;
    } else {
      return false;
    }
  },

  async getProfilePic() {
    var response = await httpService.get('api/user/image') 
    if(response) {
      response = 'http://0.0.0.0:8000'.concat(response['profile_pic'])
    }
    return response 
  },
  async postProfilePic(file) {
    var data = new FormData();
    data.append('profile_pic', file);
    var response = await httpService.filePost('api/user/image/', data);
    console.log('filepost')
    return response

  },

  async getUser() {
    var response = await httpService.get('api/user/me');
    return response
  },
  async patchUser(payload) {
    var response = await httpService.patch('api/user/me/', payload)
    return response
  },
  async logout() {
    localStorage.removeItem('token');
  }
 
}

export default userService 