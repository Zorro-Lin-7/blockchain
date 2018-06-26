const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')  // 导入blockchain.js
const uuid = require('uuid/v1')  // version 1 of this library
const port = process.argv[2]
const rp = require('request-promise')

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
    const newTransaction = req.body
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction)
    res.json({ note: `Transaction will be added in block ${blockIndex}.` })
})


// 1, create a new transaction
// 2, broadcast the new transaction to all the other nodes in our network
app.post('/transaction/broadcast', function(req, res) {
  const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
  bitcoin.addTransactionToPendingTransactions(newTransaction)

  const requestPromises = []
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    // 广播到其他nodes，需要向network 中的其他nodes 的 /transaction endpoint 发送requests
    const requestOptions = {                // 创建一个request 对象，包含以下几项：
      uri: networkNodeUrl + '/transaction', // network node URL
      method: 'POST',                       // request method
      body: newTransaction,                 // body是 新的交易记录
      json: true
    }

    requestPromises.push(rp(requestOptions))//通过循环，push所有requests 到新建的array中，从而能同时执行所有请求
  })

  Promise.all(requestPromises)    // run all of those requests，整个broadcast完成，下面的data来自这些requests
         .then(data => { // 所有requsts 运行完后，then 传入一个函数，接受的参数是'data'，实际这里没用到data参数，函数只是返回res
           res.json({ note: 'Transaction created and broadcast successfully.' })
         })
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
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash)

    const requestPromises = []
    bitcoin.networkNodes.forEach(networkNodeUrl => {
      const requestOptions = {
        uri: networkNodeUrl + '/receive-new-block',
        method: "POST",
        body: { newBlock: newBlock },
        json: true
      }

      requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
           .then(data => {
             const requestOptions = {
               uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
               method: 'POST',
               body: {
                 amount: 12.5,
                 sender: "00",
                 recipient: nodeAddress
               },
               json: true
             }

             return rp(requestOptions)
           })
           .then(data => {
             res.json({  // send the response back to whoever mined this block
               note: "New block mined & broadcast successfully",
               block: newBlock,
           })
    })
})


// inside of this endpoint, we are receiving a new block from a broadcast
// We are expected to add this new block to our block chain.
app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock
    const lastBlock = bitcoin.getLastBlock()
    const correctHash = lastBlock.hash === newBlock.previousBlockHash // broadcost 后，其他node需要验证新区块是否合法，包括hash 和index
    const correctIndex = lastBlock['index'] + 1 === newBlock['index']

    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock)      // 上链
        bitcoin.pendingTransactions = []  // 新区块上链后，清空，因为已经包含着“挖”出来的新区块里了
        res.json({
            note: "New block received and accepted.",
            newBlock: newBlock
            })
    } else {
        res.json({
            note: 'New block rejected.',
            newBlock: newBlock
        })
    }
})


// what this endpoint will do is it will register a node and broadcast that node to the whole network.
// how we're going to do that is
// we are going to pass in the URL of the node we want to register on the rec.body.newNodeUrl.
// we are going to send in the URL of a new node that we want to add to our network.
// hit this endpoint, it is going to register the new node on its own server
// and then it's going to broadcast this new node to all of the other network nodes
app.post('/register-and-broadcast-node', function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  // do some calculations down here and we're going to broadcast it to the entire network.
  // So all the other nodes can add it as well.
  if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    bitcoin.networkNodes.push(newNodeUrl)
  }
// broadcast:
// for every network node inside of our network nodes array
// we are going to want to hit the register node endpoint
  const regNodesPromises = []
  bitcoin.networkNodes.forEach(networkNodeUrl => {
    // 'register-node'
    // to make a request to every single node at this point.
    const requestOptions = {  // define the options that we want to use for each request.
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true
    }

    regNodesPromises.push(rp(requestOptions))
  })

  Promise.all(regNodesPromises)
  .then(data => {
           const bulkRegisterOptions = {
             uri: newNodeUrl + '/register-nodes-bulk',
             method: "POST",
             body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
             json: true
           }

           return rp(bulkRegisterOptions)
         })
  .then(data => {
           res.json({ note: 'New node registered with network successfully.' })
         })
})


// register a node with the network
// when all of the other network nodes receive the new nodes URL
// We just want them to register it.We dont want them to broadcast it.
app.post('/register-node', function(req, res) {
    const newNodeUrl = req.body.newNodeUrl  // 1, define the new node URL, take the new node URL that is sent in the body
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1 // newNodeUrl 是否已存在于 networkNodes
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl
    if (nodeNotAlreadyPresent && notCurrentNode) {
      bitcoin.networkNodes.push(newNodeUrl)   // 2, register this new node URL With the node received this request
    }
      res.json({ note: "New node registered successfully." }) // 3. send back a response
})


// register multiple nodes at once
// whenever we hit this endpoint we are on the new node that's being added to the network.
app.post('/register-nodes-bulk', function(req, res) {
    const allNetworkNodes = req.body.allNetworkNodes
    allNetworkNodes.forEach(networkNodeUrl => {
      // if the node is not already present inside of our network nodes array then we're going to register that node.
      // and if that node is not our current nodes URLs
      // then we want to add this network node URL to our network nodes array.
      const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1
      const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl
      if (nodeNotAlreadyPresent && notCurrentNode) {
        bitcoin.networkNodes.push(networkNodeUrl)
      }
    })

    res.json({ note: 'Bulk registeration successful.' })
})


app.get('/consensus', function(req, res) {
    const requestPromises = []
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        }

        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
           .then(blockchains => { // name 用 blockchains 而不是data，因为GET 到的是由 各node 的 blockchain 组成的数组
               const currentChainLength = bitcoin.chain.length
               let maxChainLength = currentChainLength
               let newLongestChain = null
               let newPendingTransactions = null

               blockchains.forEach(blockchain => {
                    if (blockchain.chain.length > maxChainLength) {
                        maxChainLength = blockchain.chain.length
                        newLongestChain = blockchain.chain
                        newPendingTransactions = blockchain.pendingTransactions
                    }
               })
              // 若 !newLongestChain，即当前Chain最长， 或者存在newLongestChain 但它无效
              // 那么，在当前node 不用替换 blockchain
               if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))) {
                 res.json({
                   note: 'Current chain has not been replaced.',
                   chain: bitcoin.chain
                 })
               }
               else { // if (newLongestChain && bitcoin.chainIsValid(newLongestChain))
                 // replace
                 bitcoin.chain = newLongestChain
                 bitcoin.pendingTransactions = newPendingTransactions
                 res.json({
                   note: 'This chain has been replaced.',
                   chain: bitcoin.chain
                 })
               }

           })
})


// 输入指定的block hash，返回该hash对应的block
app.get('/block/:blockHash', function(req, res) {  // lockalhost:3001/block/EWONGR256E8
    const blockHash = req.params.blockHash  // req.params object 含有该URL 内的数据，即提供access
    const correctBlock = bitcoin.getBlock(blockHash)
    res.json({
      block: correctBlock
    })
})


app.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId
    const transactionData = bitcoin.getTransaction(transactionId)
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    })
})


app.get('/address/:address', function(req, res) {
    const address = req.params.address
    const addressData = bitcoin.getAddressData(address)
    res.json({
        addressData: addressData
    })
})

// 添加一个函数，已观察服务器正常运行ing
app.listen(port, function () {
  console.log(`Listening on port ${port}...`)
})
