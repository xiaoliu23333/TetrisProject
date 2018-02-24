var app = require('http').createServer()
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

//
io.on('connection', function (socket) {
    //emit表示发送数据,将news事件塞入数据
    socket.emit('news', { hello: 'world' });
    //on表示执行对应（如my other event）的事件，并响应在对应的服务器端或客户端
    socket.on('my other event', function (data) {
        console.log(data);
    });
});