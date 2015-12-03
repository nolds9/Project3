var City = require("../models/city.js");

describe("city", function() {

    var NewYork;

    beforeEach(function() {
        NewYork = new City("New York", 68000, 2000, 80000, 3, "This city smells");
    });

    it("should have a name", function() {
        expect(NewYork.name).toBeDefined();
    });

    it("should have an averageSalary", function() {
        expect(NewYork.averageSalary).toBeDefined();
    });

    it("should have a numJobs", function() {
        expect(NewYork.numJobs).toBeDefined();
    });

    it("should have a costOfLiving", function() {
        expect(NewYork.costOfLiving).toBeDefined();
    });

    it("should have a livability rating", function() {
        expect(NewYork.livability).toBeDefined();
    });

    it("should allow for comments", function() {
        expect(NewYork.comment).toBeDefined();
    });

    it("averageSalary, numJobs, and costOfLiving should be numbers > 0", function() {
        expect((NewYork.averageSalary * NewYork.numJobs * NewYork.costOfLiving) > 0).toBe(true);
    });

});

// Describe a city
//     it "should have a name"
//     it "should have an average salary" -- somehow...
//     it "should have a number of jobs"
//         Describe a number of jobs
//             it "should be pulled live from Glassdoor or some other job site"
//     it "should have an avg cost of living OR a CPI index against the national avg"
//     it "should have some other data that conveys if it's a good/cool place to live"
//     it "should have a user comments section"
