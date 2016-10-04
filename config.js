var orm = require('orm');

var dbHost = process.env.GREX_DB_HOST || 'localhost'
var dbName = process.env.GREX_DB_NAME || 'grex'
var dbUser = process.env.GREX_DB_USER || 'root'
var dbPass = process.env.GREX_DB_PASSWORD || 'root'

var conString = process.env.DATABASE_URL ? process.env.DATABASE_URL : "mysql://"+dbUser+":"+dbPass+"@"+dbHost+":3306/"+dbName;

exports.db = orm.connect(conString, function (err, db) {
  if (err) throw err;
  return db
})
