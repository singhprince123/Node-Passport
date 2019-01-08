const express = require('express');
const router = express.Router();
const { ensureAuthentication} = require('../config/auth')

//welcome route
router.get('/', (req, res) => {
    res.render('welcome')
});

router.get('/dashbord', ensureAuthentication, (req, res) => {
    res.render('dashboard', { name: req.user.name})
});

module.exports = router;