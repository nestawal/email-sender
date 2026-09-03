import dotenv from "dotenv";
import {Pool} from 'pg';
import express from 'express';
import userRoute from "./routes/userRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api",userRoute);

const pool = new Pool({connectionString: process.env.DATABASE_URL})

pool.connect()
  .then((client) => {
    console.log("database connected");
    client.release(); // Always release the client back to the pool
    
    app.listen(PORT, () => {
      console.log("3k running");
    });
  })
  .catch((error) => {
    console.log("failed connection", error);
  });