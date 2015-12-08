var CITY_DIV_CLASS = 'city';

var cities; // What's wrong with storing city data here for global use?


// this function isn't used anymore
function makeCityDiv(city) { // city = individual JSON
  return '<div class="' + CITY_DIV_CLASS + '">' +
      '<h1>' + city.name + '</h1>' +
      '<img src="' + city.gifUrl + '" alt="' + city.name + '">' +
      '<ul>' +
        '<li>Average salary: ' + city.averageSalary + '</li>' +
        '<li>Number of jobs:' + city.numJobs + '</li>' +
        '<li>Cost of living: ' + city.costOfLiving + '</li>' +
      '</ul>' +
    '</div>';
}

var clicks = 0;

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
    '<img src="' + city.gifUrl + '">' +
    '<ul>' +
      '<li>Average salary: ' + city.averageSalary + '</li>' +
      '<li>Number of jobs:' + city.numJobs + '</li>' +
      '<li>Cost of living: ' + city.costOfLiving + '</li>' +
    '</ul>'
  );
}

function setContender(cityName) {
  console.log(clicks);
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
      console.log(this.innerHTML);
      clicks += 1;
      setContender(this.innerHTML);
    });
  }
}

function getEmployers(target.city, target.state){
    var employers = [];
    var Employer = function(data) {
        this.name = data.name,
            this.website = data.website,
            this.industry = data.industry,
            this.logo = data.squareLogo,
            this.numRatings = data.numberOfRatings,
            this.rating = data.overallRating,
            this.ratingDescription = data.ratingDescription,
            this.featuredReview = data.featuredReview
    }
    function createEmployers(data) {
        for (var i = 0; i < data.length; i++) {
            console.log("creating Employer " + data[i].name);
            var employer = new Employer(data[i]);
            employers.push(employer);
        }
    }
    $.getJSON('/glassdoor/' + target.city + '/' + target.state, function(json) {
        createEmployers(json);
        for (var i = 0; i < employers.length; i++) {
            if ( clicks % 2 === 1 ) {
              $('#contender-left').append('<a class="employer" href=' + employers[i].website + '>' +  employers[i].name + '</a>');
            } else {
             $('#contender-right').append('<a class="employer" href=' + employers[i].website + '>' +  employers[i].name + '</a>');
            }
        };
    });
}



$(document).ready( function() { // why does this all need to be in on ready?
                                //because we dont want to run the code until the framework html is in place.
                                // similar to .then or a callback...
  var $citySelector = $('#cities');

  // $.getJSON('/cities.json', function(cityData) {
  //   // console.log(cityData);
  //   for ( var c = 0; c < cityData.length; c += 1 ) {
  //     console.log(cityData[c]);
  //     var city = cityData[c];
  //     $citySelector.append(makeCityDiv(city));
  //   }
  // });

  var $citiesSection = $('#cities');

  $.getJSON('/cities.json', function(json) {
    listCities($citiesSection, json);
  });
});
