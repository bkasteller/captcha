let multer = require('multer'),
    config = require('config')

let storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, config.get('App.stockage.imgPath'))
  },
  
  filename: function (request, file, callback) {
    callback(null, file.fieldname + '.zip')
  }
})

let upload = multer({ storage: storage })

module.exports = upload
