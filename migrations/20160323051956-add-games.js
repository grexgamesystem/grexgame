var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('games', {
    id: { type: 'int', primaryKey: true },
    game_id: 'int',
    name: 'string',
    lat: 'float(24)',
    long: 'float(24)',
    is_active: 'boolean',
    is_food: 'boolean',
    food_left: 'int',
    created_at: { type: 'timestamp', defaultValue: 'now' },
    updated_at: 'timestamp',
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('games', function(err) {
    if (err) { callback(err); return; }
  },callback);
};
