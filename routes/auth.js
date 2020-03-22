const express = require('express');
const {register, 
    login, 
    getMe, 
    forgotPassword, 
    resetPassword,
    updateDetails,
    updatepassword,
    logout
} = require('../controllers/auth');
const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',protect, getMe);
router.post('/updatedetails',protect, updateDetails);
router.post('/forgotpassword', forgotPassword );
router.post('/updatepassword',protect, updatepassword );
router.put('/resetpassword/:resettoken',resetPassword);

module.exports = router;