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
var obj = (json) => json ? JSON.parse(json) : {}

// create the fetch() body
var body = (method, data) => ({method, headers: {'Content-Type':'application/json',}, body:json(data)})

// service object
const httpService = {
  // GET request
  async get (path) { 
    var data = await fetch(addr(path), body(httpGet))
    return obj(data)
  },

  // POST request
  post: async (path, data) => fetch(addr(path), body(httpPost, data)),
  // DELETE request
  delete: async (path) => fetch(addr(path), body(httpDelete)),
}

export default httpService
