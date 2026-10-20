// Vercel serverless entry: reuses the same router as the local server.
const { handleRequest } = require("../routes/router");

module.exports = (req, res) => handleRequest(req, res);
