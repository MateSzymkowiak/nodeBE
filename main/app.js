const express = require('express');
const bodyParser = require('body-parser');
const jsonxml = require('jsontoxml');
const mysql = require('mysql');
const cors = require('cors');
const emailSender = require('./email');


const app = express();
app.use(cors());
app.use(bodyParser.json({extended: true}));

const dbCredentials = {
    host: "localhost",
    user: "root",
    password: "",
    database: "azure_be"
};

app.get('/rss/', function (req, res) {

    let sql = "SELECT * FROM rss";

    let con = mysql.createConnection(dbCredentials);

    con.connect(function (err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            res.send(result);
        });
    });
});

app.get('/rss/:rssId', function (req, res) {

    let sql = `SELECT * FROM rss WHERE id=${req.params.rssId};`;

    let con = mysql.createConnection(dbCredentials);

    con.connect(function (err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.send(jsonxml(result));
        });
    });
});

app.post('/rss/save', function (req, res) {

    if (req.body.email == null || req.body.title == null || req.body.header == null) {
        console.log("Failed to add RSS");

        res.status(400).send({Error: "Required fields: [ email, title, header ]"});
    } else {

        console.log("Creating new RSS");

        let sql = "INSERT INTO rss (title,header,description,email) VALUES (" + "'" + req.body.title + "','" + req.body.header + "','" + req.body.description + "','" + req.body.email + "');";
        let con = mysql.createConnection(dbCredentials);

        con.connect(function (err) {
            if (err) throw err;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });

            sql = `SELECT * FROM rss ORDER BY id DESC LIMIT 1;`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.status(201).send(result);
            });
        });
    }
});

app.post('/rss/send', function (req, res) {

    if (req.body.email == null || req.body.title == null || req.body.header == null) {
        console.log("Failed to add RSS");

        res.status(400).send({Error: "Required fields: [ email, title, description ]"});
    } else {

        let sql = "INSERT INTO rss (title,header,description,email) VALUES (" + "'" + req.body.title + "','" + req.body.header + "','" + req.body.description + "','" + req.body.email + "');";
        let con = mysql.createConnection(dbCredentials);

        con.connect(function (err) {
            if (err) throw err;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });

            sql = `SELECT * FROM rss ORDER BY id DESC LIMIT 1;`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                emailSender(req.body.email, req.body.title,  req.body.header,  req.body.description);
                    res.status(201).send(result);
            });
        });




    }
});

app.delete('/rss/:rssId', function (req, res) {

    let sql = "DELETE FROM rss WHERE id=" + req.params.rssId + ";";

    let con = mysql.createConnection(dbCredentials);

    con.connect(function (err) {
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