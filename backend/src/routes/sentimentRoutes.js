const router = require("express").Router();
const { getSentiment, getTrend } = require("../controllers/sentimentController");

router.get("/sentiment", getSentiment);
router.get("/sentiment/trend", getTrend);

module.exports = router;
