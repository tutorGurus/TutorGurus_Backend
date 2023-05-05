const devError = (err, res) =>{
    res.status(err.statusCode).send({
        Errormessage : err.message,
        Erroris : err,
        Errorstack : err.stack
    })
}

const productError = (err, res) =>{
    if(err.isOperational == true){
        res.status(res.statusCode).send({
            Errormessage : err.message,
        })
    } else {
        console.log("未定義的錯誤!");
        res.status(500).send({
            Errormessage : "請聯繫客服"
        })
    }
}

module.exports = { devError, productError }