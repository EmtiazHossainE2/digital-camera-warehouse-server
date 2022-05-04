//1
const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//3 
const cors = require('cors');
require('dotenv').config()

//4 middleware 
app.use(cors())
app.use(express.json())

//5 mongo connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntqc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//6 
async function run() {
    try {
        //7
        await client.connect();
        const cameraCollection = client.db("warehouse").collection("camera");

        //8 get all camera
        app.get('/product', async (req, res) => {
            //15 pagination 
            const page = parseInt(req.query.page)
            const pageProduct = parseInt(req.query.pageProduct)
            const query = {}
            const cursor = cameraCollection.find(query)
            let products ;
            if(page || pageProduct){
                products = await cursor.skip(page*pageProduct).limit(pageProduct).toArray()
            }
            else{
                products = await cursor.toArray()
            }
            res.send(products)
            
        })

        //13 my items 
        app.get('/my-items' , async(req,res) => {
            const headerAuth = req.headers.authorization
            console.log(headerAuth);
            const email = req.query.email ;
            const query = {email : email} 
            console.log(query);
            const cursor = cameraCollection.find(query)
            const myItems = await cursor.toArray()
            res.send(myItems)
        })

        //9 get one camera
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const camera = await cameraCollection.findOne(query)
            res.send(camera)
        })

        //12 Stoke item api 
        app.post('/product' , async(req,res) => {
            const product = req.body 
            const result = await cameraCollection.insertOne(product)
            res.send(result)
        })

        // {name,description,price,quantity,img,supplier,afPoints , brand,brandId,modes,movieType,sold,ratings}


        //11 delete product 
        app.delete('/product/:id' , async(req,res) => {
            const id = req.params.id 
            const query = {_id:ObjectId(id)}
            const camera = await cameraCollection.deleteOne(query)
            res.send(camera)
        })


        //10 delivered (update )
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id
            const updateCamera = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateCamera.quantity,
                    // name: updateCamera.name,
                    // description: updateCamera.description,
                    // price: updateCamera.price,
                    // quantity: updateCamera.quantity,
                    // img: updateCamera.img,
                    // supplier: updateCamera.supplier,
                    // afPoints: updateCamera.afPoints,
                    // modes: updateCamera.modes,
                    // movieType: updateCamera.movieType,
                    // brand: updateCamera.brand,
                    // brandId: updateCamera.brandId,
                    // sold: updateCamera.sold,
                    // ratings: updateCamera.ratings
                },
            };
            const result = await cameraCollection.updateOne(filter, updateDoc, options);
            res.send(result)
            
        })

        //14 pagination    
        app.get('/cameraCollection', async (req, res) => {
            const count = await cameraCollection.estimatedDocumentCount()
            res.send({ count })
        })

        //15 jwt (json web token)
        app.post('/login' , async(req,res) =>{
            const user = req.body 
            const accessToken = jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {expiresIn : '1d'})
            res.send(accessToken)
        })


    }

    finally {
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Digital Camera Warehouse Server Running')
})
app.listen(port, () => {
    console.log("Warehouse running on ", port);
})