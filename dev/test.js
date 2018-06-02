const Blockchain = require('./blockchain')

const bitcoin = new Blockchain();

bitcoin.createNewBlock(2245, 'o08qg3', '055wrjl2') //随便输入3个参数
bitcoin.createNewBlock(412, 'g346h', '5622hefdf') //随便输入3个参数
bitcoin.createNewBlock(2245, '26gadg8', '24thdsh6') //随便输入3个参数

console.log(bitcoin)
