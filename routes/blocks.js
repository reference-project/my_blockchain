const express = require('express')
const router = express.Router()
const BlockModel = require('../models/block')
const Blocks = require('../models/block').Block

// GET /blocks 展示区块链目前状况
router.get('/', function (req, res, next) {
  Blocks.findOne()
    // 如果为空，bool为true
    .then(function (doc) {
      if (!doc) {
        BlockModel.initializeChain()
          .then(function (genesisBlock) {
            if (!genesisBlock) {
              req.flash('error', 'U区块链为空，添加创世区块失败')
            } else {
              req.flash('success', '区块链为空，自动添加创世区块成功')
              res.render('blocks', {
                blocks: [],
                success: req.flash('success')
              })
            }
          }).catch(next)
        // 如果为false，即区块链非空
      } else {
        BlockModel.getAll()
          .then(function (blocks) {
            // console.log('blocks:' + blocks)
            res.render('blocks', {
              blocks: blocks
            })
          }).catch(next)
      }
    })
  // 通过自定义回调函数拿到区块链目前是否为空的bool值
  /* Block.isEmpty(function (err, bool) {
    if (err) next(err)
    // 如果为空，bool为true
    else if (bool) {
      Block.initializeChain()
        .then(function (genesisBlock) {
          if (!genesisBlock) {
            req.flash('error', 'U区块链为空，添加创世区块错误' + err)
          } else {
            req.flash('success', '区块链为空，自动添加创世区块成功')
            res.render('blocks', {
              blocks: [],
              success: req.flash('success')
            })
          }
        }).catch(next)
      // 如果为false，即区块链非空
    } else {
      Block.getAllBlocks()
        .then(function (blocks) {
          // console.log('blocks:' + blocks)
          res.render('blocks', {
            blocks: blocks
          })
        }).catch(next)
    }
  }) */
})

// 获取单个区块页面
router.get('/:blockHash', function (req, res) {
  const blockHash = req.params.blockHash
  BlockModel.getByHash(blockHash, function (err, block) {
    if (err) {
      req.flash('err', err)
      req.redirect('/blocks')
    } else {
      res.render('block', {
        block: block
      })
    }
  })
  /* BlockModel.findOne({ 'hash': blockHash }, function (err, block) {
    if (err) {
      req.flash('err', err)
    } else {
      res.render('block', {
        block: block
      })
    }
  })
    .catch(next) */
})

module.exports = router
