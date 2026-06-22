const fs = require('fs');
const env = require('./config/env');
const connectDb = require('./config/db');
const app = require('./app');

fs.mkdirSync(env.uploadDir, { recursive: true });

connectDb()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server', error);
    process.exit(1);
  });
