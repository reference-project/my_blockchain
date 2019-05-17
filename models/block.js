const Block = require('../lib/mongo').Block
// const async = require('async')

const genesisBlock = {
  height: 0,
  hash: '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7',
  previousHash: 'none',
  timestamp: 201905142332,
  data: 'the genesisBlock'
}

function initializeChain() {
  let _genesisBlock = new Block(genesisBlock)
  // console.info('info' + _genesisBlock)
  return _genesisBlock.save()
}


/*  var isEmpty = async.series([ Block.findOne(function (err, doc) {
    if (!doc)
      return true
    else return false
  })],function(err, values) */


/* function isEmpty(cb) {
  Block.findOne(function (err, doc) {
    if (err) return cb(err)
    if (!doc)
      return cb(null, true)
    else return cb(null, false)
  })
} */

function getAll() {
  return Block.find()
}

// 使用回调函数传递结果
function getByHash(hash, cb) {
  Block.findOne({ 'hash': hash }, function (err, block) {
    if (err) return cb(err)
    else return cb(null, block)
  })
}

/* crypto作为nodeJS已经稳定下来的模块在整个node中具有举足轻重的地位，
一切app都需要加密解密，那么crypto就是一个提供加密功能的模块。
在这个模块中已经打包了OpenSSL hash, HMAC（哈希信息验证码），
cipher（加密）,decipher（解密）,sign（签名）以及verify（验证）的功能。 */

// 产生新区块的hash值
function encryptHash(height, hash, timestamp, data) {
  return crypto.createHmac('sha256', height + hash + timestamp + data)
}
// 产生新区块的hash值，参数为当前区块(无hash值)
function encryptHash_withBlock(block) {
  return encryptHash(block.height + block.previousHash + block.timestamp + block.data)
}

function createNextBlock(latestBlock, currentData) {
  let previousBlock = latestBlock
  let block = {
    height: previousBlock.height + 1,
    timestamp: new Date().getTime() / 1000,
    data: currentData
  }
  block.hash = encryptHash_withBlock(block)
  let _block = new Block(block)
  return _block.save()
}

// 将方法导出
module.exports = {
  Block: Block,
  // isEmpty: isEmpty,
  getAll: getAll,
  // 若区块链为空，建立创世区块
  initializeChain: initializeChain,
  // 建立新区块
  createNextBlock: createNextBlock,
  getByHash: getByHash
  /* ,
  updateBlockChain: function updateBlockChain(newChain){
  } */
}
