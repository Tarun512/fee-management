import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
const __dirname = path.resolve();

import authRoute from '../src/routes/auth.route.js'
import staffRoute from '../src/routes/staff.route.js'
import studentRoute from '../src/routes/student.route.js'
import paymentRoute from '../src/routes/payment.route.js'
import feeStrucureRoute from '../src/routes/feeStructure.route.js';

app.use('/api/auth', authRoute)
app.use('/api/staff', staffRoute)
app.use('/api/student', studentRoute)
app.use('/api/payment', paymentRoute)
app.use('/api/fees',feeStrucureRoute)

app.use(express.static(path.join(__dirname,'/client/dist')));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
})
export {app}