const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0wqac.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('addService'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("Hi, I am MongoDB")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const clientOrderCollection = client.db("creativeAgency").collection("clientOrder");
  const clientReviewCollection = client.db("creativeAgency").collection("clientReview");
  const adminAddServiceCollection = client.db("creativeAgency").collection("addService");
  
  app.post('/addClientOrder', (req, res) => {
      const clientOrder = req.body;
      clientOrderCollection.insertOne(clientOrder)
      .then(result => {
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
  });

  app.post('/addClientReview', (req, res) => {
    const clientReview = req.body;
    clientReviewCollection.insertOne(clientReview)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  });

  app.get('/getAllClientReview', (req, res) => {
    clientReviewCollection.find({}).limit(6)
    .toArray((error, documents) => {
        res.send(documents);
    })
  });

  app.post('/adminAddService', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    console.log(title, description, file);
    file.mv(`${__dirname}/addService/${file.name}`, error => {
      if(error){
        console.log(error);
        return res.status(500).send({msg: 'Failed to upload image'});
      }
      return res.send({name: file.name, path: `/${file.name}`})
    })
    adminAddServiceCollection.insertOne({title, description, img: file.name})
    .then(result => {
      res.send(result.insertedCount > 0)
    })

  });

  app.get('/getAddedService', (req, res) => {
    adminAddServiceCollection.find({}).limit(6)
    .toArray((error, documents) => {
        res.send(documents);
    })
  });



   
  
});



app.listen(process.env.PORT || port)