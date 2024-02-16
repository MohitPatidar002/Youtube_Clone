const multer  = require('multer');
// const upload = multer({ dest: 'uploads/' });


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
module.exports =  multer({ storage})
