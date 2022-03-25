const express = require('express');
const router = express.Router();
const Book = require('../models/book');

//recently books route
router.get('/', async (req, res) => {
    let books;
    try {
        books = await Book.find().sort({createdAt: 'desc'}).limit(2).exec();
    } catch (error) {
        books = [];
    }
    res.render('index', {books: books });
});

module.exports = router;