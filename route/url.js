const express = require("express");
const {generateNewShortURL , getAnalytics} = require("../controller/url");
const {
  restrictToLoggedinUserOnly,
} = require("../middleware/auth");
const router = express.Router();
//// Only logged-in users can create short URLs
router.post('/' , restrictToLoggedinUserOnly,generateNewShortURL);

// Only logged-in users can access analytics
router.get("/analytics/:shortId",restrictToLoggedinUserOnly , getAnalytics);

module.exports = router ;
