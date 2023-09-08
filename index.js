
const express =require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config()
//middleware
app.use(cors())
app.use(express.json())
//uri


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xn4aldo.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
  
    await client.connect();

    const database = client.db("taskDB");
    const userCollection = client.db('taskDB').collection("users");
    const taskCollection = client.db('taskDB').collection("tasks");

    app.post('/task', async(req, res)=>{
        const user =req.body;
        // console.log('new user', user);
        const result = await taskCollection.insertOne(user);
        res.send(result);
      })
 

    app.get('/task', async(req, res)=>{
      const cursor =taskCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/users', async(req, res)=>{
      const cursor =userCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/users', async(req, res)=>{
      const user =req.body;
      console.log('new user', user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Simple crud is running')
})

app.listen(port, () => {
  console.log(`Simple crud is running on port ${port}`)
})

