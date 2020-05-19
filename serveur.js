let express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    validator = require('express-validator'),
    multer = require('multer'),
    ejs = require('ejs'),
    bcrypt = require('bcrypt')

const TWO_HOURS = 1000 * 60 * 60 * 2
const {
    PORT = 8080,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET = 'ssh! This is asecret',
    SESS_LIFETIME = TWO_HOURS
} = process.env
const IN_PROD = NODE_ENV === 'production'

let app = express()


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
    name: SESS_NAME,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}))
app.use(require(__dirname+'/middlewares/flash'), (req, res, next) => {
    let User = require(__dirname+'/models/user')
    const { userId } = req.session
    if (userId) {
        User.find(userId, (user) => {
            res.locals.user = user
        })
    }
    next()
})

const redirectLogin = (request, response, next) => {
    if(!request.session.userId) {
        response.redirect('/login')
    } else {
        next()
    }
}

const redirectHome = (request, response, next) => {
    if(request.session.userId) {
        response.redirect('/')
    } else {
        next()
    }
}

// Routes
app.get('/', redirectLogin, (request, response) => {
    const { userId } = request.session
    let Captcha = require(__dirname+'/models/captcha')
    Captcha.all((packages) => {
        response.render('pages/index', {userId: userId, packages: packages})
    })
})

app.get('/login', redirectHome, (request, response) => {
    response.render('auth/login')
})

app.get('/register', redirectHome, (request, response) => {
    response.render('auth/register')
})

app.post('/login', redirectHome, (request, response) => {
    const { email, password } = request.body
    if (email && password) {
        let User = require(__dirname+'/models/user')
        User.getUserByEmail(email, async (user) => {
            if (await bcrypt.compare(request.body.password, user.password)) {
                request.session.userId = user.id
                request.flash('success', "Vous êtes connecté.")
                response.redirect('/')
            } else {
                request.flash('error', "Echec de l'authentification.")
                response.redirect('/login')
            }
        })
    }
})

app.post('/register', redirectHome, async (request, response) => {
    try {
        let User = require(__dirname+'/models/user')
        await bcrypt.hash(request.body.password, 10)
        let password = request.body.password
        User.create(request.body.name, request.body.email, password, () => {
            request.flash('success', "Votre compte a bien été crée.")
            response.redirect('/login')
        })
    } catch {
        request.flash('error', "Erreur lors de la création du compte.")
        response.redirect('/register')
    }
})

app.get('/logout', redirectLogin, (request, response) => {
    request.session.destroy()
    response.clearCookie(SESS_NAME)
    response.redirect('/login')
})

app.get('/formulaire', redirectLogin, (request, response) => {
    let Theme = require(__dirname+'/models/theme')
    Theme.all((themes) => {
        response.render('pages/form', {themes: themes})
    })
})

app.post('/formulaire', redirectLogin, upload.single('neutres', 20), (request, response, next) => {
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
app.listen(PORT, () => console.log('Server started on port 8080'))
