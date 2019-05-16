const mongoose = require('mongoose')
const sha1 = require('sha1')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
})

/**
 * Virtuals 设置original_password,即加密前的密码的virtual值
 */

UserSchema
  .virtual('ori_password')
  .set(function (ori_password) {
    this._ori_password = ori_password
    this.password = sha1(ori_password)
  })
  .get(function () {
    return this._ori_password
  })

UserSchema.path('name').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

UserSchema.path('username').validate(function (username) {
  return username.length
}, 'Username cannot be blank')

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function (email, fn) {
  const User = mongoose.model('User')

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

UserSchema.path('password').validate(function (password) {
  return password.length && this._ori_password.length
}, 'Password cannot be blank')

/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
  if (!this.isNew) return next()

  if (!this.password.length ) {
    next(new Error('Invalid password'))
  } else {
    next()
  }
})

mongoose.model('User', UserSchema)
