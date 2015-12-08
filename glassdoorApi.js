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
