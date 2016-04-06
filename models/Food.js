var config = require('../config')
		db = config.db

exports.Food = db.define("food", {
    location_id: Number,
    food_left: Number,
    lat: Number,
    long: Number,
    created_at: Number,
    updated_at: Number
});