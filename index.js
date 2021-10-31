const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;


// middleware 

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvsmm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run(){
    try{
        await client.connect();
       const database = client.db('tourX');
       const offerCollection = database.collection('offers');
       const orderCollection = database.collection('orders');

    //    get api

    app.get('/offers', async (req, res )=>{
        
        const cursor = offerCollection.find({});
        const offers = await cursor.toArray();
        res.send(offers);
       
    });

    // get single offer
    app.get('/offers/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const offer = await offerCollection.findOne(query);
        res.json(offer);
        
    });


     app.get('/single-order/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const offer = await orderCollection.findOne(query);
        res.json(offer);
        
    })

    // add order api 
    app.post('/orders', async(req, res) =>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result);
    })

    // user order 
    app.get('/order/:id', async (req, res) =>{
        const uid =[req.params.id];
        const query = {uid: {$in: uid}};
        const result = await orderCollection.find(query).toArray();
        res.json(result);
    })
    // post api 
    app.post('/offers', async(req, res) =>{

        const offer = req.body;
        console.log('hit the api', offer);
        
    const result = await offerCollection.insertOne(offer);
    console.log(result);
    res.json(result);
    res.send('post hitted');
    });

    // order manage api 
        app.get('/all-orders', async (req, res )=>{
        
        const cursor = orderCollection.find({});
        const offers = await cursor.toArray();
        res.send(offers);
       
    });

    // put api 
    app.put('/order-status/:id', async(req, res) =>{
        const id = req.params.id;
        const order = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
         $set: {
            status: order.status
        },
        };
        const result = await orderCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    });



    // delete 

    app.delete('/order/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
        res.json(result);
    })

    }
    finally{
        // await client.close();
    }

}

run().catch(console.dir);
app.get('/', (req, res) =>{
    res.send('Tour-x server running');

});

app.listen(port, () =>{
    console.log('Server running at port', port);
})
