module.exports = {
  port: 3000,
  session: {
    secret: 'my-blockchain',
    key: 'my-blockchain',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/my-blockchain',
  peers: {
    list: [{
      addr: {
        ip: '1.2.3.4',
        port: '70001'
      },
      state: 2
    },{
      addr: {
        ip: '2.1.2.3',
        port: '7002',
      },
      state: 2
    }],
    blackList: [],
    options: {
      timeout: 4000
    }
  }
}
