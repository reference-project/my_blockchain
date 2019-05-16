const express = require('express')
const router = express.Router()
const default_config = require('../config/default')
const PeerModel = require('../models/peers')

// 允许跨域访问
router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// GET /peers 展示所有节点
router.get('/', function (req, res, next) {
  PeerModel.initializePeers()
    .then(function () {
      PeerModel.getAll().then((peers) => {
        res.render('peers', {
          peers: peers
        })
      }).catch(next)
    })
    .catch(next)
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
    res.redirect('/blocks')
  }
})

module.exports = router
