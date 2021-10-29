const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uana9.mongodb.net/DhakaTravelAgencyDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("DhakaTravelAgencyDB");
    const collection = database.collection("tour");
    // GET API - View ONE
    app.get( "/alltour/:id", async(req,res)=>{
      const id =req.params.id;
      const query = {_id: ObjectId(id)};
      const tour = await collection.findOne(query);
      res.send(tour);
    } )
    // GET API - View ALL 
    app.get("/alltour", async(req, res)=>{
      const tourList = collection.find({});
      const allTour = await tourList.toArray();
      res.send(allTour)
    })

    // POST API - Add Tour
    app.post("/addtour", async (req, res) => {
      const newTour = req.body;
      const result = await collection.insertOne(newTour);
      res.json(result)
    } )
    //Delete API - Delete Tour
    app.delete("/alltour/:id", async (req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await collection.deleteOne(query)
      res.json(result)
    })


    console.log('Connected');
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello NODE!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
