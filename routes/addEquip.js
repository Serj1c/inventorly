import express from 'express';
import redis from 'redis';
import handlebars from 'express-handlebars';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';

app.post('/user/add', function(req, res) {
    let id = req.body.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;

    client.hset(id, [
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'phone', phone
    ], function(err, reply) {
        if (err) {
            console.error(err);
        }
        console.log(reply)
        res.redirect('/');
    })
});