// var env = require("./env");
function City(info) {
    this.name = info.name;
    this.gifUrl = info.gifUrl;
    this.averageSalary = info.averageSalary;
    this.numJobs = info.numJobs;
    this.costOfLiving = info.costOfLiving;
    this.livability = info.livability;
}

$(document).ready(function(){
    var clickCounter = 0;
    $(".city").on("click", function(clickEvent){
        var cityName = clickEvent.currentTarget.getElementsByClassName('name')[0].innerText.toString();
        if (clickCounter % 2 === 0) {
            $("#left").empty().append(createCard(cityName));
        }else if (clickCounter % 2 === 1) {
            $("#right").empty().append(createCard(cityName));
        }else {
            console.log("ERROR WITH CLICKCOUNTER!!!")
        };
        clickCounter++;
    });
    function createCard(cityName){
        // WE NEED JQUERY DOM SELECTION TO GET THE TEXT OF THE CITY NAME
        // USE ROUTES TO RETURN JSON TO THIS FUNCTION
        var request = $.getJSON("http://localhost:4000/city/" + cityName);
        return "data";
    }
});

// City.prototype = {
//     getWeather: function(){
//         var url = "http://api.wunderground.com/api/45d833eecf376b21/conditions/q/CA/San_Francisco.json";
//         $.getJSON(url).then(function(response){
//             console.log(response.current_observation.weather);
//             return response.current_observation.weather;
//         });
//     },
//     getIndeedApi: function() {
//         var url = "http://api.indeed.com/ads/apisearch?publisher=" + env.indeed + "&q=web+developer&l=" + encodeURI(this.name) + "&sort=&radius=25&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2";
//         $.getJSON(url, function(response) {
//             city.numJobs = response.totalresults;
//             return response.totalresults;
//         })
//     },
//     getGlassdoorApi: function(){
//
//     },
//     getLivability: function(){
//
//     }
// }
