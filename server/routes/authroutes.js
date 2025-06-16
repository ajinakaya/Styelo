const express = require('express');
const router = express.Router();
const AuthValidation = require('../validation/authvalidation');
const upload = require('../middlewares/upload');

const { authenticateToken } = require('../security/Auth');
const {registerUser,
        loginUser,
        forgetPassword,
        resetPassword,
        imageUpload,
        
        } = require('../controller/authController')

//Authentication routes
router.post('/register',AuthValidation, registerUser)
router.post('/login', loginUser)
router.post('/forgetpassword', forgetPassword);
router.post('/resetpassword', resetPassword);
router.post('/imageupload',authenticateToken,upload.single('image'), imageUpload);

module.exports = router;
