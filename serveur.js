let express = require('express')
let fs = require('fs')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')

// Moteur de template
app.set('view engine', 'ejs')

// Middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(require('./middlewares/flash'))

// Routes
app.get('/', (request, response) => {
    response.render('pages/index')
})

app.get('/formulaire', (request, response) => {
    let Message = require('./models/message')
    Message.all((messages) => {
        response.render('pages/form', {messages: messages})
    })
})

app.post('/formulaire', (request, response) => {
    if (request.body.message === undefined || request.body.message === '') {
        request.flash('error', "Vous n'avez pas posté de message.")
        response.redirect('/formulaire')
    } else {
        let Message = require('./models/message')
        Message.create(request.body.message, () => {
            request.flash('success', "Message enregistré.")
            response.redirect('/formulaire')
        })
    }
})

app.get('/post/:id', (request, response) => {
    let Message = require('./models/message')
    Message.find(request.params.id, (message) => {
        response.render('package/show', {message: message})
    })
})

app.get('/captcha', (request, response) => {
    response.render('pages/captcha', {
        data: JSON.parse(fs.readFileSync('public/images/LesChats.json', 'utf8'))
    })
})

// Port 8080
app.listen(8080)
