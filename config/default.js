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
        ip: '127.0.0.1',
        port: '70001'
      },
      state: 2
    },{
      addr: {
        ip: '2.1.2.3',
        port: '3333'
      },
      state: 2
    },
    {
      addr: {
        ip: '127.0.0.1',
        port: '3001'
      },
      state: 2
    },{
      addr: {
        ip: '127.0.0.1',
        port: '3000',
      },
      state: 2
    }],
    blackList: [],
    options: {
      timeout: 4000
    }
  }
}
