const express = require('express')
const router = express.Router()
const request = require('request')
const default_config = require('../config/default')
const PeerModel = require('../models/peers')
const Peer = require('../models/peers').Peer
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
        return cb()
      } catch (err) {
        console.error(err)
        return cb(err)
      }
    },
    updateRegularly: function (cb) {
      try {
        setImmediate(function nextUpdatePeerList() {
          // async.retry: 执行1次此task，一旦取到值就返回，否则说明数据库节点列表为空
          async.retry(1, function (cb) {
            // Model.aggregate().sample()可获取一个随机节点
            Peer.aggregate().sample(1).then((peers) => {
              let peer = peers[0]
              // 访问随机节点来更新不活跃的结点。
              let _req = {
                url: 'http://' + peer.addr.ip + ':' + peer.addr.port + '/api/peers',
                method: 'GET',
                json: true,
                headers: {
                  'content-type': 'application/json',
                },
                timeout: 4000
              }
              request(_req, function (err, response) {
                let statusCode = response ? response.statusCode : 'unknown'
                if (err || statusCode !== 200) {
                  console.error('\nurl: ' + _req.url + '\n'
                    + 'err: ' + err + '\n'
                    + 'statusCode: ' + statusCode)
                  if (peer) {
                    if (err && (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT' || err.code === 'ECONNREFUSED')) {
                      console.error('errCode: ' + err.code)

                      Peer.deleteOne(peer, function (err) {
                        if (!err) {
                          console.log('Removing peer ' + _req.method + ' ' + _req.url)
                        }
                      })
                    }
                  }
                }
                cb && cb(err || ('request status code' + statusCode))
                setTimeout(nextUpdatePeerList, 10 * 1000)
              })
            })
          })
        })
      } catch (err) {
        console.error(+ err)
        return cb(err)
      }
    }

    // setImmediate(function nextBanManager() {
    //   banManager(function (err) {
    //     err && library.logger.error('banManager timer', err);
    //     setTimeout(nextBanManager, 65 * 1000)
    //   })
    // })
    // res.render('peers')

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
