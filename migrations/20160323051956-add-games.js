var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('location', {
    id: { type: 'serial', primaryKey: true, autoIncremet: true },
    name: 'string',
    lat: 'float(24)',
    long: 'float(24)',
    is_active: 'boolean',
    created_at: { type: 'timestamp', defaultValue: 'now' },
    updated_at: 'timestamp',
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('games', function(err) {
    if (err) { callback(err); return; }
  },callback);
};
