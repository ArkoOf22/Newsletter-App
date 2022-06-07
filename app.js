const express = require('express');
const bp = require('body-parser');
const request = require('request');
const https = require('https');
//const superA = require('superagent');

const app = express();
app.use(express.static("public"));
app.use(bp.urlencoded({
    extended: true
}));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/" + "signup.html");
});

app.post("/", (req, res) => {
    const firstname = req.body.Fname;
    const lastname = req.body.Lname;
    const email = req.body.email;


    //Making a JSON to send to MailChimp API

    const data = {
        members: [{
            'email_address': email,
            'status': 'subscribed',
            'merge_fields': {
                'FNAME': firstname,
                'LNAME': lastname
            }
        }]
    }

    //need to convert the JSON to String

    var jsonData = JSON.stringify(data);

    //url of the API to send the string

    const url = "https://us14.api.mailchimp.com/3.0/lists/784fee23e8";

    //Options added as required for authorisation
    const options = {
        method: "POST",
        auth: "Arkodeep73:177c773fb8fe428a839cb01d0f020c0a-us14"
    }

    //http request needed as we need to send the String to the API
    //we are making a get request to the MailChimp API

    //
    //                  get            get
    //          CLIENT------>MY SERVER------>API SERVER
    //                <------         <------
    //                  resp           resp             
    //
    //
    //


    const request1 = https.request(url, options, (response) => {
        response.on("data", (data) => {
            console.log(JSON.parse(data));


            //Now lets talk about the response the user would be 
            //getting on entering the details
            if (response.statusCode == 200)
                res.sendFile(__dirname + "/success.html")
            else
                res.sendFile(__dirname + "/failure.html");
        })
    })
    request1.write(jsonData);
    request1.end();



});
app.post('/failure', (req, res) => {
    res.redirect("/");
});

//Now incase of local server we are using PORT 3000,
//but if we need to deploy using any server, we use
//process.env.PORT instead of 3000
//

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is up and Running!");
});



///Mailchimp Api key : 177c773fb8fe428a839cb01d0f020c0a-us14

//Mailchimp Audience ID: 784fee23e8