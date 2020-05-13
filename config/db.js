let mysql = require('mysql')

let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'captcha'
})

connection.connect()

module.exports = connection
