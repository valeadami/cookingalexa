var express = require('express');
var bodyParser = require('body-parser');
var http = require('https');
var querystring = require('querystring');
var path = require("path");
//var verifier = require('alexa-verifier-middleware');
var unirest = require('unirest');
var bot='FarmaInfoBot';
var app = express();
var alexaRouter = express.Router();
app.use("/alexa", alexaRouter);
//alexaRouter.use(verifier);
alexaRouter.use(bodyParser.json());

app.use("/ping", function (req, res, next) {
    res.send('Welcome to Cooking Service');
});
/* configurazione della chiamata  */
postData = querystring.stringify({
    'searchText': 'ciao',
    'user':'',
    'pwd':'',
    'ava':'FarmaInfoBot'
    
  });
const options = {
    //modifica del 12/11/2018 : cambiato porta per supportare HTTPS
    
   hostname: '86.107.98.69', 
  // port: 8080,
   port: 8443,
   rejectUnauthorized: false, // aggiunto qui 12/11/2018 
   path: '/AVA/rest/searchService/search_2?searchText=', 
   method: 'POST', 
   headers: {
     'Content-Type': 'application/json', 
    // 'Content-Length': Buffer.byteLength(postData),
     'Cookie':'' // +avaSession 
   }
 };

var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function () {
    console.log("Server is up and running on port 3000...");
});

alexaRouter.post('/cookingApi', function (req, res) {
    console.log('sono in cookingApi ');
    
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
            callAva(req, res);

         
        
    } else if (req.body.request.type === 'IntentRequest'  && req.body.request.intent.name === 'AMAZON.HelpIntent') { 
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
    } else if (req.body.request.type === 'IntentRequest'  && req.body.request.intent.name === 'AMAZON.StopIntent') { 
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
    } else if (req.body.request.type === 'IntentRequest'  && req.body.request.intent.name === 'AMAZON.CancelIntent') { 
        console.log('Vuoi annullare');
        res.json({
            "version": "1.0",
            "response": {
              "shouldEndSession": false,
              "outputSpeech": {
                "type": "PlainText",
                "text": "Ok, annullo"
              }
            }
          });  
    } else if (req.body.request.type === 'SessionEndedRequest') { 
        console.log('Session ended', req.body.request.reason);
        res.json({
            "version": "1.0",
            "response": {
              "shouldEndSession": true,
              "outputSpeech": {
                "type": "PlainText",
                "text": "Arrivederci"
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
function callAva(req, resp){
    let request = req.body.request;
    let strRicerca='';
    let out='';
    let data='';
    let strOutput='';
    let sessionId = req.body.session.sessionId;
    //bot=req.query.ava;
    console.log('sessionID di Alexa= ' + sessionId);
    //prendo il parametro....slot
    var str=request.intent.slots.food.value;
        if(str) {
            strRicerca = querystring.escape(str);;
            console.log('stringa ricerca  = '+ strRicerca);
            options.path+=strRicerca+'&user=&pwd=&ava='+bot;
        }
        
        
        var req1 = http.request(options, (res) => {
             
            console.log('________valore di options.cookie INIZIO ' + options.headers.Cookie);
            console.log(`STATUS DELLA RISPOSTA: ${res.statusCode}`);
            console.log(`HEADERS DELLA RISPOSTA: ${JSON.stringify(res.headers)}`);
            console.log('..............RES HEADER ' + res.headers["set-cookie"] );
           
            if (res.headers["set-cookie"]){
        
              var x = res.headers["set-cookie"].toString();
              var arr=x.split(';')
              var y=arr[0].split('=');
              
             console.log('id di sessione di ava =' + y[1]);
             
             //scriviSessione(__dirname+'/sessions/',sessionId, y[1]); 
            } 
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
             console.log(`BODY: ${chunk}`);
             data += chunk;
           
             let c=JSON.parse(data);
                    strOutput=c.output[0].output; 
                   
                    strOutput=strOutput.replace(/(<\/p>|<p>|<b>|<\/b>|<br>|<\/br>|<strong>|<\/strong>|<div>|<\/div>|<ul>|<li>|<\/ul>|<\/li>|&nbsp;|)/gi, '');
                    resp.json({
                        "version": "1.0",
                        "response": {
                            "shouldEndSession": false,
                            "outputSpeech": {
                            "type": "PlainText",
                            "text": strOutput
                            }
                        }
                    }); 
                  
                  
            });
            res.on('end', () => {
              console.log('No more data in response.');
              
                   
                    options.path='/AVA/rest/searchService/search_2?searchText=';
                    
                    console.log('valore di options.path FINE ' +  options.path);
        
            });
          });
          
          req1.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            strOutput="si è verificato errore " + e.message;
           
          });  
          
        req1.write(postData);
        req1.end();
        
};