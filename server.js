let express     = require('express'),
    fs          = require('fs'),
    bodyParser  = require('body-parser'),
    session     = require('express-session'),
    validator   = require('express-validator'),
    ejs         = require('ejs'),
    config      = require('config'),
    upload      = require(__dirname+'/config/upload')

const IN_PROD = config.get('App.env') === 'production'

let app = express()

// Moteur de template
app.set('view engine', 'ejs')

// Middleware
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
    name: config.get('App.session.name'),
    secret: config.get('App.session.secret'),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: config.get('App.session.cookie.lifetime'),
        sameSite: true,
        secure: IN_PROD
    }
}))

app.use(require(__dirname+'/app/middlewares/flash'), require(__dirname+'/app/middlewares/getUser'))

let redirectHome    = require(__dirname+'/app/middlewares/redirectHome'),
    redirectLogin   = require(__dirname+'/app/middlewares/redirectLogin'),
    isAdmin         = require(__dirname+'/app/middlewares/isAdmin')

// Routes
let homeController = require(__dirname+'/app/controller/homeController')

app.route('/')
   .get(redirectLogin, homeController.index)
   .post(redirectLogin, homeController.index)

let loginRouter = require(__dirname+'/app/router/loginRouter')

app.route('/login')
   .get(redirectHome, loginRouter.get)
   .post(redirectHome, loginRouter.post)

let registerRouter = require(__dirname+'/app/router/registerRouter')

app.route('/register')
   .get(redirectHome, registerRouter.get)
   .post(redirectHome, registerRouter.post)

let logoutRouter = require(__dirname+'/app/router/logoutRouter')

app.post('/logout', redirectLogin, logoutRouter)

let formulaireRouter = require(__dirname+'/app/router/formulaireRouter')

app.route('/formulaire')
   .get(redirectLogin, formulaireRouter.get)
   .post(redirectLogin, upload.single('neutres'), formulaireRouter.post)

let userController = require(__dirname+'/app/controller/userController')

app.get('/users', redirectLogin, isAdmin, userController.show)
app.get('/users/:id', redirectLogin, isAdmin, userController.find)
app.get('/users/delete/:id', redirectLogin, isAdmin, userController.delete)
app.post('/users/update/:id', redirectLogin, isAdmin, userController.update)

let themeController = require(__dirname+'/app/controller/themeController')
app.get('/themes', redirectLogin, isAdmin, themeController.show)
app.get('/themes/:id/delete', redirectLogin, isAdmin, themeController.delete)
app.post('/themes/create', redirectLogin, isAdmin, themeController.create)

let packageController = require(__dirname+'/app/controller/packageController')
app.get('/packages/:id', redirectLogin, packageController.show)
app.post('/packages/:id/delete', redirectLogin, packageController.delete)
app.post('/packages/:id', redirectLogin, packageController.update)

let indiceController = require(__dirname+'/app/controller/indiceController')
app.get('/packages/:id/indices', redirectLogin, /* To do creator */ indiceController.show)
app.post('/packages/:id/indices', redirectLogin, /* To do creator */ indiceController.create)

/*
app.get('/message', (request, response) => {
    let Message = require('/models/message')
    Message.all((messages) => {
        response.render('pages/message', {messages: messages})
    })
})

app.post('/message', (request, response) => {
    if (request.body.message === undefined || request.body.message === '') {
        request.flash('error', "Vous n'avez pas posté de message.")
        response.redirect('/message')
    } else {
        let Message = require('/models/message')
        Message.create(request.body.message, () => {
            request.flash('success', "Message enregistré.")
            response.redirect('/message')
        })
    }
})

app.get('/post/:id', (request, response) => {
    let Message = require('/models/message')
    Message.find(request.params.id, (message) => {
        response.render('package/show', {message: message})
    })
})*/

let captchaController = require(__dirname+'/app/controller/captchaController')
app.get('/captcha', captchaController.show)

let port = config.get('App.webServer.port')

app.listen(port, () => {
    console.log('Server listening on port ' + port)
})
