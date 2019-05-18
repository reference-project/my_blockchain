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
              throw new Error('U区块链为空，添加创世区块失败')
            } else {
              req.flash('success', '区块链为空，自动添加创世区块成功')
              return res.redirect('/blocks')
            }
          }).catch(next)
        // 如果为false，即区块链非空
      } else {
        BlockModel.getAll()
          .then(function (blocks) {
            res.render('blocks', {
              blocks: blocks
            })
          }).catch(next)
      }
    })
})

router.post('/', function (req, res, next) {
  const verification = req.body.verification
  if (verification !== 'yes')
    return BlockModel.getLatestBlock(function (err, pvblock) {
      BlockModel.createNextBlock(pvblock, 'some data').then(function (new_block) {
        if (!new_block) {
          req.flash('error', '创建失败')
        } else {
          req.flash('success', '创建成功')
        }
        return res.redirect('blocks')
      })
    }).catch(next)
  else {
    return BlockModel.verifyLocalChain(function (err, err_msg, result) {
      if (err || (err_msg && result !== false)) {
        req.flash('error', err.msg + err_msg.msg)
      } else if (err_msg && result === false) {
        req.flash('error', err_msg.msg + '不合法区块为：' + err_msg.block)
        console.error('不合法区块为：' + err_msg.block)
      }else if (result === true) {
        req.flash('success', '本地区块链验证成功')
      } else
        req.flash('error', '验证失败：不合法的区块链')
      return res.redirect('blocks')
    })
  }
})

// 获取单个区块页面

router.get('/:blockHash', function (req, res) {
  const blockHash = req.params.blockHash
  BlockModel.getByHash(blockHash).then(function (block) {
    console.log(block)
    if (!block) {
      req.flash('error', '找不到对应hash值的区块')
      return res.redirect('back')
    } else {
      res.render('block', {
        block: block
      })
    }
  }).catch(function (err) {
    req.flash('error', err.msg)
    return res.redirect('back')
  })
})

module.exports = router
