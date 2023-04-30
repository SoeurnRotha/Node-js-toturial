const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://SoeurnRotha:092671693@soeurnrotha.sgaabdc.mongodb.net/?retryWrites=true&w=majority";
const morgan = require('morgan')
app.use(morgan('dev'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
//fix error
app.use((req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*")
    req.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Control-Type, Accept, Authorzation"

    )

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, POST,PATCH,DELETE' )
        return res.status(200).json({})
    }
    next()
})

app.use((error, req,res, next) =>{
    res.status(error.status || 500);

    res.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app