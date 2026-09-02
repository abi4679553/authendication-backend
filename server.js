require("dotenv").config();
const Cors = require("cors");
const express = require("express")

const listen = require("./config/Listen");
const connectDb = require("./config/db");
const IndexRouter = require("./router");
const { default: mongoose } = require("mongoose");

const Session = require('express-session')
const MongoDBSession = require('connect-mongodb-session')(Session)

const app = express();

app.use(
    Cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

app.use(express.json())

const store = new MongoDBSession({
    uri: process.env.MONGO_URI,
    collection: 'session'
})

app.use(Session({
    secret: process.env.Session_key,
    resave: false,
    saveUninitialized : false,
    store : store
}))



connectDb(mongoose)
app.use(IndexRouter);
listen(app)



