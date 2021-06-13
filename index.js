const express = require('express')
var bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

// const uri = "mongodb+srv://organicUser:saiedafride11@cluster0.jumub.mongodb.net/organicdb?retryWrites=true&w=majority";
var uri = "mongodb://organicUser:saiedafride11@cluster0-shard-00-00.jumub.mongodb.net:27017,cluster0-shard-00-01.jumub.mongodb.net:27017,cluster0-shard-00-02.jumub.mongodb.net:27017/organicdb?ssl=true&replicaSet=atlas-20e537-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  // res.send('hello world');
  res.sendFile(__dirname + '/index.html');
})



// client.connect(err => {
//     // console.log(err);
//   const collection = client.db("organicdb").collection("products");
//         console.log("Database connected")
// //   client.close();
// });

// client.connect(err => {
//     // console.log(err);
//         const collection = client.db("organicdb").collection("products");
//         const product = {name: "modho", price: 25, quantity: 20}
//         collection.insertOne(product)
//         .then(result => {
//           console.log('One Product Added Successfully')
//         })
//         console.log("Database connected")
// //   client.close();
// });

client.connect(err => {
    // console.log(err);
        const productCollection = client.db("organicdb").collection("products");

        app.get("/products", (req, res) => {
          productCollection.find({}).limit(10)
          .toArray((err, documents) => {
            res.send(documents)
          })
        })

        app.post("/addProduct", (req, res) => {
          const product = req.body;
          // console.log(product);
          productCollection.insertOne(product)
          .then(result => {
            console.log("Product added successfully")
            // res.send("successfully");
            res.redirect('/')
          })
        })
        console.log("Database connected")


        app.patch('/update/:id', (req, res) => {
          productCollection.updateOne({_id: ObjectId(req.params.id)},
          { 
            $set: {price: req.body.price, quantity: req.body.quantity}
          })
          .then(result => {
            // console.log(result);
            res.send(result.modifiedCount > 0)
          })
        })

        app.get('/product/:id', (req, res) => {
          productCollection.find({})
          .toArray((err, documents) => {
            res.send(documents[0])
          })
        })

        app.delete('/delete/:id', (req, res) => {
          // console.log(req.params.id);
          productCollection.deleteOne({_id: ObjectId(req.params.id)})
          .then(result => {
            // console.log(result);
            res.send(result.deletedCount > 0)
          })
        })

        
});



app.listen(3000)
