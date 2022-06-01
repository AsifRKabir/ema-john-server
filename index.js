const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0z4j5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_PRODUCT_COLLECTION}`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_ORDERS_COLLECTION}`);

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productsCollection.insertOne(product)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            console.log(result);
            res.send(result.acknowledged);
        })
    })

});


app.listen(port);