var dbm = global.dbm || require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('food', {
    id: { type: 'serial', primaryKey: true, autoIncremet: true },
    location_id: { type: 'int', notNull: true, foreignKey: {
    	name: 'player_has_many_locations',
            table: 'location',
            rules: {
                onDelete: 'CASCADE',
                onUpdate: 'RESTRICT'
            },
            mapping: 'id'
    } },
    name: 'string',
    food_left: 'int',
    lat: 'float(24)',
    long: 'float(24)',
    created_at: { type: 'timestamp', defaultValue: 'now' },
    updated_at: 'timestamp',
  }, callback);
};

exports.down = function(db, callback) {
  callback();
};
