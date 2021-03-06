var config = require('../config'),
		Player = require('./Player').Player,
		Food = require('./Food').Food,
		db = config.db,
		orm = require('orm');

var Location = db.define("location", {
    name: String,
    lat: Number,
    long: Number,
    is_active: Boolean,
    game_type: Number,
    created_at: Number,
    updated_at: Number
});

//this is actually a controller TODO move to controllers
exports.shapeCalculation = function(params, gamesResult) {
	Player.get(params.player, function(err, player) {
		// console.log(item);
		player.lat = params.lat;
		player.long = params.long;
		player.save()
	})

	Player.find({ location_id: params.game }).all(function(err, items) {
		if(err) throw err;
		gamesResult({ players: items })
	})
}

exports.getPlayers = function(gameId, res) {
	Player.find({ location_id: gameId }).all(function(err, players) {
		if(err) throw err;
		Location.get(gameId, function(err, location) {
			if(err) throw err;
			res({players: players, location: location})
		})
	})
}


exports.nearFood = function(params, gamesResult) {
	Food.find({ location_id: params.game, food_left: orm.gt(0) }).all(function(err, items) {
		if(err) throw err;
		// res(items);
		if(items) {
			var distances = [];
			var status = 0;
			items.forEach(function(food) {
				currentLocation = { coords: { 
					latitude: params.lat,
					longitude: params.long
				}}
				var distance = getDistance(currentLocation,food) 
				if(distance < 10) {
					status = 1 //food found
					Food.get(food.id, function(err, foodObj) {
						if (err) throw err;
						foodObj.food_left = food.food_left - 1;
						foodObj.save(function(err) {
							if (err) throw err;
						})
					})
				}
				distances.push( distance )
			})
		} else {
			status = 2
			Location.get(params.game, function(err, game) {
				if (err) throw err;
				game.is_active = false;
				game.save(function(err) {
					if (err) throw err;
				})
			})
		}
		gamesResult({ distances: distances, status: status });
	});

}
exports.dropFood = function(params, gamesResult) {
	Location.get(params.game, function(err, game) {
		if (err) throw err;
		currentLocation = { coords: { 
			latitude: params.lat,
			longitude: params.long
		}}
		var distance = getDistance(currentLocation,game);
		var status = 1
		if(distance < 10) {
			status = 0
		}
		gamesResult({ distance: distance, status: status }); 
	})
}

exports.nearGames = function(action, currentLocation, gamesResult) {
	console.log(currentLocation);
	awayDistance = 30
	if(action == 'create-shape' || action == 'join-shape') {
		var game = { is_active: true, game_type: 2 }
	} else {
		var game = { is_active: true, game_type: 1 }
	}
	Location.find(game).all(function(err, games) {
		if(err) throw err;
		console.log(games);
		if(games.length > 0) {
			console.log('nearby game')
			distances = []
			games.forEach(function(item) {
				gameLocation = { lat: item.lat, long: item.long }
				var distance = getDistance(currentLocation,gameLocation)
			  console.log(distance)
			  distances.push(distance)
			})
			var nearGame = distances.findIndex(isInGameRadius);
			// console.log(nearGame)

			if(nearGame > -1) {
				if(action == 'create' || action == 'create-shape') {
					further = awayDistance - Math.round(distances[nearGame], 2)
					gamesResult({ success: 0, 
												message: "there's a game nearby, you can join it or create a new game "+further+"m further", 
												game: games[nearGame].id })
				} else {
					console.log('joining')
					joinGame(games[nearGame], function(res) {
						gamesResult(res);
					})
				}
			} else {
				if(action == 'create') {
					createNewGame(currentLocation, function(res) {
						gamesResult(res);
					});
				}
				else if(action == 'create-shape'){
					createNewShapeGame(currentLocation, function(res) {
						gamesResult({success: 1});
					});
				} else {
					gamesResult({ success: 0, 
												message: "there're no nearby games, move closer to one or create a new one"
											})
				}
			}

		} else if(action == 'create') {
			createNewGame(currentLocation, function(res) {
				gamesResult(res);
			});
		} else if(action == 'create-shape'){
			createNewShapeGame(currentLocation, function(res) {
				gamesResult(res);
			});
		}	else {
			gamesResult({ success: 0, 
										message: "there're no nearby games, move closer to one or create a new one"
									})
		}
	});
}

exports.getFood = function(gameId , res) {
	Food.find({ location_id: gameId }).all(function(err, items) {
		if(err) throw err;
		console.log(gameId)
		res(items);
	});
}

exports.endShapeGame = function(gameId, res) {
	Location.get(gameId, function(err, loc) {
		
		loc.is_active = 0;
		loc.save()

		res({'success' : 1})
	});
}

function joinGame(game, result) {
	Player.create([{
		location_id: game.id
	}], function(err, items) {
		if(err) throw err;
		result({ success: 1, 
						message: "You've joined game No. ("+game.id+")", 
						game: game.id,
						player: items[0].id
					})
	})
}

function createNewGame(currentLocation, result) {
	Location.create([{ 
		lat: currentLocation.coords.latitude, 
		long: currentLocation.coords.longitude,
		game_type: 1,
		is_active: true
	}], function(err, items) {
		if(err) throw err;
		//create food with item.id and coords in a radius of 30m
		createFood(items[0])
		Player.create([{
			location_id: items[0].id
		}], function(err, item) {
			if(err) throw err;
			result({ success: 1, 
							message: "game No. ("+items[0].id+") created, wait for other players to join", 
							game: items[0].id,
							player: item[0].id })
		})
	})
}
function createFood(items) {
	var R = 0.00025 // distance radius (lat + R)
	var x1 = parseFloat(items.lat) + R // center + distance
	var y1 = parseFloat(items.long)
	console.log(x1+' '+y1)
	for (var i = 10; i > 0; i--) {
		var a = Math.random() * 6.28319 // random angle in radians 360/(180*PI)
		var x2 = x1 + (R * Math.cos(a))
		var y2 = y1 + (R * Math.cos(a))
		console.log('-------------',x2,y2)
		Food.create([{
			lat: x2,
			long: y2,
			location_id: items.id,
			food_left: 10
		}],function(err, items) {
			if(err) throw err;
		})
	}
	return true
}

function createNewShapeGame(currentLocation, result) {
	Location.create([{ 
		lat: currentLocation.coords.latitude, 
		long: currentLocation.coords.longitude,
		game_type: 2,
		is_active: true
	}], function(err, items) {
		if(err) throw err;
		Player.create([{
			location_id: items[0].id
		}], function(err, item) {
			if(err) throw err;
			result({ success: 1, 
							message: "game No. ("+items[0].id+") created, wait for other players to join", 
							game: items[0].id,
							player: item[0].id })
		})
	})
}


function CalculateDistance(lat1, lon1, lat2, lon2) {
  var R = 6371000; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI/180)
}

var awayDistance;
function isInGameRadius(element, index, array) {
	return element < awayDistance;
}


getDistance = function(position, gamePosition) {
  // Get the coordinates they are at
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  var distance = CalculateDistance(gamePosition.lat, gamePosition.long, lat, long);

  return distance
}
