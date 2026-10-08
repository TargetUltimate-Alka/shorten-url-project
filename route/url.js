const express = require("express");
const {generateNewShortURL , getAnalytics} = require("../controller/url")
const router = express.Router();

router.post('/' , generateNewShortURL);

router.get("/analytics/:shortId", getAnalytics);

module.exports = router ;
//http://localhost:8001/url/analytics/IubV6kcY