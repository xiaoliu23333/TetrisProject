var Local = function (socket) {
    //游戏对象
    var game;
    //时间间隔
    var INTERVAL = 2000;
    //定时器
    var timer = null
    //时间计数器
    var timeCount = 0;
    //时间
    var time = 0;
    //移动
    var move = function () {
        timeFunc()
        if (!game.down()){
            game.fixed()
            socket.emit('fixed')
            var line = game.checkClear()
            if (line){
                game.addScore(line);
                socket.emit('line',line)
                if (line > 1){
                    var bottomLines = generataBottomLine(line)
                    socket.emit('bottomLines',bottomLines);
                }
            }
            var gameOver = game.checkGameOver()
            if (gameOver){
                game.gameover(false);
                socket.emit('lose')
                document.getElementById('remote_gameover').innerHTML = '你赢了'
                stop()
            }else {
                var type2 = generateType();
                var dir2 = generateDir();
                game.performNext(type2,dir2)
                socket.emit('next',{type:type2,dir:dir2})
            }
        }else {
            socket.emit('down')
        }
    }
    //随机生成一个方块种类
    var generateType = function () {
        return Math.ceil(Math.random()*7) - 1;
    }
    //随机生成一个旋转次数
    var generateDir = function () {
        return Math.ceil(Math.random()*4) - 1;
    }
    //随机生成干扰行
    var generataBottomLine = function (lineNum) {
        var lines = [];
        for (var i = 0;i < lineNum;i++){
            var line = [];
            for (var j = 0; j< 10;j++){
                line.push(Math.ceil(Math.random()*2)-1);
            }
            lines.push(line)
        }
        return lines
    }
    //开始
    var start = function () {
        var doms = {
            gameDiv: document.getElementById('local_game'),
            nextDiv:document.getElementById('local_next'),
            timeDiv:document.getElementById('local_time'),
            scoreDiv:document.getElementById('local_score'),
            resultDiv:document.getElementById('local_gameover')
        }
        game = new Game();
        var type = generateType();
        var dir = generateDir();
        game.init(doms,type,dir)
        socket.emit('init',{type:type,dir:dir})
        var type2 = generateType();
        var dir2 = generateDir();
        game.performNext(type2,dir2)
        socket.emit('next',{type:type2,dir:dir2})
        bindKeyEvent(game)
        timer = setInterval(move,INTERVAL)
    }
    //计时函数
    var timeFunc = function () {
        timeCount = timeCount + 1;
        if (timeCount == 5){
            timeCount = 0;
            time = time +1;
            game.setTime(time);
            socket.emit('time',time)
            // if (time % 10 == 0){
            //     game.addTailLines(generataBottomLine(1))
            // }
        }
    }
    //绑定键盘事件
    var bindKeyEvent = function (game) {
        document.onkeydown = function (e) {
            //空格键
            if (e.keyCode == 32){
                game.fall()
                socket.emit('fall')
            }
            //left
            else if (e.keyCode == 37){
                game.left()
                socket.emit('left')
            }
            //up旋转
            else if (e.keyCode == 38){
                game.rotate()
                socket.emit('rotate')
            }
            //right
            else if (e.keyCode == 39){
                game.right()
                socket.emit('right')
            }
            //down
            else if (e.keyCode == 40){
                game.down()
                socket.emit('down')
            }
        }
    }
    //结束
    var stop = function () {
        if (timer){
            clearInterval(timer)
            timer = null
        }
        document.onkeydown = null
    }

    // //导出API
    // this.start = start;
    socket.on('start',function () {
        document.getElementById('waiting').innerHTML = '';
        start()
    })
    socket.on('lose',function () {
        game.gameover(true)
    })
    socket.on('leave',function () {
       document.getElementById('local_gameover').innerHTML = '对方掉线'
        document.getElementById('remote_gameover').innerHTML = '已掉线'
        stop()
    })

    socket.on('bottomLines',function (data) {
        game.addTailLines(data)
        socket.emit('addTailLines',data);
    })
}