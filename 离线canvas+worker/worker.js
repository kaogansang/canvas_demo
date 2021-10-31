var canvas, ctx;
onmessage = function (e) {
    canvas = e.data.offscreenCanvas;
    ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 500;

    animation();
};

// 动画函数，修改，渲染帧
function animation() {
    let i = 0;
    setInterval(() => {
        drawCircle(i);
        i = (i + 1) % 10;
    }, 307);
}

// 画园
function drawCircle(frameTag) {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 线性渐变
    // let gradient = ctx.createLinearGradient(50, 50, 150, 150);

    // 放射渐变
    let gradient = ctx.createRadialGradient(
        100,
        100,
        // 10 * Math.abs(frameTag - 6),
        200,
        100,
        100,
        // 10 * frameTag
        0
    );

    // 添加渐变色
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(1, "red");

    // 画线开始
    ctx.beginPath();

    // 将笔触移动到圆心
    ctx.moveTo(100, 100);

    let base = frameTag * 0.2 * Math.PI;
    ctx.arc(300, 300, 50, base, base + 0.5 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
}
