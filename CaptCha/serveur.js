let express = require('express')
let fs = require('fs')
let app = express()
let bodyParser = require('body-parser')

// Moteur de template
app.set('view engine', 'ejs')

// Middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.get('/', (request, response) => {
  response.render('captcha', {data: JSON.parse(fs.readFileSync('public/images/LesChats.json', 'utf8'))})
})

app.listen(8080)
