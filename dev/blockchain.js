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
  /*
What this hash block method will do is
it will take in a block from our block chain and hash that block
into some fixed length string.
That to us will appear pretty much random.
So in essence we're going to pass some block or some blocks of data into our method
and in return
we will get some fixed length string that looks something like this.
    return '09ab0reg0bt90thqgrdlw32'

How? We're going to use a hashing function called Shaw256
}
*/
    // change all of these parameters into a single string
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData)
    // create our hash:
    const hash = sha256(dataAsString)
    return hash
}


Blockchain.prototype.prooOfWork = function (previousBlockHash, currentBlockData) {
  // => 重复 hashBlock method 直到找到正确的hash 本例假设为'0000OIANSDFUI09N9N0'
  // => 采用currentBlockData，同时也用 previousBlockHash
  // => 连续改变 nonce 值 直到找到正确的 hash
  // => return 该 nonce 值
};

/*
Proof Of Work 是区块链非常安全的原因之一。我们不希望固有区块被篡改，我们需要确保新增到链上的
每个区块都是合法的，里面的数据，如交易数据，都是无误的。否则就可能导致造假、欺诈。所以，
当每创建一个新的block时，我们首先要确保这是一个合法的区块，即通过proof of work 的方式来保证。

a proof of work method 要做的是：
给定 current Block Data 和 previous Block Hash，
然后用它们，以某种方式生成一个特定的 hash ——本例随便假设为 '0000OIANSDFUI09N9N0'.

hash 是通过sha256 生成的，也就是说所有 hash几乎是随机码，无规律可循，
我们如何以current block 来得到这个hash呢？猜。反复试错，直到猜对为止。
也就是说我们要 反复运行 hashBlock method 很多很多次，直到找到'0000OIANSDFUI09N9N0'

更具体的：
1. 运行 hashBlock method，从初始 nonce = 0 开始
2. 如果 生成的 hash 不是'0000OIANSDFUI09N9N0'，取nonce = 1 继续运行 hashBlock Method
3. nonce 值连续递增地运行 hashBlock method 直到找到 '0000OIANSDFUI09N9N0'

POW method 到底如何保证区块链的安全？
生成一个正确的 hash 需要运行 hash block method 无数次，需要极大的算力和电力。如果某人想
回头篡改已生成的区块数据，他需要花费极大成本来得到正确的 hash。这几乎是不可能的，只要这个成本足够大。
另外，hashBlock method 的参数，除了要current Block Data，还要求传入 previous Block hash，
这意味着区块链上的所有区块是相连的，数据是联动的，若某人要篡改或重建某个固有区块数据，那么他就需要一并改动整条链
上的区块，牵一发动全身。
这就是区块链技术的安全性。
*/

module.exports = Blockchain
