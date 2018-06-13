const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')  // 导入blockchain.js
const uuid = require('uuid/v1')  // version 1 of this library

const nodeAddress = uuid().split('-').join('') // node本身的地址，uuid得到的string有很多'-'，修改一下

const bitcoin = new Blockchain()  // 创建实例

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))


// First endpoint is going to be "/blockchain"
// what this endpoint is going to do is
// when we hit it it is simply going to send back to us our entire blockchain
app.get('/blockchain', function (req, res) {
    res.send(bitcoin)  // 返回的是 Genesis block
})


// The next point that we are going to make is going to be post to "/transaction"
// this is the endpoint that we will hit to create a new transaction on our block chain.
app.post('/transaction', function (req, res) {
    console.log(req.body)
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    res.json({ note: `Transaction will be added in block ${blockIndex}.` })
    // 任何人每次调用'/transaction' 即是他发送一个request，将要发送的所有交易数据放在里面的body里
    // 且 .createNewBlock 方法会 return block number，我们将其存到变量 blockIndex
    // 同时将其作为一条 note 发送回去
})


// the third point that we are going to create will be app that get to "/mine"
// and put our callback function in here with the request and response.
// And what this '/mine' end point will do is
// it will mine a new block for us or create a new block
app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock()
    const previousBlockHash = lastBlock['hash']
    const currentBlockData = {
      transactions: bitcoin.pendingTransactions,
      index:lastBlock['index'] + 1
      // 你也可以添加其他信息，目前足够了
    }
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce)

    bitcoin.createNewTransaction(12.5, '00', nodeAddress) // 最后一步：每当某人“挖出”一个新区块，就奖励他比特币，'00'作统一的颁奖sender

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash)
    
    res.json({  // send the response back to whoever mined this block
      note: "New block mined successfully",
      block: newBlock,
    })
})


// 添加一个函数，已观察服务器正常运行ing
app.listen(3000, function () {
  console.log('Listening on port 3000...')
})
