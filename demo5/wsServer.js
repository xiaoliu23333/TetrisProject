var app = require('http').createServer()
var io = require('socket.io')(app)
var PORT = 3000

var clientCount = 0

app.listen(PORT)

io.on('connection',function (socket) {
    clientCount++
    socket.nickname = 'user' + clientCount
    console.log(clientCount)
    //socket.emit是向socket这一个客户端发送数据  io.emit是向所有进来的客户端发送广播
    io.emit('enter',socket.nickname+ ' comes in')
    socket.on('message',function (data) {
        io.emit('message',socket.nickname + ':'+data)
    })

    socket.on('disconnect',function (data) {
        io.emit('leave',socket.nickname + ' leave')
    })
})
// var server = ws.createServer(function (conn) {
//     //表明客户端连接成功
//     console.log("New connection")
//     clientCount++
//     conn.nickname = 'user' + clientCount
//     var mes = {}
//     mes.type = "enter"
//     mes.value = conn.nickname + ' comes in'
//     broadcast(JSON.stringify(mes))
//     //text方法客户端有消息传过来时
//     conn.on("text", function (str) {
//         var mes = {}
//         mes.type = "message"
//         mes.value = conn.nickname + ':'+str
//         broadcast(JSON.stringify(mes))
//     })
//     conn.on("close", function (code, reason) {
//         var mes = {}
//         mes.type = "left"
//         mes.value = conn.nickname + ' left'
//         broadcast(JSON.stringify(mes))
//     })
//     conn.on("error",function (err) {
//         console.log("handle err")
//         console.log(err)
//     })
// }).listen(PORT)

console.log("websocket server listening on port "+PORT)
// function broadcast(str) {
//     server.connections.forEach(function (connection) {
//         connection.sendText(str)
//     })
// }