const socketIO = require("socket.io");
function connectSocketIO(server){
    const io = new socketIO.Server(server);
    io.on("connection", (socket) => {
        console.log("有人來囉")
        socket.emit("userConnectNotify", "歡迎");
    
    socket.on('disconnect', () => {
        console.log("使用者已離線");
    });

    socket.on("joinRoom", (roomID) => {
        socket.join(roomID);
    });

    socket.on("roomMessage", async (messagePayload)=>{
        console.log("messagePayload", messagePayload);
        try {
            io.to("123").emit("roomMessage", messagePayload);
        } catch(err){
            console.log(err)
        }
    })
});
    
    
}
module.exports = connectSocketIO;