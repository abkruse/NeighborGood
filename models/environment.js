var rp = require('request-promise');
var env = require('require-env');

module.exports = {
  getAqi: (location) => {
    function formatDate(date) {
      var d = new Date(),
          month = "" + (d.getMonth() + 1),
          day = "" + d.getDate(),
          year = d.getFullYear()

          if (month.length < 2) {
            month = '0' + month;
          }
          if (day.length < 2) {
            day = '0' + day;
          }

          return [year, month, day].join('-');
     }

     date = formatDate(new Date());

    var options = {
      method: 'GET',
      uri:`http://airnowapi.org/aq/forecast/latLong/?format=application/json&latitude=${location.lat}&longitude=${location.long}&date=${date}&distance=10&API_KEY=${process.env.AQIKEY}`,

      //not permanent fix to CA certificate issue
      rejectUnauthorized: false
    }
  return rp(options)
    .then( (aqiData) => {
      validAqi = []
      aqiData.forEach(point) {
        if point.ParameterName == 'PM2.5' {
          validAqi.push(point.AQI);
        }
      }
      sum = validAqi.reduce(function(a, b) { return a + b; })
      return sum/validAqi.length;
    })
    .catch( (err) => {
      console.log(err);
    });
  },

  getPermits: (location) => {
    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/mags-97de.json?$where=within_circle(location, ${location.long}, ${location.lat},500)`,
      qs: {
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then( (permitData) => {
        return permitData;
      })
      .then( (permitData) => {
        var totPermit = Object.keys(permitData).length
        var permitAvg = 232.62;
        var stD = 139.59;
        var zScore = ( -(totPermit - permitAvg) / stD)

        var permitGrade = Math.floor(((zScore + 2) / 4) * 100);

        if (permitGrade > 100) {
          return [99, permitData];
        } else if (permitGrade < 5) {
          return [5, permitData];
        } else {
          return [permitGrade, permitData];
        }
      })
      .catch( (err) => {
        console.log(err);
      });
  }
}
