let express = require('express')

let app = express()

app.set('view engine', 'ejs')

app.use(express.static('images'))

app.get('/', (request, response) => {
  response.render('captcha')
})

app.listen(8080)
