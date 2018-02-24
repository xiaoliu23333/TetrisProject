var Game = function () {
    //dom元素
    var gameDiv;
    var nextDiv;
    var timeDiv;
    var scoreDiv;
    var resultDiv;
    //分数
    var score = 0;
    //游戏矩阵
    var gameData = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];
    //当前方块
    var curSquare;
    //下一个方块
    var nextSquare;
    //divs
    var nextDivs = []
    var gameDivs = []
    //初始化Div
    var initDiv = function (container,data,divs) {
        for (var i = 0;i < data.length;i++){
            var div = []
            for (var j = 0;j < data[0].length;j++){
                var newNode = document.createElement('div');
                newNode.className = 'none';
                newNode.style.top = (i*20) +'px';
                newNode.style.left = (j*20) +'px';
                container.appendChild(newNode);
                div.push(newNode)
            }
            divs.push(div)
        }
    }
//刷新div
    var refreshDiv = function (data,divs) {
        for (var i = 0;i < data.length;i++){
            for (var j = 0;j < data[0].length;j++){
                if (data[i][j] == 0){
                    divs[i][j].className = 'none'
                }else if (data[i][j] == 1){
                    divs[i][j].className = 'done'
                }else if (data[i][j] == 2){
                    divs[i][j].className = 'current'
                }
            }
        }
    }

    //检测点是否合法
    var checkPoint = function (pos,x,y) {
        return ((pos.x + x < 0)||(pos.x + x >= gameData.length)
            ||(pos.y + y < 0)||(pos.y + y >= gameData[0].length)||(gameData[pos.x + x][pos.y + y] == 1))?false:true
        // if (pos.y + y < 0){
        //     return false
        // }else if (pos.y + y >= gameData.length){
        //     return false
        // }else if (pos.x + x < 0){
        //     return false
        // }else if (pos.x + x >= gameData[0].length){
        //     return false
        // }else if (gameData[pos.x + x][pos.y + y] == 1){
        //     return false
        // }else {
        //     return true
        // }
    }
    //检测数据是否合法
    //pos对应square中的origin，data表示square中的data
    var checkData = function (pos,data) {
        for(var i = 0;i<data.length;i++){
            for (var j = 0;j<data[0].length;j++){
                if (data[i][j] != 0){
                    if (!checkPoint(pos,i,j)){
                        return false
                    }
                }
            }
        }
        return true;
    }
    //清除不需要的数据
    var clearData = function () {
        for (var i = 0;i < curSquare.data.length;i++){
            for (var j = 0;j < curSquare.data[0].length;j++){
                if (checkPoint(curSquare.origin,i,j)) {
                    gameData[curSquare.origin.x + i][curSquare.origin.y + j] = 0
                }
            }
        }
    }
    //设置数据
    var setData = function () {
        for (var i = 0;i < curSquare.data.length;i++){
            for (var j = 0;j < curSquare.data[0].length;j++){
                if (checkPoint(curSquare.origin,i,j)){
                    gameData[curSquare.origin.x + i][curSquare.origin.y + j] = curSquare.data[i][j]
                }else {
                    if (curSquare.data[i][j] == 2)
                    gameData[curSquare.origin.x + i][curSquare.origin.y + j] = 1
                }
            }
        }
    }
    //初始化
    var init = function (doms,type,dir) {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        timeDiv = doms.timeDiv;
        scoreDiv = doms.scoreDiv;
        resultDiv = doms.resultDiv;
        nextSquare = SquareFactory.prototype.make(type,dir);
        initDiv(gameDiv,gameData,gameDivs)
        initDiv(nextDiv,nextSquare.data,nextDivs)
        refreshDiv(nextSquare.data,nextDivs)
    }
    //使用下一个方块
    var performNext = function (type,dir) {
        curSquare = nextSquare;
        setData();
        nextSquare = SquareFactory.prototype.make(type,dir);
        refreshDiv(gameData,gameDivs)
        refreshDiv(nextSquare.data,nextDivs)
    }
    //设置时间
    var setTime = function (time) {
        timeDiv.innerHTML = time
    }
    //计算分数
    var addScore = function (line) {
        var s = 0;
        switch (line){
            case 1:
                s = 10;
                break;
            case 2:
                s = 30;
                break;
            case 3:
                s = 60;
                break;
            case 4:
                s = 100;
                break;
            default:
                break;
        }
        score = score + s;
        scoreDiv.innerHTML = score
    }
    //方块下降
    var down = function () {
        if(curSquare.canDown(checkData)) {
            clearData()
            curSquare.down()
            setData();
            refreshDiv(gameData,gameDivs)
            // curSquare.isButtom = curSquare.canDown(checkData)?false:true
            return true
        }else {
            // curSquare.isButtom = true
            return false
        }
    }
    //方块左移
    var left = function () {
        // if (!curSquare.isButtom){
            if(curSquare.canLeft(checkData)) {
                clearData()
                curSquare.left()
                setData();
                refreshDiv(gameData,gameDivs)
            }
        // }

    }
    //方块右移
    var right = function () {
        // if (!curSquare.isButtom) {
            if (curSquare.canRight(checkData)) {
                clearData()
                curSquare.right()
                setData();
                refreshDiv(gameData, gameDivs)
            }
        // }
    }
    //方块旋转
    var rotate = function () {
        if(curSquare.canRotate(checkData)) {
            clearData()
            curSquare.rotate()
            setData();
            refreshDiv(gameData,gameDivs)
        }
    }
    //方块移动到底部，给他固定
    var fixed = function () {
        for (var i = 0;i < curSquare.data.length;i++){
            for (var j = 0;j < curSquare.data[0].length;j++){
                if (checkPoint(curSquare.origin,i,j)){
                   if (gameData[curSquare.origin.x+i][curSquare.origin.y+j] == 2){
                       gameData[curSquare.origin.x+i][curSquare.origin.y+j] = 1
                   }
                }
            }
        }
        refreshDiv(gameData,gameDivs)
    }
    //方块清除
    var checkClear = function () {
        var line = 0;
        for (var i = gameData.length -1 ;i>=0;i--){
            var clear = true;
            for (var j = 0;j < gameData[0].length;j++){
                if (gameData[i][j] != 1){
                    clear = false;
                    break;
                }
            }
            if (clear){
                line = line+1
                for (var m = i;m>0;m--){
                    for (var n = 0;n < gameData[0].length;n++){
                        gameData[m][n] = gameData[m-1][n];
                    }
                }
                for (var n = 0;n < curSquare.data[0].length;n++){
                    gameData[0][n] = 0;
                }
                i++;
            }
        }
        return line
    }
    //检查游戏结束
    var checkGameOver = function () {
        var gameOver = false
        for (var i = 0;i < gameData[0].length;i++){
            if (gameData[1][i] == 1){
                gameOver = true;
                break;
            }
        }
        return gameOver
    }
    //游戏结束时的显示
    var gameover = function (win) {
        if (win){
            resultDiv.innerHTML = '你赢了'
        }else {
            resultDiv.innerHTML = '你输了'
        }
    }

    //底部增加行
    var addTailLines = function (lines) {
        for (var i = 0;i < gameData.length - lines.length;i++){
            gameData[i] = gameData[i + lines.length];
        }
        for (var i = 0;i < lines.length;i++){
            gameData[gameData.length - lines.length+i] = lines[i]
        }
        curSquare.origin.x = curSquare.origin.x - lines.length
        if (curSquare.origin.x < 0){
            curSquare.origin.x = 0
        }
        refreshDiv(gameData,gameDivs)
    }

    //导出API
    this.init = init;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
    this.fall = function () {
        while (down());
    };
    this.fixed = fixed;
    this.performNext = performNext;
    this.checkClear = checkClear;
    this.checkGameOver = checkGameOver;
    this.setTime = setTime;
    this.addScore = addScore;
    this.gameover = gameover;
    this.addTailLines = addTailLines;
}