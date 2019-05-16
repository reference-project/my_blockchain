'use strict'

const path = require('path')
const config_lite = require('config-lite')(__dirname)
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const mongoose = require('mongoose')
const pkg = require('./package')
const routes = require('./routes')
const express = require('express')
const helpers = require('view-helpers')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  // 设置 cookie 中保存 session id 的字段名称
  name: config_lite.session.key,
  // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  secret: config_lite.session.secret,
  // 强制更新 session
  resave: true,
  // 设置为 false，强制创建一个 session，即使用户未登录
  saveUninitialized: false,
  cookie: {
    // 过期时间，过期后 cookie 中的 session id 自动删除
    maxAge: config_lite.session.maxAge
  },
  // 将 session 存储到 mongodb
  store: new MongoStore({
    // mongodb 地址
    url: config_lite.mongodb
  })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(helpers(pkg.name))

app.locals.blockchain = {
  title: pkg.name,
  description: pkg.description
}

app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

routes(app)

app.use(function (err, req, res) {
  console.error(err)
  req.flash('error', err.message)
  res.redirect('/blocks')
})

// Mongoose做异步操作时，为了向后兼容，Mongoose 4 默认使用mpromise作为返回值。
// mpromise已被废弃，推荐使用 ES6风格的promises库或者ES6原生的Promise库。
// 下行代码即使用原生Promise库：
mongoose.Promise = global.Promise
mongoose.connect(config_lite.mongodb, {
  // open() is deprecated问题解决，设置useMongoClient属性即可解决
  useMongoClient: true
}).on('error', console.log)
  .once('open', function () {
    app.listen(3000)
    console.log('Express app started on port ' + 3000)
  })

module.exports = app
