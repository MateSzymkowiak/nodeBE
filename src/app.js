const express = require('express');
const bodyParser = require('body-parser');
const jsonxml = require('jsontoxml');
const mysql = require('mysql');
const cors = require('cors');
const emailSender = require('./email');

// Create table rss(
//     id int(6) PRIMARY KEY AUTO_INCREMENT NOT NULL,
//     title varchar(255) NOT NULL,
//     header varchar(255) NOT NULL,
//     description varchar(1023) NOT NULL,
//     email varchar(255) NOT NULL
// );

const app = express();
app.use(cors());
app.use(bodyParser.json({extended: true}));
const port = process.env.PORT || 3000;

const dbCredentials = {
    host: "mszymkowiak.mysql.database.azure.com",
    user: "mszymkowiak@mszymkowiak",
    password: "Tester123!",
    database: "azure_be"
};

app.set('port', port);

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

    let sql = `SELECT * FROM rss WHERE id="${req.params.rssId}";`;

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

    if (req.body.mail == null || req.body.title == null || req.body.header == null) {
        console.log("Failed to add RSS");

        res.status(400).send({Error: "Required fields: [ email, title, header ]"});
    } else {

        console.log("Creating new RSS");

        let sql = `INSERT INTO rss (title,header,description,email) VALUES ("${req.body.title}","${req.body.header}","${req.body.description}","${req.body.mail}");`;
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

    if (req.body.mail == null || req.body.title == null || req.body.header == null) {
        console.log("Failed to add RSS");

        res.status(400).send({Error: "Required fields: [ email, title, header ]"});
    } else {

        let sql = `INSERT INTO rss (title,header,description,email) VALUES ("${req.body.title}","${req.body.header}","${req.body.description}","${req.body.mail}");`;
        let con = mysql.createConnection(dbCredentials);

        con.connect(function (err) {
            if (err) throw err;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });

            sql = `SELECT * FROM rss ORDER BY id DESC LIMIT 1;`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                emailSender(req.body.mail, req.body.title,  req.body.header,  req.body.description);
                    res.status(201).send(result);
            });
        });
    }
});

app.delete('/rss/:rssId', function (req, res) {

    let sql = `DELETE FROM rss WHERE id="${req.params.rssId} ";`;

    let con = mysql.createConnection(dbCredentials);

    con.connect(function (err) {
        if (err) throw err;
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.sendStatus(204);
        });
    });
});

let server = app.listen(port, function () {
    console.log(`Example app listening at ${port}`)
});