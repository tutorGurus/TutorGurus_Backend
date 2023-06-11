let express = require("express");
let router = express.Router();
let successHandle = require('./successHandler');

router.get("/", (req, res, next) => {
    successHandle(res, "GetTest");
});

router.options("/", (req, res, next) => {
    successHandle(res, "OptionsTest");
});

module.exports = router;
