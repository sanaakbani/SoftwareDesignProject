require('dotenv').config()
const cors = require('cors');
const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    credentials: true // Allow cookies if needed
  }));
  
mongoose.connect('mongodb://localhost/subscribers', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)

app.listen(8000, () => console.log('Server Started'))

