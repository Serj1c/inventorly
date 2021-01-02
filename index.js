const express= require('express');
const redis = require('redis');
const handlebars = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

const app = express();

const client = redis.createClient();
client.on('connect', () => {
    console.log('Redis is here!')
})

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// view engine
app.engine('handlebars', handlebars({default: 'main'}))
app.set('view engine', 'handlebars')

// Method Override
app.use(methodOverride('_method'));

app.get('/', (req, res, next) => {
    res.render('searchusers')
});

app.post('/user/search', function(req, res, next){
    let id = req.body.id;
  
    client.hgetall(id, function(err, obj){
      if(!obj){
        res.render('searchusers', {
          error: 'Equipment does not exist'
        });
      } else {
        obj.id = id;
        res.render('details', {
          user: obj
        });
      }
    });
  });

  // add user page
  app.get('/user/add', (req, res, next) => {
    res.render('adduser')
});

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

// delete user
app.delete('/user/delete/:id', function(req, res) {
    client.del(req.params.id);
    res.redirect('/');
});