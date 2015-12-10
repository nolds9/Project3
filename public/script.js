
// What's wrong with storing city data here for global use?
var cities; // filled by ajax request in listCities()

// Helper function to add nice-looking commas to long numbers
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Converts "Cleveland index" to human-readable language
function getCleveIndexString(index) {
    var indexRounded = Math.round(index * 100);
    if (indexRounded > 95 && indexRounded < 105) {
        return 'on par with Cleveland';
    } else if (index > 1) {
        return (indexRounded / 100) + 'x pricier than Cleveland';
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
        $target.find('h2').append('<img src="' + json.icon_url + '" class="weather-icon">');
        // $weatherEl.append(json.fcttext);
        addRowToTable('Weather', json.fcttext, $target);
    });
}

// helper function to get individual JSON data for given city string
function getCityData(cityName) { // e.g. cityName == 'Washington, DC'
    for (var i = 0; i < cities.length; i += 1) {
        if (cities[i].name === cityName)
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
    for (var j = 0; j < keyValuePairs.length; j += 1) {
        table += '<tr><td>' + keyValuePairs[j][0] + '</td><td>' +
            keyValuePairs[j][1] + '</td></tr>';
    }
    return table + '</table>';
}

// Puts city stats and picture of given city name in target contender space
// Also adds weather from wunderground and updates job info from Indeed
function setCityAsContender(cityName, $target) {
<<<<<<< HEAD
    var city = getCityData(cityName); // get the JSON for the city selected
    $target.empty();
    $target.append(
        '<h2>' + city.name + '</h2>' +
        '<img src="' + city.gifUrl + '" class="city-image">' +
        getInfoTable([
            ['Average salary', '$' + numberWithCommas(city.averageSalary)],
            ['Number of jobs', numberWithCommas(city.numJobs)],
            ['Cost of living', getCleveIndexString(city.costOfLiving)]
        ]));
    addIndeedData(cityName, $target);
    // reconfigureScreen();
}

// Counts clicks, delegates rendering of contender cities to left or right
function setContender(cityName) {
    var $contenderRight = $('#contender-right');
    var $contenderLeft = $('#contender-left');
    if (clicks % 2 === 1) { // set contender on left
        $contenderRight.empty();
        $contenderRight.append('<p class="init">?</p>');
        $contenderLeft.toggle().toggle();
        setCityAsContender(cityName, $contenderLeft);
        addMeMuchoGusto($contenderLeft);
    } else { // set contender on right and compare...
        $contenderRight.toggle().toggle();
        setCityAsContender(cityName, $('#contender-right'));
        addMeMuchoGusto($contenderRight);
    }
}

// Populates cities on the bottom that can be selected with JSON as provided
function listCities($target, citiesJson) {
    if (citiesJson) // If the data is provided, save it as global variable
        cities = citiesJson; // for later use, maybe

    $target.empty(); // empty the target div before we (re-)popualte it

    // Iterate through each city provided in the JSON
    for (var i = 0; i < cities.length; i += 1) {
        // add h3 element for each city name to city section (target)
        $target.append('<h3>' + citiesJson[i].name + '</h3>');
        // get that last added h3 and add click event listener
        $('h3:last').on('click', function(e) {
            if (clicks % 2 === 0) {
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

// Grabs data from Indeed and replaces the job number
function addIndeedData(cityName, $target) {
    var city = cityName.split(',')[0];
    var state = cityName.split(', ')[1];
    var numJobs = $target.find('td')[3];
    var indeedNumber;
    $.getJSON('/indeed/' + city + '/' + state, function(json) {
        indeedNumber = json.response.totalresults;
    }).then(function() {
        if (indeedNumber) {
            numJobs.innerHTML = numberWithCommas(indeedNumber);
        };
    });
}

// Adds the clickable div to the contender

function addMeMuchoGusto($container) {
    var savedId;
    $container.append("<div class='meMuchoGusto'>Click for More!</div>");
    $('.meMuchoGusto').on("click", function() {
        var identity = $(this.parentElement).eq(0).attr('id').val;
        var $contender = $(this.parentElement).eq(0);
        var cityName = $contender.find('h2')[0].innerHTML;
        savedId = $contender.attr('id').toString();
        $contender.toggleClass('popAndLock', true);
        $contender.removeClass('contender');
        $contender.removeAttr('id');
        $contender.find('.meMuchoGusto').hide();
        updateWeather(cityName, $contender);
        getEmployers(cityName, $contender);
        $contender.find('h2').prepend("<p class='exitButton'>{X}</p>");
        $('.exitButton').on("click", function(){
            exitPop($contender, savedId);
        });
    });
}

//  MAKE SURE THIS IS ADDING EVERYTHIGN BACK!
function exitPop($contender, savedId) {
    $contender.toggleClass('popAndLock', false);
    $contender.addClass('contender');
    $contender.attr('id', savedId);
    var extraTrNums = function() {
        var a = [];
        var trs = $contender.find('tr').length;
        for (var i = 3; i < trs.length; i++) {
            a.push(i);
        };
        return a;
    };
    $($contender.find('tr')[extraTrNums]).remove();
    $contender.find('.meMuchoGusto').show();
    $('.exitButton').remove();
}

// Glassdoor API call
function getEmployers(cityName, $target) {
    var city = cityName.split(',')[0];
    var state = cityName.split(', ')[1];
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
            var employer = new Employer(data[i]);
            employers.push(employer);
        }
    }
    $.getJSON('/glassdoor/' + city + '/' + state, function(json) {
        var glassdoorString = "Employers on Glassdoor: ";
        var numJobs = json.response.totalRecordCount;
        addRowToTable(glassdoorString, numJobs, $target);
        createEmployers(json.response.employers);
        for (var i = 0; i < employers.length; i++) {
            var cell1 = "<img src='" + employers[i].logo + "' alt=''" + employers[i].name + "'s logo'' height='50rem' width='50rem'>";
            var cell2 = "<a class='employer' href=http://" + employers[i].website + ">" + employers[i].name + "</a>";
            addRowToTable(cell1, cell2, $target);
        };
    });
}

var whyCleveland = "The Cleveland Index:  Using open-source data, we have compared the CPI of each of the cities used in this app to that of Cleveland. We have done this to avoid paying an outrageous fee. We chose Cleveland, Ohio because it seems like it's a pretty average place. At the time of writing, a member of the development team is scheduled perform an on-site analysis of this hypothesis.";

$(document).ready(function() {

    $('#whyCleveland').on("click", function() {
        alert(whyCleveland);
    });
    // Seems that this jQuery selector must be set here
    var $citiesSection = $('#cities');

    $.getJSON('/cities.json', function(json) {
        listCities($citiesSection, json);
    });
});
