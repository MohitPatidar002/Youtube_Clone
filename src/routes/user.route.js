const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware.js');

const registerUser = require('../controllers/user.controller.js');
const loginUser = require('../controllers/login.js');
const logoutUser = require('../controllers/user.controller.js');
const verifyJWT = require('../middlewares/auth.middleware.js');

router.route('/register').post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);

router.route('/login').post(loginUser);

//secure routes
router.route('/logout').post(verifyJWT, logoutUser);

module.exports = router;