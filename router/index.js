const express = require("express");

const router = express.Router();

const Otprouter  = require("./Otprouter");

router.use(Otprouter);

module.exports = router;