//1
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//3 
const cors = require('cors');
require('dotenv').config()

//4 middleware 
app.use(cors())
app.use(express.json())

//5 mongo 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntqc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//   const collection = client.db("test").collection("devices");

//6 
async function run() {
    try {
        await client.connect();
        const cameraCollection = client.db("warehouse").collection("camera");

        //get 
        app.get('/product' , async(req,res) => {
            const query = {} 
            const cursor = cameraCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })


    }

    finally {
        //await client.close();
    }
}
run().catch(console.dir);


//2
app.get('/', (req, res) => {
    res.send('Digital Camera Warehouse Server Running')
})
app.listen(port, () => {
    console.log("Warehouse running on ", port);
})