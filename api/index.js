import dotenv from 'dotenv'
import connectDB from './src/db/index.js'
import { app } from './src/app.js';

dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 8800;

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log("Server is running at port: ",port )
    })
}).catch((err) => {
    console.log("MongodB connection failed")
})