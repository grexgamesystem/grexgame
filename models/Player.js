var config = require('../config')
		db = config.db

exports.Player = db.define("player", {
    location_id: Number,
    name: String,
    food_found: Number,
    created_at: Number,
    updated_at: Number
});
