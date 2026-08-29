require("dotenv").config();
const express = require("express")
const app = express();
const listen = require("./config/Listen");
const connectDb = require("./config/db");
const { default: mongoose } = require("mongoose");


connectDb(mongoose)
listen(app)