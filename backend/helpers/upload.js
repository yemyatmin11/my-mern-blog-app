const multer  = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath;
      if(req.originalUrl.includes('/blogs')) {
        uploadPath = path.join(__dirname, '/../public/blogs');
      }
      else if(req.originalUrl.includes('/users')) {
        uploadPath = path.join(__dirname, '/../public/users');
      }
      else {
        uploadPath = path.join(__dirname, '/../public/uploads');
      };
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+ file.originalname);
    }
})
  
const upload = multer({ storage: storage });

module.exports = upload;