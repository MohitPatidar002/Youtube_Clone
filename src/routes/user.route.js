const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.middleware.js');

const registerUser = require('../controllers/register.controller.js');
const loginUser = require('../controllers/login.controller.js');
const logoutUser = require('../controllers/logout.controller.js');
const verifyJWT = require('../middlewares/auth.middleware.js');
const refreshAccessToken = require('../controllers/refreshToken.controller.js');

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
router.route('/refresh-token').post(refreshAccessToken)

module.exports = router;