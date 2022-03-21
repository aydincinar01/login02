const express = require('express');
const employee = require('../models/employee');
const router = express.Router();
const Employee = require('../models/employee');

//all employees route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.firstname != null && req.query.firstname !== '') {
      searchOptions.firstname = new RegExp(req.query.firstname, 'i')
    }   
    try {
        const employees = await Employee.find(searchOptions);
        res.render('employees/index',{
            employees: employees,
            searchOptions: req.query});
    } catch {
        console.log('into all employees route but have errror');
        res.redirect('/');
    }    
});

//new employees route
router.get('/new', (req, res) => {
    res.render('employees/new', { employee: new Employee() });
});

//create employees route
router.post('/', async (req, res) => {
    const employee = new Employee({
        firstname: req.body.firstname,
        lastname: req.body.lastname});

    //way02
    try {
        const newEmployee = await employee.save(); 
        //res.redirect(`employees/${newEmployee.id}`);
        res.redirect('employees');  
    } catch (error) {
        res.render('employees/new', {
            employee: employee,
            errorMessage: 'Error creating Employee' });
    }

    // //way01
    // employee.save( (err, newEmployee ) => {
    //     if(err){
    //         res.render('employee/new', {
    //            employee: employee,
    //            errorMessage: 'Error creating Employee' 
    //         });
    //     }else{
    //         // res.redirect(`employees/${newEmployee.id}`);
    //         res.redirect('employees');
    //     }
    // });
});

module.exports = router;