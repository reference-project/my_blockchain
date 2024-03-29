module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/blocks')
  })
  app.use('/blocks', require('./blocks'))
  app.use('/peers', require('./peers'))
  app.use('/api', require('./api'))
  // app.use('/signup', require('./signup'))
  app.use('/addPeer', require('./addPeer'))
  // app.use('/signin', require('./signin'))

  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
}
