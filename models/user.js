let connection = require('../config/db')

class User {

    constructor (row) {
        this.row = row
    }

    get id () {
        return this.row.id
    }

    get name () {
        return this.row.name
    }

    get email () {
        return this.row.email
    }

    get password () {
        return this.row.password
    }

    static create (name, email, password, callback) {
        connection.query('INSERT INTO users SET name = ?, email = ?, password = ?', [name, email, password], (err, result) => {
            if (err) throw err
            callback(result)
        })
    }

    static all (callback) {
        connection.query('SELECT * FROM users', (err, rows) => {
            if (err) throw err
            callback(rows.map((row) => new User(row)))
        })
    }

    static find (id, callback) {
        connection.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id], (err, rows) => {
            if (err) throw err
            callback(new User(rows[0]))
        })
    }

    static getUserByEmail(email, callback) {
        connection.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email], (err, rows) => {
            if (err) throw err
            callback(new User(rows[0]))
        })
    }
}

module.exports = User
