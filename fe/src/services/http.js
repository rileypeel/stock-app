// http service for handling web requests

// constants

// api address
const api = 'http://0.0.0.0:8000/'

// http methods
const httpGet = 'GET'
const httpPost = 'POST'
const httpDelete = 'DELETE'

// private variables and functions

// make a full address from an endpoint path
var addr = (path) => `${api}${path}`

// turn an object into json
var json = (obj) => obj ? JSON.stringify(obj) : ''

// turn JSON into a JS object
//var obj = (json) => json ? JSON.parse(json) : {}

//create request header object with auth token
var header = () => {
  var header = new Headers({'Content-Type':'application/json'});
  var token = localStorage.getItem('token');
  if(token != null) {
    header.append('Authorization', ''.concat('Token ', token));
    
  }
  return header;
}
// create the fetch() body
var body = (method, data) => ({method, headers:header(), body:json(data)})

var getbody = (method) => ({method, headers:header()})
// service object
const httpService = {
  // GET request
  async get (path) { 
    var response = await fetch(addr(path), getbody(httpGet));
    if(response.status == 200) { 
      var data = await response.json();
      return data;
    }
  },

  // POST request
  post: async (path, data) => fetch(addr(path), body(httpPost, data)),
  // DELETE request
  delete: async (path) => fetch(addr(path), body(httpDelete)),
}

export default httpService
