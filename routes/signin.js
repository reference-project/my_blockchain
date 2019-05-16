const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/passport')

// GET /signin 登录页
router.get('/', function (req, res) {
  res.render('signin')
})

// POST /signin 用户登录
router.post('/', passport.authenticate('local',
  {
    successRedirect: '/posts',
    failureRedirect: 'back',
    failureFlash: true
  })
)

router.post('/test', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) { return res.status(401).send(req.body.errmessage) }
    req.logIn(user, function(err) {
      if (err) { return next(err) }
      return res.redirect('/users/' + user.username)
    })
  })(req, res, next)
})

// router.post('/test', passport.authenticate('local',{ session: false }), function(req, res) {

//   res.json(req.body)


//   // res.json({ hello: 'hello' })
// })


//   }), function (req, res, next) {

//   // UserModel.getUserByName(name)
//   //   .then(function (user) {
//   //     if (!user) {
//   //       req.flash('error', '用户不存在')
//   //       return res.redirect('back')
//   //     }
//   //     // 检查密码是否匹配
//   //     if (sha1(password) !== user.password) {
//   //       req.flash('error', '用户名或密码错误')
//   //       return res.redirect('back')
//   //     }
//   //     req.flash('success', '登录成功')
//   //     // 用户信息写入 session
//   //     delete user.password
//   //     req.session.user = user
//   //     // 跳转到主页
//   //     res.redirect('/posts')
//   //   })
//   //   .catch(next)
// })

module.exports = router
