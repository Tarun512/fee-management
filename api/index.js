import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to mongodb!");
}).catch((err)=>{
    console.log(err);
})
const app = express();
const port = process.env.PORT 
app.listen(port,()=>{
    console.log(`App is listeing at ${port}`);
})
export default app;