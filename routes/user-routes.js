const express =  require('express')
const {registerUser, loginUser, currentUser} = require("../controllers/user-controller");
const router =  express.Router()
const validateToken = require('../middleware/validate-token-handler')

router.route('/register').post(registerUser)

router.post('/login',loginUser)

router.route('/current').get( validateToken, currentUser )



module.exports = router;