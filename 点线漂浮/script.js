window.onload = main;
function main() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    ctx.strokeStyle = "rgba(255, 255, 123, .5)";
    ctx.fillStyle = "white";

    // 初始化点
    let points = [];
    for (let i = 0; i < 200; i++) {
        points.push(new Point(ctx));
        points[i].draw();
    }

    // 鼠标点
    let cursor = new Point(ctx);
    onmousemove = function (e) {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
    };

    // 渲染动画帧
    requestAnimationFrame(function () {
        animation(ctx, points, cursor);
        requestAnimationFrame(arguments.callee);
    });

    // 点击位置生成点，并移除最早的点
    canvas.onclick = function (e) {
        let mouseX = e.clientX;
        let mouseY = e.clientY;
        for (let i = 0; i < 5; i++) {
            points.shift();
            points.push(new Point(ctx, mouseX, mouseY));
        }
    };
}

// 更新动画帧
function animation(ctx, points, cursor) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cursor.draw();
    for (let i = 0; i < points.length; i++) {
        let curPoint = points[i];
        curPoint.move();
        curPoint.draw();
        // 判断其他点间距离并连线
        for (let j = i + 1; j < points.length; j++) {
            let tempPoint = points[j];
            // 两点距离平方
            let distance =
                (curPoint.x - tempPoint.x) ** 2 +
                (curPoint.y - tempPoint.y) ** 2;
            if (distance < 100 ** 2) curPoint.lineTo(tempPoint);
        }

        // 判断鼠标点距离并连线
        let distance =
            (curPoint.x - cursor.x) ** 2 + (curPoint.y - cursor.y) ** 2;
        if (distance < 150 ** 2) cursor.lineTo(curPoint);
    }
}

// 定义点类
class Point {
    static R = 1;
    constructor(ctx, x, y, speed, direction) {
        this.ctx = ctx;
        this.x = x || Math.random() * ctx.canvas.width;
        this.y = y || Math.random() * ctx.canvas.height;
        // 运动方向，角度表示
        this.direction = direction || 2 * Math.random() * Math.PI;
        this.speed = speed || 0.5;
    }
    // 点移动
    move() {
        this.x += this.speed * Math.sin(this.direction);
        this.y += this.speed * Math.cos(this.direction);
        // 边界判断
        if (this.x < 0 || this.x > this.ctx.canvas.width)
            this.direction = -this.direction;
        if (this.y < 0 || this.y > this.ctx.canvas.width)
            this.direction = Math.PI - this.direction;
    }
    // 画点
    draw() {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Point.R, 0, 2 * Math.PI);
        ctx.fill();
    }
    // 点连线
    lineTo(targetPoint) {
        let ctx = this.ctx;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(targetPoint.x, targetPoint.y);
        ctx.stroke();
    }
}
