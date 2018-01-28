var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});


/* GET pokaz dane */
router.get('/pokaz_dane', function(req, res) {
    var db = req.db;
    var collection = db.get('daneczujnika_SHT');
    collection.find({},options,function(e,docs){
        res.render('pokaz_dane', {
            "pokaz_dane" : docs
        });
    });
});

    
	
var options = {
    "sort": { "date": -1 },
  };


/* POST to Add User Service */
router.get('/zapiszdane', function(req, res) {

var request = require('request');


//
    // Set our internal DB variable
         var db = req.db;
         
     // Get our form values. These rely on the "name" attributes
              var temp = req.query.temp;
              var wilg = req.query.wilg;
                                // Set our collection
              var collection = db.get('daneczujnika_SHT');
                  // Submit to the DB
                  if(wilg>=0){
                collection.insert({
		  "date" : new Date(),
	          "temp" : temp,
	          "wilg" : wilg
			
                }, function (err, doc) {
                              if (err) {
                    // If it failed, return error
                 res.send("There was a problem adding the information to the database.");
                                                }
                  else {
             // And forward to success page
                 res.send("Data sent correctly.");
                 }

                            });
request.post(
    'http://alfa.smartstorm.io/api/v1/measure',
    { json: {"user_id": "hudzik.cezary@gmail.com",
          "sensor_id": "5a5e170d2a455b457fba8271",
                  "desc" : "some_random_description",
                          "measure_value" : temp} },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);
request.post(
    'http://alfa.smartstorm.io/api/v1/measure',
    { json: {"user_id": "hudzik.cezary@gmail.com",
          "sensor_id": "5a5e17422a455b457fba8272",
                  "desc" : "some_random_description",
                          "measure_value" : wilg} },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);

}
                     });
   

module.exports = router;
