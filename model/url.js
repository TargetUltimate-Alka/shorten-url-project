const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },

    originalURL: {
      type: String,       // String, not string
      required: true,     // required, not require
    },

    visitHistory: [
      {
        timestamp: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;