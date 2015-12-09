// requires jasmine-node
var City = require('../models');

describe('a city', function() {

  var testCity;

  var json = {
    "name": "Seattle, WA",
    "gifUrl": "http://45.media.tumblr.com/tumblr_lxtxuadWJR1r6j7rho1_1280.gif",
    "averageSalary": "77419",
    "numJobs": "1197",
    "costOfLiving": "1.36426"
  };

  beforeEach( function() {

    testCity = new City(json);

  });

  it('should have a name', function() {

    expect(testCity.name).toBeDefined();
    expect(testCity.name).toBe(json.name);
  });

  it('should have an image', function() {

    expect(testCity.gifUrl).toBeDefined();
    expect(testCity.gifUrl).toBe(json.gifUrl);

  });

});
