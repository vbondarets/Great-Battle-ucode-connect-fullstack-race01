const mysql = require("mysql2");
const config = require('./config.json');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
	//port: '/var/run/mysqld/mysqld.sock'
    
}).promise();

module.exports = pool;


