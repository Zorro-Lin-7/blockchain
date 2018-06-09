const sha256 = require('sha256')

// 创建Blockchain Constructor Function
function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
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
    }
    // 添加new transaction 到 pendingTransactions
    // 这里面的交易并非一成不变，它们还未记到区块上，即未执行this.chain.push(newBlock)
    // 当一个新的区块生成时，才会记上去，才不可更改
    // 所以这里的所有new transactions 几乎只是 pending transactions，是还未经验证的
    this.pendingTransactions.push(newTransaction)
    // return the number of the block that this transaction will be added to
    return this.getLastBlock()['index'] + 1
}


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    // change all of these parameters into a single string
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    // create our hash:
    const hash = sha256(dataAsString)
    return hash
}


Blockchain.prototype.prooOfWork = function (previousBlockHash, currentBlockData) {
  let nonce = 0
  let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
  while (hash.substring(0, 4) !== '0000') { // 本例随便假设要找的hash 是4个0开的的'0000ANS0'
    nonce += 1
    hash = this.hashBlock(previousBlockHash, currentBlockData, nonce)
  }

  return nonce
};



module.exports = Blockchain
