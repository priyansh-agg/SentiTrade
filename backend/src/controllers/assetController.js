const { listAssets } = require("../services/assetService");

const getAssets = (_req, res) => {
  res.json({ assets: listAssets() });
};

module.exports = { getAssets };
