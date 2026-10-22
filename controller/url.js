const { nanoid } = require("nanoid");
const URL = require("../model/url");

async function generateNewShortURL(req, res) {
  try {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required." });

    const shortID = nanoid(8);
    await URL.create({
      shortId: shortID,
      originalURL: body.url,
      createdBy: req.session.userId,
      visitHistory: [],
    });

    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.get("host");
    const fullShortURL = `${protocol}://${host}/${shortID}`;

    return res.render("result", {
      originalURL: body.url,
      shortId: shortID,
      fullShortURL,
    });
  } catch (error) {
    console.error("Create URL error:", error);
    return res.status(500).send("Unable to create short URL");
  }
}

async function getAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;

    // Find this URL only if it belongs to the logged-in user
    const result = await URL.findOne({
      shortId,
      createdBy: req.session.userId,
    });

    if (!result) {
      return res.status(404).json({
        error: "URL not found",
      });
    }

    return res.render("analytics", {
      originalURL: result.originalURL,
      shortId: result.shortId,
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return res.status(500).send("Unable to load analytics");
  }
}

module.exports = {
  generateNewShortURL,
  getAnalytics,
};