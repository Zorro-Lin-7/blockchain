const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();
// 挖矿产生区块
bitcoin.createNewBlock(2245, 'o08qg3', '055wrjl2') //随便输入3个参数
// 生成pending transactions
bitcoin.createNewTransaction(100, 'Tom_Address', 'Jerry_Address')
// 挖矿产生区块，记录之前的pending transactions
bitcoin.createNewBlock(412, 'g346h', '5622hefdf') //随便输入3个参数

bitcoin.createNewTransaction(50, 'Tom_Address', 'Jerry_Address')
bitcoin.createNewTransaction(300, 'Tom_Address', 'Jerry_Address')
bitcoin.createNewTransaction(1000, 'Tom_Address', 'Jerry_Address')
bitcoin.createNewBlock(2245, '26gadg8', '24thdsh6') //随便输入3个参数


console.log(bitcoin)
