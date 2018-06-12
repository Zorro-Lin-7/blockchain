const express = require('express')
const app = express()
const bodyParser = require('body-parser')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))


// First endpoint is going to be "/blockchain"
// what this endpoint is going to do is
// when we hit it it is simply going to send back to us our entire blockchain
app.get('/blockchian', function (req, res) {

})


// The next point that we are going to make is going to be post to "/transaction"
// this is the endpoint that we will hit to create a new transaction on our block chain.
app.post('/transaction', function (req, res) {
    console.log(req.body)
    res.send(`The amount of the transaction is ${req.body.amount} bitcoin.`)
})


// the third point that we are going to create will be app that get to "/mine"
// and put our callback function in here with the request and response.
// And what this '/mine' end point will do is
// it will mine a new block for us or create a new block
app.get('/mine', function (req, res) {

})


// 添加一个函数，已观察服务器正常运行ing
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
