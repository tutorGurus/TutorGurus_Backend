let express = require('express');
let router = express.Router();
const adminController = require('../src/controller/adminController');

    router.get('/', adminController.getAlltutorInfo); 
    
    router.patch('/:tutorIdCustom', adminController.updateTutorIdentity);

module.exports = router;