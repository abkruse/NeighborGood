var rp = require('request-promise');
var env = require('require-env');
var fs = require('fs');
var path = require('path');

module.exports = {
  getCrime: (location) => {

    var options = {
      method: 'GET',
      uri: `https://data.seattle.gov/resource/y7pv-r3kh.json?$where=within_circle(location,${location.long},${location.lat},1000)`,
      qs: {
        $limit : 1000,
        $$app_token: process.env.SODAKEY
      },
      json:true
    }

    return rp(options)
      .then(function(crimeData) {

          var organizedCrimeCountObj = {}

          for (var i = 0; i < crimeData.length; i++) {
            if (organizedCrimeCountObj[crimeData[i].summarized_offense_description]) {
              organizedCrimeCountObj[crimeData[i].summarized_offense_description] += 1;
            } else {
              organizedCrimeCountObj[crimeData[i].summarized_offense_description] = 1;
            }
          }

           var organizedCrimeCountArray = [];

           for (var j = 0; j < Object.keys(organizedCrimeCountObj).length; j++) {
             organizedCrimeCountArray.push({'name':Object.keys(organizedCrimeCountObj)[j], 'size':organizedCrimeCountObj[Object.keys(organizedCrimeCountObj)[j]]})
           }

           var finalcrimeData = {
             name:"crimes",
             children: organizedCrimeCountArray,
             original_data: crimeData
           };

        finalcrimeData = JSON.stringify(finalcrimeData);

        fs.writeFile(path.join(__dirname, '../public/crime.json'), finalcrimeData, function(writeErr){
          console.log(writeErr);
        });
        return JSON.parse(finalcrimeData);
      })
      .then( (crimeData) => {
        var totCrimes = 0;

        for (var i = 0; i < Object.keys(crimeData.children).length; i++) {
           totCrimes += crimeData.children[i].size;
        }

        var avg = 1088.57;
        var stD = 234.07;
        var zScore = ( -(totCrimes - avg) / stD)
        var crimeGrade = Math.floor(((zScore + 2) / 4) * 100);

        if (crimeGrade > 100) {
          return [99, crimeData];
        } else if (crimeGrade < 5) {
          return [5, crimeData];
        } else {
          return [crimeGrade, crimeData];
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }
}
