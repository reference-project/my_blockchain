const mongoose = require('mongoose')
require('../models/users')
const User = mongoose.model('User')

const express = require('express')
const router = express.Router()

// GET /signup 注册页
router.get('/', function (req, res) {
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', function (req, res) {
  const name = req.body.fullName
  const username = req.body.name
  const email = req.body.email
  let password = req.body.password

  console.log(req.body)

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('姓名字数过多')
    }
    if (!(username.length >= 1 && username.length <= 10)) {
      throw new Error('用户名请限制在 1-10 个字符')
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符')
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    req.flash('error', e.message)
    return res.redirect('/signup')
  }

  // 待写入数据库的用户信息
  let user = {
    name: name,
    password: password,
    username: username,
    email: email
  }
  // 用户信息写入数据库
  const userInMonDb = new User(user)
  try {
    userInMonDb.ori_password = password
    console.log(userInMonDb)
    userInMonDb.save()
    userInMonDb.save(function (err) {
      if (err) {
        req.flash('error', 'User can\'t be saved to database：' + err)
        return res.redirect('/signup')
      }
    })
    req.session.user = user
    // 写入 flash
    req.flash('success', '注册成功')
    // 跳转到首页
    res.redirect('/blocks')
  } catch (err) {
    req.flash('error', err.message)
    return res.redirect('/signup')
  }
})

module.exports = router
