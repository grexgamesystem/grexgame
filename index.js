var express = require('express'),
		config = require('./config'),
		Location = require('./models/Location'),
		app = express();


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/api/ant/:action', function(request, response) {
	action = response.req.params.action;
	if(action == 'food') {
		Location.nearFood(response.req.query, function(res) {
			console.log(res);
			response.json(res);
		})

	} else if(action == 'drop') {
		Location.dropFood(response.req.query, function(res) {
			console.log(res);
			response.json(res);
		})

	} else  { 
		var location = {
			coords: response.req.query
		}
		Location.nearGames(action, location, function(res) {
			console.log(res);
			response.json(res);
		})
	}
})

app.get('/game/:id', function(request, response) {
	game = response.req.params.id
	Location.getFood(game, function(res) {
		console.log(res)
	  response.render('pages/game', {
	  	game: game
	  });
	})
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


