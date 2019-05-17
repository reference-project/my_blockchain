const express = require('express')
const router = express.Router()
const default_config = require('../config/default')
const PeerModel = require('../models/peers')
const async = require('async')

// 允许跨域访问（允许任何客户端调用：设置了跨域请求，Access-Control-Allow-Origin设置为*，所以任何IP和端口的节点都可以访问和被访问。）
router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// GET /peers 展示所有节点 并循环更新
router.get('/', function (req, res) {
  async.series({
    intialize: function (cb) {
      PeerModel.initializePeers(cb)
    },
    showAll: function (cb) {
      try {
        PeerModel.getAll().then((peers) => {
          res.render('peers', {
            peers: peers
          })
        })
      } catch (err) {
        console.error(err)
        cb(err)
      }
      // },
      // updateRegularly: function () {
      //   console.log('updateRegularly')
      //   setImmediate(function nextUpdatePeerList() {
      //     /* updatePeerList(function (err) {
      //       setTimeout(nextUpdatePeerList, 60 * 1000)
      //     }) */
      //     async.retry(20, function(cb){

      //     })
      //   })

      //   setImmediate(function nextBanManager() {
      //     banManager(function (err) {
      //       err && library.logger.error('banManager timer', err);
      //       setTimeout(nextBanManager, 65 * 1000)
      //     })
      //   })
      //   //res.render('peers')
    }
  }, function (err) {
    req.flash('err', err)
    res.redirect('/peers')
  })
})

/* router.get('/version', function (req, res, next) {
  getPeers()
} */

// Addr格式{"ip:port: x.x.x.x:xx}
router.get('/:peerAddr', function (req, res) {
  let peerAddr = req.params.peerAddr
  let split = peerAddr.split(':')
  let addr = {
    ip: split.shift(),
    port: split.shift() || default_config.port
  }
  try {
    PeerModel.getByAddr(addr).then((peer) => {
      res.render('peer', {
        peer: peer
      })
    })
  } catch (err) {
    req.flash('err', err)
    res.redirect('/peers')
  }
})

module.exports = router
