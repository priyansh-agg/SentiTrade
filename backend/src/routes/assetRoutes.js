const router = require("express").Router();
const { getAssets } = require("../controllers/assetController");

router.get("/assets", getAssets);

module.exports = router;
