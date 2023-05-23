const express = require('express')
const router = express.Router()
const {getContact, createContact, deleteContact, updateContact, getSingleContact} = require('../controllers/contact-controller')
const validateToken = require("../middleware/validate-token-handler");


router.use(validateToken);


// router.route('/').get(getContact)
// router.route('/').post(createContact)
router.route('/').get(getContact).post(createContact);


// router.route('/:id').get(getSingleContact)
// router.route('/:id').put(updateContact)
// router.route('/:id').delete(deleteContact)
router.route('/:id').get(getSingleContact).put(updateContact).delete(deleteContact);

module.exports = router