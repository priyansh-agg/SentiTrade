const router = require("express").Router();
const { getCorrelation } = require("../controllers/correlationController");

router.get("/correlation", getCorrelation);

module.exports = router;
