const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'UP' }));
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });

  res.end(`
    <html>
      <head>
        <title>AWS DevOps Student Project</title>
      </head>
      <body style="font-family:Arial; margin:40px">
        <h1>AWS DevOps CI/CD Pipeline Successfully Deployed!!</h1>
        <p>Deployed automatically using Jenkins + Docker + Ansible.</p>
        <p>Environment: Amazon EC2</p>
        <p><a href="/health">Health Check</a></p>
      </body>
    </html>
  `);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Application running on port ${port}`);
});
