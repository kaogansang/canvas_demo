//创建画布
let container = document.getElementById('container');
let cvs = container.appendChild(document.createElement('canvas'));
let ctx = cvs.getContext('2d');


//设置画布大小
cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight;


//外边框
let MARGIN = 10;
//单位格宽度
let UNIT_WIDTH = (Math.min(cvs.width, cvs.height) - 2 * MARGIN) / 14;
//棋盘大小
let CHECKERBOARD_WIDTH = UNIT_WIDTH * 14;
//棋盘到窗口左边的距离
let LEFT = (cvs.width - CHECKERBOARD_WIDTH) / 2;
//棋盘到窗口上边的距离
let TOP = (cvs.height - CHECKERBOARD_WIDTH) / 2;
//设置原点为棋盘左上角
ctx.translate(LEFT, TOP);
//下一个棋子是否为黑子
let isBlack = true;
//棋子数组
let piecesList = Array.from({length: 15}).map(_ => []);


//棋盘
function drawCheckerboard() {
    //定义样式
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'rgba(13,201,161,0.75)';

    //开始绘制棋盘
    ctx.beginPath();
    //填充背景色
    ctx.fillRect(0, 0, CHECKERBOARD_WIDTH, CHECKERBOARD_WIDTH);
    //循环绘制格子
    for (let i = 0; i < 15; i++) {
        ctx.moveTo(i * UNIT_WIDTH, 0);
        ctx.lineTo(i * UNIT_WIDTH, 14 * UNIT_WIDTH);

        ctx.moveTo(0, i * UNIT_WIDTH);
        ctx.lineTo(14 * UNIT_WIDTH, i * UNIT_WIDTH)
    }
    ctx.stroke();
    ctx.restore();


    //画4个点
    ctx.save()
    ctx.fillStyle = 'black';

    ctx.beginPath();
    ctx.arc(3 * UNIT_WIDTH, 3 * UNIT_WIDTH, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(11 * UNIT_WIDTH, 3 * UNIT_WIDTH, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(3 * UNIT_WIDTH, 11 * UNIT_WIDTH, 3, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(11 * UNIT_WIDTH, 11 * UNIT_WIDTH, 3, 0, 2 * Math.PI);
    ctx.fill()

    ctx.restore();
}

//棋子
class Pieces {
    //棋子半径
    static R = UNIT_WIDTH / 2 - 2;

    constructor(x, y) {
        this.isBlack = isBlack;
        isBlack = !isBlack;
        this.x = x || 0;
        this.y = y || 0;
        this.draw();
    }

    draw() {
        //计算圆心位置
        let x = this.x * UNIT_WIDTH;
        let y = this.y * UNIT_WIDTH;

        ctx.save();
        //添加阴影
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = 'rgba(75,71,71,0.68)';
        //添加渐变色模拟光效
        let gradient = ctx.createRadialGradient(x - Pieces.R * .8, y - Pieces.R * .3, 1, x, y, Pieces.R);
        if (this.isBlack) {
            gradient.addColorStop(0, '#c7c7c7');
            gradient.addColorStop(1, 'black');
        } else {
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(1, '#b4b4b4');
        }
        ctx.fillStyle = gradient;

        //绘制棋子
        ctx.beginPath();
        ctx.arc(x, y, Pieces.R, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}

//检查胜利
function testWin(curPie) {
    let {x, y} = curPie;
    let color = curPie.isBlack;

    //计算各个方向的同色棋子个数
    //  ——
    let lr = recursion(x, y, -1, 0) + recursion(x, y, 1, 0) + 1;
    //  |
    let tb = recursion(x, y, 0, -1) + recursion(x, y, 0, 1) + 1;
    //  \
    let ltrb = recursion(x, y, -1, -1) + recursion(x, y, 1, 1) + 1;
    //  /
    let lbrt = recursion(x, y, -1, 1) + recursion(x, y, 1, -1) + 1;


    //胜利
    if (Math.max(lr, tb, ltrb, lbrt) >= 5) {
        alert(`${color ? '黑' : '白'}方胜利！`);

        //清除画布
        ctx.clearRect(0, 0, CHECKERBOARD_WIDTH, CHECKERBOARD_WIDTH);
        //清除棋子
        piecesList = Array.from({length: 15}).map(_ => []);
        //重新绘制棋盘
        drawCheckerboard();
    }

    //递归查找该方向对应颜色棋子个数
    function recursion(x, y, offx, offy) {
        if (piecesList[x + offx][y + offy] && piecesList[x + offx][y + offy].isBlack === color) {
            return 1 + recursion(x + offx, y + offy, offx, offy)
        }
        return 0;
    }
}


//绘制棋盘
drawCheckerboard();
//监听点击事件，下棋
document.addEventListener('click', e => {
    //真实坐标
    let x = e.clientX - LEFT, y = e.clientY - TOP;

    //转换棋盘坐标
    x = Math.round(x / UNIT_WIDTH);
    y = Math.round(y / UNIT_WIDTH);

    //检查坐标是否合规
    if (x < 0 || x > 15 || y < 0 || y > 15) return;
    if (piecesList[x][y]) return;

    //创建棋子
    let curPiece = new Pieces(x, y);
    piecesList[x][y] = curPiece;

    //因为canvas渲染是异步的，要等待渲染完成后再检查
    setTimeout(_ => testWin(curPiece), 0);
})
