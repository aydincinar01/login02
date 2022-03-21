//connect to mongoo DB
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3000;
connectDB();

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

//const { engine } = require('express/lib/application');

const indexRouter = require('./routes/index');
const employeeRouter = require('./routes/employees');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

app.use('/', indexRouter);
app.use('/employees', employeeRouter);

mongoose.connection.on('error', error => {
    console.error('Dn Connection error : ' + error);
});

mongoose.connection.once('open', () =>{
    console.log('Connected Mongoo DB!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});