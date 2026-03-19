require('dotenv').config({ path: './.env' });
const { Client } = require('pg');

const connectionDataPostgre = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

const client = new Client(connectionDataPostgre);

client.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Error connecting to PostgreSQL', err));

module.exports = client;