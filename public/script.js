// What's wrong with storing city data here for global use?
var cities;  // filled by ajax request in listCities()

// Helper function to add nice-looking commas to long numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Converts "Cleveland index" to human-readable language
function getCleveIndexString(index) {
  var indexRounded = Math.round(index * 100);
  if ( indexRounded > 95 && indexRounded < 105 ) {
    return 'on par with Cleveland';
  } else if ( index > 1 ) {
    return (indexRounded - 100) + '% pricier than Cleveland';
  } else {
    return (100 - indexRounded) + '% cheaper than Cleveland';
  }
}

var clicks = 0; // counts the number of clicks on cities

// helper function for ajax call to get weather JSON
function updateWeather(cityName, $target) { // get custom JSON element for city
  $.getJSON('/weather/' + cityName.split(',')[0] + '/' + cityName.split(', ')[1], function(json) {
    // var $weatherEl = $target.find('p.weather');
    // $weatherEl.empty();
    // $weatherEl.append('<img src="' + json.icon_url  + '">');
    $target.find('h2').append('<img src="' + json.icon_url  + '" class="weather-icon">');
    // $weatherEl.append(json.fcttext);
    addRowToTable('Weather', json.fcttext, $target);
  });
}

// helper function to get individual JSON data for given city string
function getCityData(cityName) { // e.g. cityName == 'Washington, DC'
  for ( var i = 0; i < cities.length; i += 1 ) {
    if ( cities[i].name === cityName )
      return cities[i];
  }
  console.log('Error: city not found.');
  return null;
}

// Helper function to add row to table
function addRowToTable(cell1, cell2, $target) {
  $target.find('table').append('<tr><td>' + cell1 + '</td><td>' + cell2 + '</td></tr>');
}

// Helper function to make table with given dataset as key value pairs
function getInfoTable(keyValuePairs) {
  var table = '<table class="info-table">';
  table += '</th>';
  for ( var j = 0; j < keyValuePairs.length; j += 1 ) {
    table += '<tr><td>' + keyValuePairs[j][0] + '</td><td>' +
    keyValuePairs[j][1] + '</td></tr>';
  }
  return table + '</table>';
}

// Puts city stats and picture of given city name in target contender space
function setCityAsContender(cityName, $target) {
  var city = getCityData(cityName); // get the JSON for the city selected
  $target.empty();
  $target.append(
    '<h2>' + city.name + '</h2>' +
    '<img src="' + city.gifUrl + '" class="city-image">' +
    getInfoTable([
      ['Average salary', '$' + numberWithCommas(city.averageSalary) ],
      ['Number of jobs', numberWithCommas(city.numJobs) ],
      ['Cost of living', getCleveIndexString(city.costOfLiving) ]
    ]));

  updateWeather(cityName, $target);
  // other API updates go here
}

// Counts clicks, delegates rendering of contender cities to left or right
function setContender(cityName) {
  // console.log(clicks);
  if ( clicks % 2 === 1 ) { // set contender on left
    $('#contender-right').append('<p class="init">?</p>').empty();
    setCityAsContender(cityName, $('#contender-left'));
  } else { // set contender on right and compare...
    setCityAsContender(cityName, $('#contender-right'));
  }
}

// Populates cities on the bottom that can be selected with JSON as provided
function listCities($target, citiesJson) {
  if (citiesJson) // If the data is provided, save it as global variable
    cities = citiesJson; // for later use, maybe

  $target.empty(); // empty the target div before we (re-)popualte it

  // Iterate through each city provided in the JSON
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

$(document).ready( function() {

  // Seems that this jQuery selector must be set here
  var $citiesSection = $('#cities');

  $.getJSON('/cities.json', function(json) {
    listCities($citiesSection, json);
  });
});
