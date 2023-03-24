const mysql = require("mysql");



const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.BD_DATABASE
});

connection.connect((error) => {
  if (error) {
    console.log("Error de conexión: " + error);
    connection.end();
    throw error;
  }
  console.log("Conexión exitosa con el ID: " + connection.threadId);
  console.log('Base de datos: ' + connection.config.database);
});

module.exports = connection;


