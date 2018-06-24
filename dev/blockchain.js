const sha256 = require('sha256')
const currentNodeUrl = process.argv[3]
const uuid = require('uuid/v1')

// 创建Blockchain Constructor Function
function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];

  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  this.createNewBlock(100, '0', '0')  // 任意参数
}

// Create newBlock Method
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash){
  // 首先要做的不是创建一个 newBlock方法，而是创建一个 newBlock object
  // 下面是一个区块链中的区块，用于存放所有的数据
  const newBlock = {
    index: this.chain.length + 1,  // 索引属性，链上第 n 个区块
    timestamp: Date.now(),         // 时间戳，记录区块生成的时间
    // 当创建以新区块，要将所有的新交易记录放进去，使不能更改；
    // 也就是说，这个newBlock里的所有交易应是new transactions or pending transactions，即将落实到区块中:
    transactions: this.pendingTransactions,
    // 接下来是proof，来自 proof of work，
    // 本例中采用数字，某个随机数nonce，也可以使用proof of work method
    // 作用是以合法的方式创建这个新区块：
    nonce: nonce,
    hash: hash,  // hash是从该 newBlock 生成的数据，可理解为当前这个newBlock 映射成的一个字符串
    previousBlockHash: previousBlockHash, // 前一个区块的 hash
  }

  this.pendingTransactions = []  // 生成上面的区块后，清空，从而开始下一个区块的生成
  this.chain.push(newBlock)  // 将生成的区块添加到链上，最后返回生成的newBlock

  return newBlock
}

// 'Get Last Block' Method
Blockchain.prototype.getLastBlock = function() {
  return this.chain[this.chain.length - 1]
}

// 'Create new transaction' method
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    // create a transaction object，所有记住区块链上的交易都长这样子：
    const newTransaction = {
      amount: amount,      // 此次交易的amount
      sender: sender,      // sender's address
      recipient: recipient,
      transactionId: uuid().split('-').join('')
    }

    return newTransaction
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj){
  this.pendingTransactions.push(transactionObj)
  return this.getLastBlock()['index'] + 1
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    // change all of these parameters into a single string
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    // create our hash:
    const hash = sha256(dataAsString)
    return hash
}


Blockchain.prototype.proofOfWork = function (previousBlockHash, currentBlockData) {
  let nonce = 0
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
   // 本例随便假设要找的hash 是4个0开的的'0000ANS0'，即找到它才能创建新区块
  while (hash.substring(0, 4) !== '0000') {
    nonce += 1
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
    // console.log(hash) // 最终全局测试时，最好删除，减轻程序负担，之后我们会做存储
  }

  return nonce
};


// validate if a chain is legitimate or not.
Blockchain.prototype.chainIsValid = function(blockchain) {
    let validChain = true

    for (var i = 1; i < blockchain.length; i++) { 
        const currentBlock = blockchain[i]
        const prevBlock = blockchain[i - 1]
        const blockHash = this.hashBlock(prevBlock['hash'], 
                                         { transaction: currentBlock['transactions'], 
                                           index: currentBlock['index'] 
                                           },
                                           currentBlock['nonce'])
        if (blockHash.substring(0, 4) !== '0000') {
            validChain = false
        }
        if (currentBlock['previousBlockHash'] !== prevBlock['hash']) {
            validChain = false
        }
    }
    // 注意上面循环由 i=1 开始，没有考虑 i = 0 的genesis，因为它不经过POW，所以在for 之外补充验证
    const genesisBlock = blockchain[0]
    const correctNonce = genesisBlock['nonce'] === 100
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === "0"
    const correctHash = genesisBlock['hash'] === '0'
    const correctTransactions = genesisBlock['transactions'].length === 0

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
        validChain = false
    }

    return validChain
};


module.exports = Blockchain
