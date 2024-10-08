import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

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

export {app}