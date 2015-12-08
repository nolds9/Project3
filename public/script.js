var CITY_DIV_CLASS = 'city';

var cities; // What's wrong with storing city data here for global use?

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getCleveIndexString(index) {
  var indexRounded = (Math.round(index * 100) / 100).toString();
  if ( index > 1 ) {
    return indexRounded + ' times pricier than Cleveland';
  } else if ( index < 1 ) {
    return indexRounded + ' times cheaper than Cleveland';
  } else {
    return 'pretty much like living in Cleveland';
  }
}

var clicks = 0;

function updateWeather(cityName, $target) { // get custom JSON element for city
  $.getJSON('/weather/' + cityName.split(',')[0] + '/' + cityName.split(', ')[1], function(json) {
    var $weatherEl = $target.find('p.weather');
    $weatherEl.empty();
    $weatherEl.append('<img src="' + json.icon_url  + '">');
    $weatherEl.append(json.fcttext);
  });
}

function getCityData(cityName) {
  for ( var i = 0; i < cities.length; i += 1 ) {
    if ( cities[i].name === cityName )
      return cities[i];
  }
  console.log('Error: city not found.');
  return null;
}

function setCityAsContender(cityName, $target) {
  var city = getCityData(cityName); // get the JSON for the city selected
  $target.empty();
  $target.append(
    '<h1>' + city.name + '</h1>' +
    '<p class="weather">fetching weather</p>' +
    '<img src="' + city.gifUrl + '" class="city-image">' +
    '<ul>' +
      '<li>Average salary: $' + numberWithCommas(city.averageSalary) + '</li>' +
      '<li>Number of jobs: ' + numberWithCommas(city.numJobs) + '</li>' +
      '<li>Cost of living: ' + getCleveIndexString(city.costOfLiving) + '</li>' +
    '</ul>'
  );

  updateWeather(cityName, $target);
  // other API updates go here
}

function setContender(cityName) {
  // console.log(clicks);
  if ( clicks % 2 === 1 ) { // set contender on left
    $('#contender-right').append('<p class="init">?</p>').empty();
    setCityAsContender(cityName, $('#contender-left'));
  } else { // set contender on right and compare...
    setCityAsContender(cityName, $('#contender-right'));

  }
}

function listCities($target, citiesJson) {
  if (citiesJson)
    cities = citiesJson;

  $target.empty();

  for ( var i = 0; i < cities.length; i += 1 ) {
    // add h3 element for each city name to city section (target)
    $target.append('<h3>' + citiesJson[i].name + '</h3>');
    // get that last added h3 and add click event listener
    $('h3:last').on('click', function(e) {
      if ( clicks % 2 === 0 ) {
        $('#cities h3').removeClass('selected'); // deselect the cities on the bottom
      }
      $(this).toggleClass('selected');
      // setContender(this.);
      // console.log(this.innerHTML); // show what city was clicked
      clicks += 1;
      setContender(this.innerHTML);
    });
  }
}





$(document).ready( function() { // why does this all need to be in on ready?

  var $citiesSection = $('#cities');

  $.getJSON('/cities.json', function(json) {
    listCities($citiesSection, json);
  });
});
