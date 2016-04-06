var orm = require('orm');

var dbHost = process.env.DB_HOST || 'localhost'
var dbName = process.env.DB_NAME || 'grex'
var dbUser = process.env.DB_USER || 'root'
var dbPass = process.env.DB_PASSWORD || 'root'

var conString = process.env.DATABASE_URL ? process.env.DATABASE_URL : "postgres://"+dbUser+":"+dbPass+"@"+dbHost+":5432/"+dbName;

exports.db = orm.connect(conString, function (err, db) {
  if (err) throw err;
  return db
})


