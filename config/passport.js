const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy
const User = mongoose.model('User')
const passport = require('passport')
const sha1 = require('sha1')

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

const local = new LocalStrategy({
  // 这里email必须是表单提交的字段名，而不是数据库里的。
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
function (req, email, password, done) {
  // 校验参数
  try {
    if (!email.length) {
      throw new Error('请填写邮箱')
    }
    if (!password.length) {
      throw new Error('请填写密码')
    }
  } catch (e) {
    req.flash('error', e.message)
    return done(null,false,req.flash('error', e.message))
  }

  // User.findOne({ 'email': email }, function (err, user) {
  //   if (err) return done(err)
  //   if (!user) {
  //     return done(null, false, { message: 'Unknown user' })
  //   }
  //   if (user.password !== sha1(password)) {
  //     return done(null, false, { message: 'Invalid password' })
  //   }
  //   return done(null, user)
  // })

  User.findOne({ 'email': email }, function (err, user) {
    if (err) return done(err)
    if (!user) {
      req.body.errmessage = 'Unknown user'
      return done(null, false, { message: 'Unknown user' })
    }
    if (user.password !== sha1(password)) {
      req.body.errmessage = 'Invalid password'
      return done(null, false, { message: 'Invalid password' })
    }
    return done(null, user)
  })
}
)

passport.use(local)
