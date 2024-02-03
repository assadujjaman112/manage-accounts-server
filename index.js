const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knxp44y.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const accountCollection = client
      .db("manageAccountsDB")
      .collection("accounts");
      
    app.post("/accounts", async(req, res) => {
        const account = req.body;
        const result = await accountCollection.insertOne(account);
        res.send(result)
    })  

    app.get("/accounts", async (req, res) => {
      const result = await accountCollection.find().toArray();
      res.send(result);
    });

    app.get("/accounts/:email", async(req, res) => {
        const email = req.params.email;
        console.log(email);
        const query = {email : email};
        const result = await accountCollection.findOne(query);
        res.send(result);
    })

    app.patch("/accounts/:email", async(req, res) => {
        const account = req.body;
        const email = req.params.email;
        const filter = {email : email};
        console.log(email)
        const updatedAccount = {
            $set : {
                name : account.name,
                email : account.email,
                image : account.image
            }
        }
        const result = await accountCollection.updateOne(filter, updatedAccount);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Manage accounts server is running....");
});
app.listen(port, () => {
  console.log(`Manage account server is running on port ${port}`);
});
