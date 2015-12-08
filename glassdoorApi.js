var request = require("request");
var env = require('./env.js');
var searchTerm = "web developer";
var jobsReviewsSalariesEmployers = ["jobs", "reviews", "salaries", "employers"];
var partnerKey = env.glassdoorKey;
var partnerID = env.glassdoorPartnerID
var requiredAttributionHTML = "<a href='https://www.glassdoor.com/index.htm'>powered by <img src='https://www.glassdoor.com/static/img/api/glassdoor_logo_80.png' title='Job Search' /></a>";
// Get city and state from user input
var city;
var state;
// Glassdoor asks for the end-user's ip address and browser type. This info is not critical for the api to function. So we are using the glassdoor-supplied default values.
// Free Glassdoor API accounts do not allow for job searches, so we can only query employers, reviews, and salaries for the particular searchTerm (job).
var url = "http://api.glassdoor.com/api/api.htm?t.p=" + partnerID + "&t.k=" + partnerKey + "&userip=50.200.196.50&useragent=&format=json&v=1&action=" + jobsReviewsSalariesEmployers[3] + "&q=" + encodeURI(searchTerm) + "&city=" + city + "&state=" + state + "&ps=1000/";

//Example search for "web developer" in Washington DC:
// http://api.glassdoor.com/api/api.htm?t.p=!!!!!&t.k=!!!!!&userip=!!!!!!!!!!!!&useragent=&format=json&v=1&action=employers&q=web+developer&city=washington&state=dc&ps=1000/

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
        console.log("creating Employer " + data[i].name)
        var employer = new Employer(data[i])
        toUser.push(employer);
    }
}

function apiCall(url) {
    request({
        uri: url,
        method: "GET",
        followRedirect: true,
        maxRedirects: 5
    }, function(error, response, body) {
        var data = JSON.parse(body);
        return data;
    });
};

var returnThis = function apiCall(url).then(function(data) {
    console.log("Session ID: " + data.jsessionid);
    console.log("User Searched for: " + city + ", " + state);
    console.log("Acutal Search Location: " + data.response.lashedLocation.longName);
    numEmployers = data.response.totalRecordCount.toString();
    console.log("number of Employers looking for Web Developers: " + data.response.totalRecordCount);
    console.log("length of employer results: " + data.response.employers.length);
    var currentPage = data.response.currentPageNumber;
    var totalPages = data.response.totalNumberOfPages;
    var toUser = [];
    toUser.push(numEmployers);
    createEmployers(data.response.employers);
    return toUser;
});
