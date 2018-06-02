// 创建Blockchain Constructor Function
function Blockchain() {
  this.chain = [];
  this.newTransactions = [];
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
    transactions: this.newTransactions,
    // 接下来是proof，来自 proof of work，
    // 本例中采用数字，某个随机数nonce，也可以使用proof of work method
    // 作用是以合法的方式创建这个新区块：
    nonce: nonce,
    hash: hash,  // hash是从该 newBlock 生成的数据，可理解为当前这个newBlock 映射成的一个字符串
    previousBlockHash: previousBlockHash, // 前一个区块的 hash
  }

  this.newTransactions = []  // 生成上面的区块后，清空，从而开始下一个区块的生成
  this.chain.push(newBlock)  // 将生成的区块添加到链上，最后返回生成的newBlock

  return newBlock
}


module.exports = Blockchain
