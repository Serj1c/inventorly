import express from 'express';
import { createClient } from 'redis';
import handlebars from 'express-handlebars';
import methodOverride from 'method-override';
import { json, urlencoded } from 'body-parser';

const PORT = process.env.PORT || 5000;

const app = express();

const client = createClient();
client.on('connect', () => {
    console.log('Redis is here!')
})

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
});

app.use(json());
app.use(urlencoded({extended: false}));

// view engine
app.engine('handlebars', handlebars({default: 'main'}))
app.set('view engine', 'handlebars')

// Method Override
app.use(methodOverride('_method'));

app.get('/', (req, res, next) => {
    res.render('searchequip')
});

app.post('/equip/search', function(req, res, next){
    let id = req.body.id;
  
    client.hgetall(id, function(error, obj){
      if(!obj){
        res.render('searchequip', {
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
  app.get('/equip/add', (req, res, next) => {
    res.render('addequip')
});

app.post('/equip/add', function(req, res) {
    let id = req.body.id;
    let type = req.body.type;
    let brand = req.body.brand;
    let price = req.body.price;
    let place = req.body.place;

    client.hset(id, [
        'type', type,
        'brand', brand,
        'price', price,
        'place', place
    ], function(err, reply) {
        if (err) {
            console.error(err);
        }
        console.log(reply)
        res.redirect('/');
    })
});

// delete user
app.delete('/equip/delete/:id', function(req, res) {
    client.del(req.params.id);
    res.redirect('/');
});