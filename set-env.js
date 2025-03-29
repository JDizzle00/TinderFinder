const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config(); // Load .env file

const envConfig = `export const environment = {
  production: false,
  geoReverseKey: "${process.env.GEO_REVERSE_API || ''}"
};`;

fs.writeFileSync('./src/environments/environment.ts', envConfig);