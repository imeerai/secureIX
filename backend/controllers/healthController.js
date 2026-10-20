/**
 * Health Check Controller
 */

function handleHealth(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.writeHead(200);
  res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
}

module.exports = {
  handleHealth,
};
