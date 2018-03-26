var express = require('express')
var path = require('path')
var serveStatic = require('serve-static')

var app = express()
app.use(serveStatic(__dirname))

var port = process.env.PORT
app.listen(port, () => console.log('Server running on port ' + port + '...'))
