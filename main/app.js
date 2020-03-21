const express = require('express');
const bodyParser = require('body-parser');
const jsonxml = require('jsontoxml');
const mysql = require('mysql');
const app = express();

app.use(bodyParser.json({ extended: true }));

const dbCredentials = {
    host: "mszymkowiak.mysql.database.azure.com",
    user: "mszymkowiak@mszymkowiak",
    password: "Tester123!",
    database: "azure_be"
};

app.get('/rss/', function (req, res) {

    let sql = "SELECT * FROM rss";

    let con = mysql.createConnection(dbCredentials);

    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(jsonxml(result));
        });
    });
});

app.get('/rss/:rssId', function (req, res) {

    let sql = `SELECT * FROM rss WHERE id=${req.params.rssId};`;

    let con = mysql.createConnection(dbCredentials);

    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(jsonxml(result));
        });
    });
});

app.post('/rss/save', function (req, res) {

    if(req.body.email == null || req.body.title==null || req.body.description==null){
        console.log("Failed to add RSS");

        res.status(404).send({Error: "Required fields: [ email, title, description ]"});
    }else {

        console.log("Creating new RSS");

        let response = {
            "email": req.body.email,
            "title": req.body.title,
            "description": req.body.description
        };

        let sql = "INSERT INTO rss (title,description,email) VALUES ("+"'"+response.title+"','"+response.description+"','"+response.email+"');";
        let con = mysql.createConnection(dbCredentials);

        con.connect(function(err) {
            if (err) throw err;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        });

        res.status(201).send(jsonxml(response));
    }
});

app.get('/rss/send', function (req, res) {
    res.sendStatus(204);
});

app.delete('/rss/:rssId', function (req, res) {

    let sql = "DELETE FROM rss WHERE id="+req.params.rssId+";";

    let con = mysql.createConnection(dbCredentials);

    con.connect(function(err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.sendStatus(204);
        });
    });
});

let server = app.listen(8081, function () {
    let host = server.address().address;
    let port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
});