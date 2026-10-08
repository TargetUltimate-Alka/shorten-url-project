const express = require("express");
require("dotenv").config();
const urlRoute = require("./route/url");
const connectDB = require("./connection/database");
const URL = require("./model/url");
const app = express();
const PORT = process.env.PORT || 8001;
connectDB();
// middleware 
// parses only json data
app.use(express.json());
// parse form data
app.use(express.urlencoded({ extended: true }));

app.set("view engine" , "ejs");
// css 
app.use(express.static("public"));
app.use("/url", urlRoute);

// frontend route 
app.get("/" , (req,res)=>{
  return res.render("home");
});

app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      {
         returnDocument: "after",
      },
    );
    if (!entry) {
      return res.status(404).json({
        error: "short URL not found",
      });
    }
    res.redirect(entry.originalURL);
  } 
  catch (error) {
    return res.status(500).json({
      error: "something went wrong",
    });
  }
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
