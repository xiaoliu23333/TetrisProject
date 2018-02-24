var ws = require("nodejs-websocket")

var PORT = 3000
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    //表明客户端连接成功
    console.log("New connection")
    //text方法客户端有消息传过来时
    conn.on("text", function (str) {
        console.log("Received "+str)
        conn.sendText(str)
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
    conn.on("error",function (err) {
        console.log("handle err")
        console.log(err)
    })
}).listen(PORT)

console.log("websocket server listening on port "+PORT)