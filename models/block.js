const Block = require('../lib/mongo').Block
const CryptoJS = require("crypto-js")
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
/* function getByHash(hash, cb) {
  Block.findOne({ 'hash': hash }, function (err, block) {
    if (err) return cb(err)
    else return cb(null, block)
  })
} */

// 不用回调，用promise传递结果
function getByHash(hash) {
  return Block.findOne({ 'hash': hash })
}
/* crypto作为nodeJS已经稳定下来的模块在整个node中具有举足轻重的地位，
一切app都需要加密解密，那么crypto就是一个提供加密功能的模块。
在这个模块中已经打包了OpenSSL hash, HMAC（哈希信息验证码），
cipher（加密）,decipher（解密）,sign（签名）以及verify（验证）的功能。 */

// 产生新区块的hash值
function encryptHash(height, hash, timestamp, data) {
  return CryptoJS.SHA256(height + hash + timestamp + data).toString()
}
// 产生新区块的hash值，参数为当前区块(无hash值)
function encryptHash_withBlock(block) {
  return encryptHash(block.height + block.previousHash + block.timestamp + block.data)
}

function getLatestBlock(cb) {
  return Block.find().sort({ height: -1 }).exec(function (err, res) {
    return cb(err, res[0])
  })
}

function createNextBlock(previousBlock, currentData) {
  let block = {
    height: previousBlock.height + 1,
    previousHash: previousBlock.hash,
    timestamp: new Date().getTime() / 1000,
    data: currentData
  }
  block.hash = encryptHash_withBlock(block)
  let _block = new Block(block)
  return _block.save()
}

function verifyChain(blocks, cb) {
  if (blocks) {
    while (blocks.length !== 1) {
      let block = blocks.shift()
      if (block.previousHash !== blocks[0].hash)
        return cb(null, {
          msg: '区块链不合法：无法追溯区块的上一个区块，hash值与前一区块的不匹配',
          block: block
        }, false)
    }
    return cb(null, null, true)
  } else
    return cb(null, { msg: '本地区块链为空，查不到数据' }, null)
}

function verifyLocalChain(cb) {
  getAll().sort({ height: -1 }).then((blocks) => {
    return verifyChain(blocks, cb)
  }).catch(function (err) {
    return cb(err)
  })
}

// 将方法导出
module.exports = {
  Block: Block,
  // isEmpty: isEmpty,
  getAll: getAll,
  // 若区块链为空，建立创世区块
  initializeChain: initializeChain,
  getLatestBlock: getLatestBlock,
  // 建立新区块
  createNextBlock: createNextBlock,
  // 通过哈希值查找区块
  getByHash: getByHash,
  // 验证本地区块链是否合法
  verifyLocalChain: verifyLocalChain,
  // 验证其它区块链是否合法
  verifyChain: verifyChain
  /* ,
  updateBlockChain: function updateBlockChain(newChain){
  } */
}
