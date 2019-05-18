const express = require('express')
const router = express.Router()
const PeerModel = require('../models/peers')

// http://ip:port/api/peers
router.get('/peers', function (req, res) {
  PeerModel.getAll().then(function (peers) {
    res.end(JSON.stringify(peers))
  })
})

module.exports = router
