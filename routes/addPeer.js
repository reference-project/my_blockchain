// const PeerModel = require('../models/peers')
const Peer = require('../models/peers').Peer
const express = require('express')
const router = express.Router()

// GET /addPeer 向网络中增添新的节点
router.get('/', function (req, res) {
  res.render('addPeer')
})

// POST /signup 节点注册
router.post('/', function (req, res) {
  const ip = req.body.ip
  const port = req.body.port

  console.log(req.body)

  // 校验参数
  try {
    if (!(ip.length >= 1 && ip.length <= 16)) {
      throw new Error('ip输入格式不合法')
    }
    if (!(port.length >= 1 && port.length <= 5)) {
      throw new Error('端口请限制在 1-5 个字符')
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('/addPeer')
  }

  // 待写入数据库的节点信息
  let peer = {
    addr: {
      ip: ip,
      port: port
    },
    state: 2
  }
  // 节点信息写入数据库
  const _peer = new Peer(peer)
  try {
    _peer.save(function (err) {
      if (err) {
        req.flash('error', 'Peer can\'t be saved to database：' + err)
        return res.redirect('/addPeer')
      }
    })
    req.session.peer = peer
    // 写入 flash
    req.flash('success', '网络节点添加成功')
    // 跳转到区块链展示页面
    res.redirect('/blocks')
  } catch (err) {
    req.flash('error', err.message)
    return res.redirect('/addPeer')
  }
})

module.exports = router
