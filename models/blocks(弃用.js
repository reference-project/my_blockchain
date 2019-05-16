const mongoose = require('mongoose')
const crypto = require('crypto')
const Schema = mongoose.Schema

const blockSchema = new Schema({
  height: { type: Number, required: true },
  hash: { type: String, required: true },
  previousHash: { type: String, required: true },
  timestamp: { type: Number, required: true },
  data: { type: String, required: true }
})

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

blockSchema.methods = {
  createNextBlock(data) {
    var previousBlock = getLatestBlock()
    var block = {
      height: previousBlock.height + 1,
      timestamp: new Date().getTime() / 1000,
      data: data
    }
    block.hash = encryptHash_withBlock(block)
  }

}

/**
 * models/blocks.js文件
 */

/* blockSchema
  .virtual('ori_password')
  .set(function (ori_password) {
    this._ori_password = ori_password
    this.password = sha1(ori_password)
  })
  .get(function () {
    return this._ori_password
  })

blockSchema.path('name').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

blockSchema.path('username').validate(function (username) {
  return username.length
}, 'Username cannot be blank')

blockSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

blockSchema.path('email').validate(function (email, fn) {
  const User = mongoose.model('User')

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

blockSchema.path('password').validate(function (password) {
  return password.length && this._ori_password.length
}, 'Password cannot be blank')
*/

/**
 * Pre-save hook
 */

/* blockSchema.pre('save', function (next) {
  if (!this.isNew) return next()

  if (!this.password.length ) {
    next(new Error('Invalid password'))
  } else {
    next()
  }
})  */

module.exports = mongoose.model('Block', blockSchema)
