const multer = require('multer');
const path = require('path');
const { extensionValidator } = require('../utils/extension_validator');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/images/'))
    },
    filename: function (req, file, cb) {

      const userId = req.user.id;

      if(req.url === '/blog-update' && (file === undefined || file === null)) {
        return cb(null, null)
      }

      const fileExtension = file.mimetype.split('/')[1];
      const checkIsValidExtension = extensionValidator(fileExtension);

      if(!checkIsValidExtension) {

        return cb('Invalid Image Format', null);
      } 

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      
      cb(null, userId + "-" + 'blog' + '-' + uniqueSuffix + '.' + fileExtension);
    }
  })
  
const upload = multer({ storage: storage });

module.exports = upload;