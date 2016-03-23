var id, target, options;

function success(pos) {
  var crd = pos.coords;

  if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
    console.log('Congratulations, you reached the target');
    navigator.geolocation.clearWatch(id);
  }
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

target = {
  latitude : 0,
  longitude: 0
};

options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);





var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
// var position = {}, OurInterval
getLocation();

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + 
    "<br>Longitude: " + position.coords.longitude;  
    OnInterval(position)

}



function CalculateDistance(lat1, lon1, lat2, lon2) {
    var distance =
      Math.sin(lat1 * Math.PI) * Math.sin(lat2 * Math.PI) +
      Math.cos(lat1 * Math.PI) * Math.cos(lat2 * Math.PI) * Math.cos(Math.abs(lon1 - lon2) * Math.PI);
    return (Math.acos(distance) * 63709.81162);
}

// The target longitude and latitude
var loc = [19.4238681, -99.1671484];
// var loc = [19.425447, -99.166298]; // 200m
// var loc = [19.429902, -99.169231]; // 400m

var i = 0
function OnInterval(position) {
  // Get the coordinates they are at
  var lat = position.coords.latitude;
  var long = position.coords.longitude;
  var distance = CalculateDistance(loc[0], loc[1], lat, long);
  console.log(distance)
  x.innerHTML = distance + ' ' + lat + ' ' + long+ ' out of zone' + i;
  // Is it in the right distance? (200m)
  if (distance <= 200) {
    // Stop the interval
    x.innerHTML = distance + ' in game zone ' + i;

    // Do something here cause they reached their destination
  }

  i++;

  setTimeout(function() {
    getLocation()
  },100)
}
