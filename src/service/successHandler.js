const header = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
}
function successHandle(res, data){
    res.set(header)
    res.status(200).send({
    "status" : "success",
    "data" : data
    })
}


module.exports = successHandle