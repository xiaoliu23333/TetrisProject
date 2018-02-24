var ws = require("nodejs-websocket")

var PORT = 3000
//运行时在终端执行node wsServer.js

var clientCount = 0
// Scream server example: "hi" -> "HI!!!"
var server = ws.createServer(function (conn) {
    //表明客户端连接成功
    console.log("New connection")
    clientCount++
    conn.nickname = 'user' + clientCount
    var mes = {}
    mes.type = "enter"
    mes.value = conn.nickname + ' comes in'
    broadcast(JSON.stringify(mes))
    //text方法客户端有消息传过来时
    conn.on("text", function (str) {
        var mes = {}
        mes.type = "message"
        mes.value = conn.nickname + ':'+str
        broadcast(JSON.stringify(mes))
    })
    conn.on("close", function (code, reason) {
        var mes = {}
        mes.type = "left"
        mes.value = conn.nickname + ' left'
        broadcast(JSON.stringify(mes))
    })
    conn.on("error",function (err) {
        console.log("handle err")
        console.log(err)
    })
}).listen(PORT)

console.log("websocket server listening on port "+PORT)
function broadcast(str) {
    server.connections.forEach(function (connection) {
        connection.sendText(str)
    })
}