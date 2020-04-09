// http service for handling web requests

// constants

// api address
const api = 'http://localhost:8000/'

// http methods
const httpGet = 'GET'
const httpPost = 'POST'
const httpDelete = 'DELETE'

// private variables and functions
var queryParams = (params) => {
  const keys = params.keys();
  var queryStr = '?';
  for(const key of keys) {
    queryStr = queryStr.concat(key,'=', params[key])
  }
  return queryStr;
}
// make a full address from an endpoint path
var addr = (path, params) => {
  var url = `${api}${path}`
  if(params) {
    url = url.concat(queryParams(params))
  }
  return url;
}

// turn an object into json
var json = (obj) => obj ? JSON.stringify(obj) : ''

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
var body = (method, data) => ({method, headers:header(), body: json(data)})

var getBody = (method) => ({method, headers:header()})
// service object
const httpService = {
  // GET request
  async get (path, params) { 
    var response = await fetch(addr(path, params), getBody(httpGet));
    if(response.status == 200) { 
      var data = await response.json();
      return data;
    }
    return false;
  },
  // POST request
  post: async (path, data) => fetch(addr(path), body(httpPost, data)),
  // DELETE request
  delete: async (path) => fetch(addr(path), body(httpDelete)),
}

export default httpService
