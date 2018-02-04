var Type = require('type-of-is');

//import express package
var express = require("express");

//import mongodb package
var mongodb = require("mongodb");

//MongoDB connection URL - mongodb://host:port/dbName
var dbHost = "mongodb://localhost:27017/fusion_demo";

//DB Object
var dbObject;

//get instance of MongoClient to establish connection
var MongoClient = mongodb.MongoClient;

//Connecting to the Mongodb instance.
//Make sure your mongodb daemon mongod is running on port 27017 on localhost

// mongoDB local ip and port address
const db ="mongodb://localhost:27017"

MongoClient.connect(db,(err,database) =>{ 
  const myAwesomeDB = database.db('project_pg')
  dbObject = myAwesomeDB.collection('DHT_data')
  db2 = myAwesomeDB.collection('nodeMCU_led')
});


function getData(responseObj){	
  //button color
  var led_state_color;
  var led_state;
  var button_name;
  var button_url;
  var button_style;
  var state;
  db2.find({}).toArray(function(err, results) {
  	led_state_color = results[0]['color'];
	//console.log(results);
  });

  //use the find() API and pass an empty query object to retrieve all records
  dbObject.find({}).sort({date: -1}).limit(100).toArray(function(err, docs){
    
    if ( err ) throw err;
    var monthArray = [];
    var petrolPrices = [];
    var dieselPrices = [];
    var trendLine = [];
    var srednia = [];
    
    var licznik = 0;	
    var wartosc = 0;
    var sredniaTEMP = 0;
    var wartosc2  = 0;
    var TT = 0;
    var lT = 0;
	
    //Button and text settings - NodeMCU led 
    if (led_state_color == 'red'){
	button_url = '/button_ledOn';
        button_name = "ON";
	led_state = "OFF";
	button_style = "btn btn-success";
    }else{
	led_state_color = 'green';
	button_url = '/button_ledOff'; 
	button_name = "OFF";
	led_state = "ON";
	button_style = "btn btn-danger";
	}
	
    for (index in docs){
      var T=0;
	
      var doc = docs[index];
      //category array
      var month = doc['date'];
      //series 1 values array
      var petrol = doc['wilg'];
      //series 2 values array
      var diesel = doc['temp'];
	//trendlin
	
	var spr = isNaN(diesel);

	if(spr == false){

        var licznik = licznik +1;
	var wartosc = wartosc + parseInt(diesel);
	var wartosc2 =wartosc2 +  parseInt(petrol);
	
	var sredniaTEMP = wartosc / licznik;
	var sredniaWILG = wartosc2/ licznik;
	var sredniaTEMP = sredniaTEMP.toFixed(2);

	var lT =parseInt(petrol )-sredniaWILG;
	var sredniaWILG = sredniaWILG.toFixed(2);
	
        monthArray.push({"label": month});
        petrolPrices.push({"value" : petrol});
        dieselPrices.push({"value" : diesel});
	//trendLine.push({"value" : sredniaWILG});
	srednia.push({"value" : sredniaTEMP});

	}
	var T = 0;
	var TT = 0;
	for (index in doc){
		var diesel = doc["temp"];
		var spr = isNaN(diesel);
		if (spr == false){
			TT = TT+1;
			T = T + Math.round(((sredniaWILG/100) * TT)) + (sredniaWILG/2); 
			//trendLine.push({"value" : T});
		}
	}
	T = T.toFixed(2) - 40;
	trendLine.push({"value" : T});
    }

    var dataset = [
      {
        "seriesname" : "Wilgotnosc",
        "data" : petrolPrices
      },
      {
        "seriesname" : "Temperatura",
        "data": dieselPrices
      },
	{
	"seriesname" : "LiniaTrendu",
	"data" : trendLine
	},

	{
	"seriesname" : "WartośćŚrednia",
	"data" : srednia
	}
    ];

    var response = {
      "dataset" : dataset,
      "categories" : monthArray,
      "led_state_color" : led_state_color,
      "button_url" : button_url,
      "led_state" : led_state,
      "button_name" : button_name,
      "button_style" : button_style
    };

    responseObj.json(response);

  });
}


//create express app
var app = express();

//NPM Module to integrate Handlerbars UI template engine with Express
var exphbs  = require('express-handlebars');

//Declaring Express to use Handlerbars template engine with main.handlebars as
//the default layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Defining middleware to serve static files
app.use('/public', express.static('public'));

app.get("/fuelPrices", function(req, res){
  getData(res);
});

app.get("/", function(req, res){
  res.render("chart");
});


//Save switch status - ON
app.get("/button_ledOn", function(req, res){
  db2.updateOne({"name" : "button"},{ $set: {"color" : "green"}}, function(err, results) {
        //console.log(err, results);
        res.render("chart");
  });
});

//Save switch status - OFF
app.get("/button_ledOff", function(req, res){
  db2.updateOne({"name" : "button"},{ $set: {"color" : "red"}}, function(err, results) {
  	//console.log(err, results);
  	res.render("chart");
  });
});

//Check switch state
app.get("/switchState", function(req, res){
  db2.find({}).toArray(function(err, results) {
        if (err) {
           res.send("There was a problem adding the information to the database.");
        }else if (results[0]['color'] == 'red') { res.send("OFF");
	}else if (results[0]['color'] == 'green') { res.send("ON");
	}else{ res.send("Error"); }
});
});


//GET to save out data in DB
app.get("/saveData", function(req, res){
	
	var request = require('request');

	var dbObject;
	var mongodb = require("mongodb");
	var MongoClient = mongodb.MongoClient;
	var db ="mongodb://localhost:27017"
	
	MongoClient.connect(db,(err,database) =>{
  		var myAwesomeDB = database.db('project_pg')
  		var dbObject = myAwesomeDB.collection('DHT_data')

		// Get our values from GET request
		var t = req.query.temp;
		var h = req.query.humidity;	
		//var nDate = new Date();
		var nDate = new Date().toLocaleString('pl', { timeZone: 'Europe/Warsaw'});
                console.log(nDate);
	
		if(h>=0){
			dbObject.insert({ "date" : nDate, "temp" : t, "wilg" : h }, function (err, doc) {
              			if (err) {
					console.log("DB error:");
					console.log(err);
                  			// If it failed, return error
                  			res.send("There was a problem adding the information to the database.");                        
				}else{        
                                	// And forward to succes
					res.send("Data sent correctly.");

					// POST to SMART-STORM API   
					send_data_smartStorm(t, h); }
				}
			);
		}
	});
});                                                                                                                                                                      


// POST to SMART-STORM API
function send_data_smartStorm(t, h){
	var request = require('request');

	request.post(
        	'http://alfa.smartstorm.io/api/v1/measure',
                { json: {"user_id": "hudzik.cezary@gmail.com",
                         "sensor_id": "5a5e170d2a455b457fba8271",
                          "desc" : "some_random_description",
                          "measure_value" : t} },
                 function (error, response, body) {
                 	if (!error && response.statusCode == 200) {
                        	//console.log(body)
				console.log("smart_ok");
                        }});
	request.post(
                'http://alfa.smartstorm.io/api/v1/measure',
                 { json: {"user_id": "hudzik.cezary@gmail.com",
                          "sensor_id": "5a5e17422a455b457fba8272",
                          "desc" : "some_random_description",
                          "measure_value" : h} },
                 function (error, response, body) {
                 	if (!error && response.statusCode == 200) {
                        	//console.log(body)
                        }});
};



app.listen("_your_local_ip_address_",function(){


console.log('server is up');

});

