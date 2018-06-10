var express = require('express')
//creating an app with this app we can handle different endpoints or different routes
var app = express()

app.get('/', function (req, res) {  //we have a "get" endpoint which is just "/".
  res.send('Hello JavaScript Code')  // with this endpoint we are sending back the response of hello world.
})

app.listen(3000)  // this whole server is listening on port 3000.
