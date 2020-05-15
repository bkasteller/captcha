let express = require('express')
let fs = require('fs')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')
let multer = require('multer')
let ejs = require('ejs')

// Gestion des upload
let storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, 'public/images')
  },
  filename: function (request, file, callback) {
    callback(null, file.fieldname)
  }
})
let upload = multer({ storage: storage })

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
app.use(require(__dirname+'/middlewares/flash'))

// Routes
app.get('/', (request, response) => {
    let Captcha = require(__dirname+'/models/captcha')
    Captcha.all((packages) => {
        response.render('pages/index', {packages: packages})
    })
})

app.get('/formulaire', (request, response) => {
    let Theme = require(__dirname+'/models/theme')
    Theme.all((themes) => {
        response.render('pages/form', {themes: themes})
    })
})

app.post('/formulaire', upload.single('neutres', 20), (request, response, next) => {
    if (!request.file) {
        request.flash('error', "Aucun fichier.")
        response.redirect('/formulaire')
    }
    let Captcha = require(__dirname+'/models/captcha')
    Captcha.create(request.body.name, request.body.theme_id, () => {
        request.flash('success', "Captcha ajouté.")
        response.redirect('/')
    })
})

app.get('/message', (request, response) => {
    let Message = require(__dirname+'/models/message')
    Message.all((messages) => {
        response.render('pages/message', {messages: messages})
    })
})

app.post('/message', (request, response) => {
    if (request.body.message === undefined || request.body.message === '') {
        request.flash('error', "Vous n'avez pas posté de message.")
        response.redirect('/message')
    } else {
        let Message = require(__dirname+'/models/message')
        Message.create(request.body.message, () => {
            request.flash('success', "Message enregistré.")
            response.redirect('/message')
        })
    }
})

app.get('/post/:id', (request, response) => {
    let Message = require(__dirname+'/models/message')
    Message.find(request.params.id, (message) => {
        response.render('package/show', {message: message})
    })
})

app.get('/captcha', (request, response) => {
    response.render('pages/captcha', {
        data: JSON.parse(fs.readFileSync('/images/LesChats.json', 'utf8'))
    })
})

// Port 8080
app.listen(8080, () => console.log('Server started on port 8080'))
