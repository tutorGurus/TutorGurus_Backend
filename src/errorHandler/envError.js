const devError = (err, res) =>{
    if(err.isOperational == true){
        res.status(err.statusCode).send({
            status : false,
            Errormessage : err.message,
            ErrorIs : err,
            Errorstack : err.stack
        })
    } else {
        res.status(500).send({
            status : false,
            Errormessage : err.message,
            ErrorIs : err,
            Errorstack : err.stack
        })
    }
}

const productError = (err, res) =>{
    if(err.isOperational == true){
        res.status(res.statusCode).send({
            status : false,
            Errormessage : err.message,
        })
    } else {
        console.log("未定義的錯誤!");
        res.status(500).send({
            status : false,
            Errormessage : "請聯繫客服"
        })
    }
}

module.exports = { devError, productError }