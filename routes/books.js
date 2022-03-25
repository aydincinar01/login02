const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/book');
const Author = require('../models/author');
const { remove } = require('../models/author');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['images/jpeg', 'images/png', 'images/gif'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});
const upload = multer({storage});

//all books route
router.get('/', async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title !== '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }   
    if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
        query = query.lte('publishDate', req.query.publishedBefore );
    }   
    if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
        query = query.gte('publishDate', req.query.publishedAfter );
    }   
    
    try {
        const books = await query.exec();
        res.render('books/index',{
            books: books,
            searchOptions: req.query});
    } catch {
        console.log('into all books route but have errror');
        res.redirect('/');
    }
});

//new book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book() );
});

//create books route
router.post('/', upload.single('cover'), async (req, res) => {
    const filename = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: req.body.publishDate,
        pageCount: req.body.pageCount,
        coverImageName: filename,
        description: req.body.description
    });
    try {
       const newBook = await book.save();
       //res.redirect(`books/${newBook.id}`);
       res.redirect('books');
    } catch (error) {
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res, book, true);
    }
});

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.log(err);
    });
}
async function renderNewPage(res, book, haserror = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };
        if (haserror) params.errorMessage = 'Error creating book.';
        res.render('books/new', params);
    } catch {
        res.redirect('/books');
    }
}

module.exports = router;