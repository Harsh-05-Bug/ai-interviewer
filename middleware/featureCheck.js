const AdminConfig = require('../models/AdminConfig');

let cachedFeatures = null;
let cacheTime = 0;

const loadFeatures = async () => {
  const now = Date.now();
  if (cachedFeatures && now - cacheTime < 30000) return cachedFeatures;
  const config = await AdminConfig.findOne();
  if (config) {
    cachedFeatures = {};
    config.features.forEach(f => { cachedFeatures[f.key] = f.enabled; });
    cacheTime = now;
  }
  return cachedFeatures || {};
};

const clearCache = () => { cachedFeatures = null; cacheTime = 0; };

const featureCheck = (featureKey) => {
  return async (req, res, next) => {
    try {
      const features = await loadFeatures();
      if (features[featureKey] === false) {
        return res.status(503).json({ success: false, error: 'This feature is currently disabled by admin.' });
      }
      next();
    } catch (err) {
      next();
    }
  };
};

module.exports = { featureCheck, loadFeatures, clearCache };