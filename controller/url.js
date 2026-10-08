
const { nanoid } = require("nanoid");
const URL = require("../model/url");

async function generateNewShortURL(req, res){

  const body = req.body ;
  if(!body.url)return res.status(400).json({error : "url is required."})

  const shortID = nanoid(8);

  await URL.create ({
    shortId : shortID ,
    originalURL : body.url,
    visitHistory : [],
  });
 return res.render("result", {
    originalURL: body.url,
    shortId: shortID,
});
}

async function getAnalytics(req , res){

  const shortId = req.params.shortId;

  const result = await URL.findOne({shortId}) ;

  if(!result){
    return res.status(400).json({
      error : "short URL not found",
    });
  }
  return res.render("analytics" , {
    originalURL: result.originalURL,
    shortId: result.shortId,
    totalClicks : result.visitHistory.length ,
    analytics : result.visitHistory,
  });

}
module.exports = {
  generateNewShortURL,
  getAnalytics,
}