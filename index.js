const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://arfin_24:${process.env.DB_PASS}@cluster0.cqu6n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("packages");
        const haiku = database.collection("package");
        const userPackage = database.collection("userpackage")

        // create a document to insert
        app.post('/packages', async (req, res) => {
            const package = req.body;
            const result = await haiku.insertOne(package);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result)
        })

        // create a document to insert for specific user
        app.post('/mypackages', async (req, res) => {
            const package = req.body;
            const result = await userPackage.insertOne(package);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result)
        })

        // get many document
        app.get('/allpackages', async (req, res) => {
            const cursor = haiku.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        // get many document for specific user
        app.get('/mypackage', async (req, res) => {
            const cursor = userPackage.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        // get a document
        app.get('/allpackages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await haiku.findOne(query);
            res.json(result);
        })

        // delete a document
        app.delete('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await haiku.deleteOne(query);
            res.json(result);
        })

        // delete a document
        app.delete('/mypackage/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await userPackage.deleteOne(query);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello');
})

app.listen(port, () => {
    console.log(`server started at port ${port}`);
})