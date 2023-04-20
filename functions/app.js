// Requiring all the packages.
const express = require('express');
const app = express();
require('dotenv').config();
const request = require("request");
const bodyParser = require('body-parser');
const https = require('node:https');
const serverless = require('serverless-http');

// Initializing all the keys and URL.
const AUDIENCE_KEY = process.env.AUDIENCE_KEY;
const URL = process.env.URLI + AUDIENCE_KEY;
const API_KEY = process.env.API_KEY;

// Adding the access to local files to render them on server.
app.use(express.static(__dirname));
app.use("/styles", express.static(+ '/styles'));
app.use(bodyParser.urlencoded({extended:true}));

// Send the Homepage.
app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/signup.html");
})


app.post('/', (req, res)=>{

    // Getting the details of the user by using body parser.
    var mail = req.body.mail;
    var fname = req.body.fname;
    var lname = req.body.lname;

    // Creating the data object to be added.
    var data = {
        members:[
            {
                "email_address": mail,
                "status": "subscribed",
                "merge_fields": {
                    "FNAME": fname,
                    "LNAME": lname
                  }
              
            }
        ]
    }

    // Stringifying the data.
    const jsonData = JSON.stringify(data);

    // Making the request.
    const options = {
        method: "POST",
        auth: "butta:"+ API_KEY,
    }

    // In order to send data, we have to save the request in a 
    // variable and then we send this to mailchimp using req.write method.
    // Establishing a connection
    const request = https.request(URL, options, (resp)=>{
        if(resp.statusCode === 200)
        res.sendFile(__dirname+"/success.html");
        else
        res.sendFile(__dirname+"/failure.html")
    })

    request.write(jsonData);
    request.end();
})

app.post("/backToMain", function (req,res){
    res.redirect('/');
  });

app.post("/failure", function(req, res) {
    res.redirect("/");
  }); 

app.listen(process.env.PORT || 3000, function(){
    console.log("The port has started listening.....");
})

module.exports.handler = serverless(app);

// Dynamic port
// As we deploy at outerspace. We added 3000 part for the local system