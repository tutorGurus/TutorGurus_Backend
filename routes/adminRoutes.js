let express = require('express');
let router = express.Router();
const adminController = require('../src/controller/adminController');
const idMiddleWare = require('../src/middleware/idMiddleware');
const jwtFn = require('../src/middleware/auth');

    router.get('/', jwtFn.isAuth, idMiddleWare.isAdmin, adminController.getAlltutorInfo); 
    
    router.patch('/:tutorIdCustom', jwtFn.isAuth, idMiddleWare.isAdmin, adminController.updateTutorIdentity);

module.exports = router;