var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
//var verifier = require('alexa-verifier-middleware');
var unirest = require('unirest');

var app = express();
var alexaRouter = express.Router();
app.use("/alexa", alexaRouter);
//alexaRouter.use(verifier);
alexaRouter.use(bodyParser.json());

app.use("/ping", function (req, res, next) {
    res.send('Welcome to Cooking Service');
});

var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log("Server is up and running on port 3000...");
});

alexaRouter.post('/cookingApi', function (req, res) {
    console.log('sono in cookingApi ');
    /*res.json({
        "version": "1.0",
        "response": {
          "shouldEndSession": true,
          "outputSpeech": {
            "type": "PlainText",
            "text": "Welcome to Henry's Cooking App"
          }
        }
      });  */  
    if (req.body.request.type === 'LaunchRequest') {
        res.json({
            "version": "1.0",
            "response": {
              "shouldEndSession": false,
              "outputSpeech": {
                "type": "PlainText",
                "text": "Welcome to Henry's Cooking App"
              }
            }
          });    
    }
    else if (req.body.request.type === 'IntentRequest' &&
             req.body.request.intent.name === 'GetCookingIntent') {     
       // BuildGetCookingInstruction(req, res);   
       res.json({
        "version": "1.0",
        "response": {
          "shouldEndSession": false,
          "outputSpeech": {
            "type": "PlainText",
            "text": "Sono nel intent di Cooking"
          }
        }
      });  
    } 
    else if (req.body.request.type === 'SessionEndedRequest') { 
        console.log('Session ended', req.body.request.reason);
    } else if (req.body.request.type === 'IntentRequest'  &&
    req.body.request.intent.name === 'HelpIntent') { 
        console.log('Hai chiesto aiuto');
        res.json({
            "version": "1.0",
            "response": {
              "shouldEndSession": false,
              "outputSpeech": {
                "type": "PlainText",
                "text": "Puoi chiedermi come  preparare o cucinare un cibo"
              }
            }
          });  
    } else if (req.body.request.type === 'IntentRequest'  &&
    req.body.request.intent.name === 'CancelIntent') { 
        console.log('Vuoi uscire');
        res.json({
            "version": "1.0",
            "response": {
              "shouldEndSession": true,
              "outputSpeech": {
                "type": "PlainText",
                "text": "Ok, chiudo la sessione. Quando vuoi, dì Alexa apri cooking"
              }
            }
          });  
    }
    
});
//AMAZON.CancelIntent

/*
function BuildGetCookingInstruction(req, res) {
    var url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?';
    url += 'number=3&offset=0&instructionsRequired=true';

    var request = req.body.request;
    if(request.intent.slots.Foods.value) {
        var foodName = request.intent.slots.Foods.value;
        url += `&query=${foodName}`;
    }
    if(request.intent.slots.DietTypes.value) {
        var dietTypes = request.slots.intent.DietTypes.value;
        url += `&diet=${dietTypes}`;
    }

    unirest.get(url)
        .header("X-Mashape-Key", "your spoonacular key goes here")
        .header("X-Mashape-Host", "spoonacular-recipe-food-nutrition-v1.p.mashape.com")
        .end(function (result) {
            var dishTitle = '';
            for(i=0; i < result.body.results.length; i++) {
                dishTitle += result.body.results[i].title + ', ';
            }                
            var responseText = `I found following dishes that you can cook ${dishTitle}`;                
            res.json({
                "version": "1.0",
                "response": {
                    "shouldEndSession": true,
                    "outputSpeech": {
                    "type": "PlainText",
                    "text": responseText
                    }
                }
            }); 
        }); 

};*/