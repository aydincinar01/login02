const express = require('express');
const router = express.Router();
const Author = require('../models/author');

//all authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i')
    }   
    try {
        const authors = await Author.find(searchOptions);
        res.render('authors/index',{
            authors: authors,
            searchOptions: req.query});
    } catch {
        console.log('into all authors route but have errror');
        res.redirect('/');
    }
});

//new authors route
router.get('/new', (req, res) => {
    res.render('authors/new');
});

//create authors route
router.post('/', async (req, res) => {
    res.send(' create author');
});

module.exports = router;