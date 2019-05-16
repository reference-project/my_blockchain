const express = require('express')
const router = express.Router()

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

// GET /peers 展示所有节点
router.get('/', function (req, res, next) {
  getPeers()
})

/* router.get('/version', function (req, res, next) {
  getPeers()
} */

// Addr格式{ip: xx, port: xx}
router.get('/:peerAddr', function (req, res, next) {
  const peerAddr = req.params.peerAddr
  getPeers()
}
)
