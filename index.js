import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import "dotenv/config";

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
const facilitiesCollection = client.db("wintercare").collection("facilities");

export async function connectToMongoDB() {
  try {
    await client.connect();

    app.post("/facilities", async (req, res) => {
      const facilities = req.body;
      const result = await facilitiesCollection.insertOne(facilities);
      res.send(result);
    });

    app.get("/facilities", async (req, res) => {
      const result = await facilitiesCollection.find().toArray();
      res.send(result);
    });

    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

app.get("/", (req, res) => {
  res.send("Hellow Shorot!");
});

connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running our port ${PORT}`);
  });
});

