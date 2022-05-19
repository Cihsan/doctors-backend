const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors') //support diffrent port
require('dotenv').config()// for envirment variable
const port = process.env.PORT || 5000
const app = express()
const jwt = require('jsonwebtoken');
app.use(cors()) //
app.use(express.json()) //for parse

app.get('/', (req, res) => {
    res.send('Welcome To Doctors-Portal Server')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ln8eq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()

        const doctPortal = client.db("doctor-service").collection("services");
        const bookedCollection = client.db("booked-service").collection("booked");
        const userCollection = client.db("user-service").collection("users");

        //get
        app.get('/services', async (req, res) => {
            const query = {}
            const result = await doctPortal.find(query).toArray()
            res.send(result)
        })

        //modal
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = { treatment: booking.treatment, date: booking.date, patient: booking.patient }
            const exists = await bookedCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, booking: exists })
            }
            const result = await bookedCollection.insertOne(booking);
            return res.send({ success: true, result });
        })
        //myappointment
        app.get('/booking', async (req, res) => {
            const patient = req.query.patient
            const authorization = req.query.authorization
            const query = {}
            const result = await bookedCollection.find(query).toArray()
            res.send(result)
        })
        //myappointment
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookedCollection.deleteOne(query)
            res.send(result)
        })
        //Sign Up or social login
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const filter = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user,
            }
            const result = await userCollection.updateOne(filter, updateDoc, options)
            const token = jwt.sign({ email: email }, process.env.VALID_TOKEN,/* { expiresIn: '1h' } */)
            res.send({ result, token })
        })
        app.get('/user', async (req, res) => {
            const query = {}
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })
        /* app.delete('/my-items/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await myItemStore.deleteOne(query)
            const result1 = await goodsStore.deleteOne(query)
            res.send(result)
        }) */
        //Home
        /* app.get('/home', async (req, res) => {
            const query = {}
            const allProduct = goodsStore.find(query)
            const product = await allProduct.toArray()
            res.send(product)
        }) */

        /* app.get('/all-products', async (req, res) => {
            const query = {}
            const allProduct = goodsStore.find(query)
            const product = await allProduct.toArray()
            res.send(product)
        }) */

        /* app.delete('/all-products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await goodsStore.deleteOne(query)
            res.send(result)
        }) */

        /* app.post('/add-product', async (req, res) => {
            const newPD = req.body
            const result = await goodsStore.insertOne(newPD);
            const result1 = await myItemStore.insertOne(newPD);
            res.send({ success: 'Added Product Successfully' })
            
        }) */

        //login
        /* app.post('/loginSM', async (req, res) => {
            const email = req.body
            const token = jwt.sign(email, process.env.VALID_TOKEN);
            console.log(token);
            res.send({ token })
        }) */

        /* app.post('/login', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.VALID_TOKEN, {
                expiresIn: '1d'
            });
            res.send({ token });
        }) */

        //Update
        /* app.get('/update/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await goodsStore.findOne(query)
            res.send(result)
        })
        */

        /* app.put('/update/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const decreaseInfo = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    qt: decreaseInfo.quantity,
                }
            }
            const result = await goodsStore.updateOne(filter, updateDoc, options)
            res.send(result)
        }) */

        /* app.put('/update/:id', async (req, res) => {
            const id = req.params.id
            const newQuantity = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    qt: newQuantity.qt,
                }
            }
            const result = await goodsStore.updateOne(filter, updateDoc, options)
            res.send(result)
        }) */

    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Show Here ${port}`)
})


