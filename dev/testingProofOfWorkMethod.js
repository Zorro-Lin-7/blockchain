// 15.Testing proofOfWof method
const Blockchain = require('./blockchain')
const bitcoin = new Blockchain()

const previousBlockHash = '0000SENEO'
const currentBlockData = [
  {
    amount: 10,
    sender: 'OUO4G2BV40',
    recipient: 'DNO24424NB',
  },
  {
    amount: 30,
    sender: 'XFN2424NVO2',
    recipient: 'F90S24GGH',
  },
  {
    amount: 200,
    sender: 'N45H2S0THH35',
    recipient: 'H3MEWAW2LP',
  }
]

console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockData))
// 返回结果为 25171，表示proofOfWork method 找到一个以‘0000’开头的hash 迭代了25171次
