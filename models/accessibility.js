var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getTransit: (location) => {
    var options = {
      method: 'GET',
      uri: `http://api.pugetsound.onebusaway.org/api/where/stops-for-location.json?key=${process.env.ONEBUSAWAY}&lat=${location.long}&lon=${location.lat}&radius=500`,
      json:true
    }


    return rp(options)
      .then(function(transitData) {
        return transitData;
      })
      .then( (transitData) => {
        var totTrans = transitData.data.list.length
        var transAvg = 20.96;
        var stD = 13.5;
        var zScore = ((totTrans - transAvg) / stD);

        var transGrade = Math.floor((((zScore) + 1.5) / 3) * 100);

        if (transGrade > 100) {
          return [99, transitData];
        } else if (transGrade < 5) {
          return [5, transitData];
        } else {
          return [transGrade, transitData];
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  getParking: (location) => {
    var options = {
      method: 'GET',
      // gets a 500 server error when making this request.
      uri: `https://data.seattle.gov/resource/3neb-8edu.json?$where=within_circle(shape,${location.long},${location.lat},500)`,
      // parking signage within the blocks radius
      // uri: `https://data.seattle.gov/resource/erv6-k5zv.json?$where=within_circle(shape,${location.long},${location.lat},200)`,
      ps: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }


    return rp(options)
      .then(function(parkingData) {
        return parkingData;
      })
      .then( (parkingData) => {
        var totParking = parkingData.length;
        var parkingAvg = 2.03;
        var stD = 4.27;
        var zScore = ((totParking - parkingAvg) / stD)

        var parkingGrade = Math.floor((((zScore) + 1.5) / 3) * 100);

        if (parkingGrade > 100) {
          return [99, parkingData];
        } else if (parkingGrade < 5) {
          return [5, parkingData];
        } else {
          return [parkingGrade, parkingData];
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  getWalkScore: (location) => {
    var options = {
      method: 'GET',
      uri: `http://api.walkscore.com/score?format=json&lat=${location.long}&lon=${location.lat}&wsapikey=${process.env.WALKSCORE}`,
      json:true
    }


    return rp(options)
      .then(function(parkingData) {
        return parkingData;
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
