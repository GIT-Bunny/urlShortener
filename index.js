const express = require('express')
const mongoose = require('mongoose')


const urlRoutes = require('./Routes/url.routes')

const app = express()

require('dotenv').config()
const URI = process.env.CONNECTION_URL
mongoose.connect(URI, { useUnifiedTopology: true, useCreateIndex: true , useNewUrlParser: true})
const connection = mongoose.connection
connection.once('open', () => {
    console.log(`Database is connected`)
})


app.listen(process.env.PORT||5000)


app
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use('/', urlRoutes)