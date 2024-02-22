require('dotenv').config(); 
const { Pool } = require('pg');

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    
};

const pool = new Pool(dbConfig);

pool.connect()
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch(error => console.error('Error de conexión a la base de datos:', error));
  
module.exports = { pool };