function processErrorCatch(){
    process.on("unhandleRejection!", (reason, promise) =>{
        console.error("為捕捉到的 rejecton", promise, '原因' , reason);
    });
    
    process.on("uncaughtException", (err) =>{
        console.error('Uncaughted Exception!');
        console.error(err.message);
        console.error(err.name);
        process.exit(1);
    })
}

module.exports = processErrorCatch;

