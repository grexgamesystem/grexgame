var pg = require('pg');

var dbHost = process.env.DB_HOST || 'localhost'
var dbName = process.env.DB_NAME || 'grex'
var dbUser = process.env.DB_USER || 'root'
var dbPass = process.env.DB_PASSWORD || 'root'

var conString = "postgres://"+dbUser+":"+dbPass+"@"+dbHost+":5432/"+dbName;

pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
    //call `done()` to release the client back to the pool
    done();

    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].number);
    //output: 1
  });
});