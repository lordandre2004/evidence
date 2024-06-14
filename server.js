require('dotenv').config();
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  console.log(req.url)
  if (req.method === 'GET' && req.url.includes("get-updates")) {

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(JSON.stringify({ RED__STATUS: 'working' }));
  } else if (req.method === 'GET' && !req.url.includes("get-updates")) {
    // Parse the request URL to extract the plan and task identifiers
    const parsedUrl = url.parse(req.url, true);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);

    // Check if the path is in the format '/plan/get-ext-task/PLAN-0012'
    if (pathParts.length === 3) {
      const service = pathParts[0].toUpperCase();
      const action = pathParts[1];
      const taskId = pathParts[2];

      // Check if the corresponding environment variable is set
      const serviceUrl = process.env[`SERVICE_${service}`];
      if (serviceUrl) {
        // Redirect the user to the target URL
        const targetUrl = `${serviceUrl}/${action}/${taskId}`;
        res.writeHead(302, { 'Location': targetUrl });
        res.end();
      } else {
        // If the environment variable is not set, return an error
        res.statusCode = 400;
        res.end(`Environment variable SERVICE_${plan} is not set.`);
      }
    } else {
      // If the request URL is not in the expected format, return an error
      res.statusCode = 400;
      res.end('Invalid request URL.');
    }
  } else {
    // Handle other request methods as needed
    res.statusCode = 405; // Method Not Allowed
    res.end('Only GET requests are allowed');
  }
});

// Start the server
const port = process.env.PORT || 3210;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});