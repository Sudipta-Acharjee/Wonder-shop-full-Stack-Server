const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f3vnz.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(process.env.DB_USER, process.env.DB_PASS, process.env.DB_Name)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("wonderShop").collection("products");

  app.post('/addCheck', (req, res) => {
    const newBooking = req.body;
    productsCollection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    console.log(newBooking)
  })

  app.get('/bookings', (req, res) => {
    productsCollection.find({ email: req.body.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event:', newEvent)
    productsCollection.insertOne(newEvent)
      .then(result => {
        console.log('inserted Count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({}).limit(6)
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/events', (req, res) => {
    productsCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

});

app.listen(process.env.PORT || port)