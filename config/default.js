module.exports = {
  port: 3000,
  session: {
    secret: 'my-blockchain',
    key: 'my-blockchain',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/my-blockchain',
  peers: {
    list: [],
    blackList: [],
    options: {
      timeout: 4000
    }
  }
}
