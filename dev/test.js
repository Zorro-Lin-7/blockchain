const Blockchain = require('./blockchain') // import our blockchain data structure

const bitcoin = new Blockchain()    // create a new instance of our blockchain

const bc1 = {
"chain": [
{
"index": 1,
"timestamp": 1529809537845,
"transactions": [],
"nonce": 100,
"hash": "0",
"previousBlockHash": "0"
},
{
"index": 2,
"timestamp": 1529809680043,
"transactions": [],
"nonce": 18140,
"hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
"previousBlockHash": "0"
},
{
"index": 3,
"timestamp": 1529809849932,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "78470650775b11e8be002948a1356fe5",
"transactionId": "cd0e5d00775b11e8be002948a1356fe5"
},
{
"amount": 200,
"sender": "NDGEWOG23OH2455ER",
"recipient": "IDWELNG235EQWEGNO2105050887",
"transactionId": "0d587e40775c11e8be002948a1356fe5"
},
{
"amount": 100,
"sender": "NDGEWOG23OH2455ER",
"recipient": "IDWELNG235EQWEGNO2105050887",
"transactionId": "1a81a240775c11e8be002948a1356fe5"
},
{
"amount": 50,
"sender": "NDGEWOG23OH2455ER",
"recipient": "IDWELNG235EQWEGNO2105050887",
"transactionId": "228a36a0775c11e8be002948a1356fe5"
}
],
"nonce": 52661,
"hash": "00001e2ee6dad212c56059756e01c89b3f1921f7cdb887a1bbdbb54ef6b11357",
"previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
},
{
"index": 4,
"timestamp": 1529810232721,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "78470650775b11e8be002948a1356fe5",
"transactionId": "324c2df0775c11e8be002948a1356fe5"
},
{
"amount": 10,
"sender": "NDGEWOG23OH2455ER",
"recipient": "IDWELNG235EQWEGNO2105050887",
"transactionId": "facd8670775c11e8be002948a1356fe5"
},
{
"amount": 20,
"sender": "NDGEWOG23OH2455ER",
"recipient": "IDWELNG235EQWEGNO2105050887",
"transactionId": "fd944790775c11e8be002948a1356fe5"
}
],
"nonce": 103712,
"hash": "0000be026c3e27c0abf86783b7dbb7713e589fcef7b80b802592842e8b59774f",
"previousBlockHash": "00001e2ee6dad212c56059756e01c89b3f1921f7cdb887a1bbdbb54ef6b11357"
},
{
"index": 5,
"timestamp": 1529810314961,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "78470650775b11e8be002948a1356fe5",
"transactionId": "16757360775d11e8be002948a1356fe5"
}
],
"nonce": 308836,
"hash": "0000f8075bf82480145aae82ebe787f91127524105077fdea4ee10fcec210559",
"previousBlockHash": "0000be026c3e27c0abf86783b7dbb7713e589fcef7b80b802592842e8b59774f"
},
{
"index": 6,
"timestamp": 1529810317679,
"transactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "78470650775b11e8be002948a1356fe5",
"transactionId": "477a2050775d11e8be002948a1356fe5"
}
],
"nonce": 55539,
"hash": "0000f1adb4f0ecb38c2af1240eab34da681abe44c2baf575378f99eb13740a7c",
"previousBlockHash": "0000f8075bf82480145aae82ebe787f91127524105077fdea4ee10fcec210559"
}
],
"pendingTransactions": [
{
"amount": 12.5,
"sender": "00",
"recipient": "78470650775b11e8be002948a1356fe5",
"transactionId": "4918b520775d11e8be002948a1356fe5"
}
],
"currentNodeUrl": "http://localhost:3001",
"networkNodes": []
}


console.log('VALID: ', bitcoin.chainIsValid(bc1.chain))