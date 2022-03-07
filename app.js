const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");



const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const eMail = req.body.mail;

    const data = 
    {
        members: 
        [
            {
                email_address: eMail,
                status: "subscribed",
                merge_fields: 
                {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url ="https://us14.api.mailchimp.com/3.0/lists/c8681af5f6";
    const options = {
        method: "POST",
        auth: "laban:c85f227be5783be9895d61d0bffbf7d6-us14"
    }
    const request = https.request(url, options, function(response){
        
        if (response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", function(data){
            JSON.parse(data);
        })
    })
    request.write(jsonData);
    request.end();


})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
})

// API KEY
// c85f227be5783be9895d61d0bffbf7d6-us14

// List ID
// c8681af5f6