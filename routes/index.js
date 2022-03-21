const express = require('express');
const router = express.Router();

//all employees route
router.get('/', (req, res) => {
    // res.send('Hello world!');
    res.render('index');
});

module.exports = router;