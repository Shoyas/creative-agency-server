const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0wqac.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express();

app.use(bodyParser.json());
app.use(cors());


const port = 5000;

app.get('/', (req, res) => {
    res.send("Hi, I am MongoDB")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const clientOrderCollection = client.db("creativeAgency").collection("clientOrder");
  
  app.post('/addClientOrder', (req, res) => {
      const clientOrder = req.body;
      clientOrderCollection.insertOne(clientOrder)
      .then(result => {
          alert('Thanks for your order.');
          res.send(result.insertedCount > 0)
      })
  });

  app.get('/getAllClientsOrder', (req, res) => {
        clientOrderCollection.find({})
        .toArray((error, documents) => {
            res.send(documents);
        })
   });

   app.get('/getAllClientsOrder', (req, res) => {
    clientOrderCollection.find({email: req.query.email})
    .toArray((error, documents) => {
      res.send(documents);
      
    })
  })

   
  
});



app.listen(process.env.PORT || port)