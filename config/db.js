let mysql       = require('mysql')
let config      = require('config')

let connection = mysql.createConnection({
    host        : config.get('MySQL.host'),
    user        : config.get('MySQL.user'),
    password    : config.get('MySQL.password'),
    database    : config.get('MySQL.database')
})

connection.connect()

module.exports = connection
