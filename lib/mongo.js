const mongoose = require('mongoose')
const Schema = mongoose.Schema

/*
// User
exports.User = mongolass.model('User', {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true }, // 头像
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true } // 个人简介
})
exports.User.index({ name: 1 }, { unique: true }).exec() // 在name上建立了索引。”1“：表示按照name进行升序，”-1“：表示降序。

exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId, required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  pv: { type: 'number', default: 0 }
})

exports.Post.index({ author: 1, _id: -1 }).exec()// 按创建时间降序查看用户的文章列表
 */
// Block
exports.Block = mongoose.model('Block', new Schema({
  height: { type: Number, required: true },
  hash: { type: String, required: true },
  previousHash: { type: String, required: true },
  timestamp: { type: Number, required: true },
  data: { type: String, required: true }
}))
// exports.Block.index({ postId: 1, _id: 1 }).exec()// 通过文章 id 获取该文章下所有留言，按留言创建时间升序

// Peer
let PeerSchema = new Schema({
  addr: {
    ip: { type: String, required: true },
    port: { type: String, required: true }
  },
  state: { type: String, required: false },
  // sharePort: { type: String, required: false },
})
// 使用virtual属性方便地得到或设置ip+port
PeerSchema.virtual('addr.full').get(function () {
  return this.addr.ip + ':' + this.addr.port
})

PeerSchema.virtual('addr.full').set(function (addr) {
  var split = addr.split(':')
  this.addr.ip = split[0]
  this.addr.port = split[1]
})

exports.Peer = mongoose.model('Peer', PeerSchema)
