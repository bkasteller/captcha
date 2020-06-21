let connection = require('../../config/db')

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

    get status () {
        return this.row.status
    }

    get isAdmin () {
        return this.row.status === 'administrateur'
    }

    static create (name, email, password, callback) {
        connection.query('INSERT INTO users SET name = ?, email = ?, password = ?', [name, email, password], (err, result) => {
            if (err) throw err
            callback(result)
        })
    }

    static delete (id, callback) {
        connection.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
            if (err) throw err
            callback(result)
        })
    }

    static update (user, name, email, password, status, callback) {
        let query = 'UPDATE users SET'
        query += name && name != user.name ? ' name = ?,' : ''
        query += email && email != user.email ? ' email = ?,' : ''
        query += password ? ' password = ?,' : ''
        query += status && status != user.status ? ' status = ?,' : ''
        query = query.slice(0, -1);
        query += 'WHERE id = ?'

        let array = []
        if (name && name != user.name) array.push(name)
        if (email && email != user.email) array.push(email)
        if (password) array.push(password)
        if (status && status != user.status) array.push(status)
        array.push(user.id)

        connection.query(query, array, (err, result) => {
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
