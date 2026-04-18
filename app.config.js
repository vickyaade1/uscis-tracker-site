const DEFAULT_RENDER_API_URL = "https://uscis-tracker-site.onrender.com";

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: process.env.RENDER_API_URL || DEFAULT_RENDER_API_URL,
  },
});
