// 12.Testing hashBlock method
const Blockchain = require('./blockchain') // import our blockchain data structure
const bitcoin = new Blockchain()    // create a new instance of our blockchain

// Blockchain 需要3个参数：
const previousBlockHash = 'SONE4ERBO30B4NGN2N4G'
const currentBlockData = [// currentBlockData is an array of three transactions
  {
    amount: 10,
    // sender: 'RONBROE2NB20980EF',
    sender: 'RONBROE2NB20980EA', // change a letter, completely change the hash
    recipient: 'FN64EBN24B04H2RF',
  },
  {
    amount: 30,
    sender: 'Z3I2TGB0A40HB',
    recipient: 'NB0G2BVVQ1FGH6',
  },
  {
    amount: 200,
    sender: '20B0NGHQ0J2GRPFJNRFAA',
    recipient: '2TG0J5BQ2GJB046',
  },
]
const nonce = 100

console.log(bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce))
