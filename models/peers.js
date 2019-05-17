const Peer = require('../lib/mongo').Peer

// 初始化节点列表，从./config/default得到初始化peers
const initialized_peers = require('../config/default').peers.list

// 使用Promise.all可以将多个Promise实例包装成一个新的Promise实例
function initializePeers(cb) {
  return Promise.all(initialized_peers.map(function (peer) {
    return Peer.findOne(peer)
      .then(function (res) {
        if (!res) {
          let _peer = new Peer(peer)
          return _peer.save()
        }
      })
  })).then(function (values) {
    if (values)
      return cb(null, values)
  })
}

function getAll() {
  return Peer.find()
}

/**
 * 使用{ip: xx, port:xx}形式的参数
 */
function getByAddr(addr) {
  return Peer.findOne({ addr: addr })
}

module.exports = {
  Peer: Peer,
  initializePeers: initializePeers,
  getAll: getAll,
  getByAddr: getByAddr
}
