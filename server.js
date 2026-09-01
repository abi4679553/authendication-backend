require("dotenv").config();
const Cors = require("cors");
const express = require("express")

const listen = require("./config/Listen");
const connectDb = require("./config/db");
const IndexRouter = require("./router");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(Cors())


app.use(express.json())



connectDb(mongoose)
app.use(IndexRouter); 
listen(app)



