var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get("/", function (request, response) {
    fs.readFile("index.html", function (error, data) {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.write(data.toString());
        response.end();

    });
});
username = '#redmine@aclub';
password = 'RedMine';


var ActiveDirectory = require('activedirectory');
var config = {url: 'ldap://mow2dc1.aeroclub.int:389,dc=aeroclub,dc=int',
    baseDN: 'dc=aeroclub,dc=int',
    username: username,
    password: password};
var ad = new ActiveDirectory(config);

app.post('/login', function (req, res, next) {
    usr = req.param('username');
    pass = req.param('password');
    ad.authenticate(usr + '@aclub', pass, function (err, auth) {
        if (err) {
            res.write('ERROR: ' + JSON.stringify(err));
            res.end();
            return;
        }
        if (auth) {
            ad.findUser(usr, function (err, user) {
                if (err) {
                    res.write('ERROR: ' + JSON.stringify(err));
                    return;
                }

                if (!user)
                    res.write('User: ' + usr + ' not found.');
                else{
                    res.write('Authenticated!\n');
                    res.write(JSON.stringify(user));
                    
                }
                res.end();
            });

        } else {
            res.write('Authentication failed!');
            res.end();

        }
    });

});
app.listen(3000);
console.log('Start localhost:3000');


