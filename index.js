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
    const orderCollection = database.collection("orders");
    const adminCollection = database.collection("admin");

    // GET API - View ONE
    app.get("/alltour/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await collection.findOne(query);
      res.send(tour);
    });
    // GET API - View ALL
    app.get("/alltour", async (req, res) => {
      const tourList = collection.find({});
      const allTour = await tourList.toArray();
      res.send(allTour);
    });
    //GET API - MY Order - Admin
    app.get("/orderlist", async (req, res) => {
      const orderList = orderCollection.find({});
      const allOrder = await orderList.toArray();
      res.send(allOrder);
    });

    //GET API - MY Order - USer
    app.get("/orderlist/:email", async (req, res) => {
      const singleOrder = req.params.email;
      const order = orderCollection.find({ userEmail: singleOrder });
      const result = await order.toArray();
      res.send(result);
    });

    // POST API - Add Tour
    app.post("/addtour", async (req, res) => {
      const newTour = req.body;
      const result = await collection.insertOne(newTour);
      res.json(result);
    });
    //Delete API - Delete Tour
    app.delete("/alltour/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await collection.deleteOne(query);
      res.json(result);
    });

    // POST API -  Add Order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });
    // POST API -  Add Admin
    app.post("/addadmin", async (req, res) => {
      const admin = req.body.email;
      const adminCheck = await adminCollection.find({ admin: admin }).toArray();
      if (adminCheck.length !== 0) {
        res.json({ success: "OK" });
      } else {
        const result = await adminCollection.insertOne({ admin });
        res.json({ success: "Inserted" });
      }
    });

    //GET API - Admin
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const admin = adminCollection.find({ admin: email });
      const result = await admin.toArray();
      console.log(result);
      if (result.length > 0) {
        res.send({ success: "Ok" });
      }else{
        res.send({ error: "Normal User" });
      }
      // res.send(result);
    });

    console.log("Connected");
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
