//获取画布
let cvs = document.getElementById('canvas');
//获取2d上下文
let ctx = cvs.getContext('2d');
//初始化画布
cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight;


//转盘偏移角度
let OFFSET_ANGLE = 0;
//选项颜色
let COLORS = Array.from({length: 8}).map(() => '#' + (Math.random() * 16 ** 3 >> 0).toString(16));
//选项
let OPTIONS_TEXT = ['啤酒', '饮料', '矿泉水', '红牛', '奥里给', '白开水', '牛奶', '可乐'];
//动画开关
let ANIMATION_SWITCH = false;
//剩余需要旋转的角度
let TOTAL_ROTATE_ANGLE = 0;
//可以点击转动标志
let CLICK_SWITCH = true;
//最终奖品
let PRIZE = ''

//初始化转盘
function init() {
    wheelRender();
    pointRender();
}

//动画，创建帧
function animation() {
    if (!ANIMATION_SWITCH) return;
    changeOffsetAngle();
    wheelRender();
    pointRender();
    requestAnimationFrame(() => animation(ctx));
}

//计算每一帧旋转角度
function changeOffsetAngle() {
    //剩余偏转角度足够小时，停止动画
    if (TOTAL_ROTATE_ANGLE < 0.05) {
        //允许点击
        CLICK_SWITCH = true;
        //关闭动画
        ANIMATION_SWITCH = false;
        //弹出奖励通知
        alert('恭喜您获得：' + PRIZE)
        return;
    }
    //实现一个渐渐变慢的效果，每帧转动角度逐渐变小
    OFFSET_ANGLE += TOTAL_ROTATE_ANGLE / 20;
    TOTAL_ROTATE_ANGLE *= 19 / 20;
}

//绘制转盘
function wheelRender() {
    //绘制背景板
    ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, 100, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    //绘制选项块
    let gapAngle = 1 / 4 * Math.PI;
    for (let i = 0; i < 8; i++) {
        let startAngle = i / 4 * Math.PI + OFFSET_ANGLE;
        let endAngle = startAngle + gapAngle;

        //绘制转盘选项
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = COLORS[i];
        ctx.moveTo(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.arc(
            ctx.canvas.width / 2,
            ctx.canvas.height / 2,
            90,
            startAngle,
            endAngle
        );
        ctx.fill();
        ctx.restore();

        //绘制文字
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        //基于原始设置移动坐标系
        ctx.translate(
            ctx.canvas.width / 2,
            ctx.canvas.height / 2
        );
        //旋转坐标系
        ctx.rotate((startAngle + endAngle) / 2 + Math.PI / 2);
        let text = OPTIONS_TEXT[i];
        ctx.fillText(text, -ctx.measureText(text).width / 2, -70)
        ctx.restore();
    }
}

//绘制指针
function pointRender() {
    ctx.save();
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.arc(0, 0, 10, 0, Math.PI);
    let gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
    gradient.addColorStop(0, '#789');
    gradient.addColorStop(1, '#038');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
}

//根据总旋转角度计算奖品
function getPrize() {
    /*
        计算方法：
            偏移量 = (转之前转盘偏移角度 + 将要转的角度) % 2派
            旋转的选项个数 = 偏移量 / 每个选项所占的角度
            由于转盘是倒着的，指针又是第6个，上一步得出选项数又是向下取整，所以
            结果下标 = 6 - 1 -旋转的选项个数
    */
    //偏移量
    let totalOffset = (TOTAL_ROTATE_ANGLE + OFFSET_ANGLE) % (2 * Math.PI);
    // 选项个数 (向下取整)
    let num = totalOffset / (Math.PI / 4) >> 0;
    //奖品下标
    let index = (8 + 6 - 1 - num) % 8;
    PRIZE = OPTIONS_TEXT[index];
}




//初始化转盘
init()

//监听鼠标点击，开始动画
cvs.onclick = function (e) {
    if (!CLICK_SWITCH) return;
    //获取鼠标基于canvas位置
    let mouseX = e.clientX - cvs.offsetLeft;
    let mouseY = e.clientY - cvs.offsetTop;

    ctx.arc(cvs.width / 2, cvs.height / 2, 40, 0, 2 * Math.PI);
    if (ctx.isPointInPath(mouseX, mouseY)) {
        //随机生成总旋转角度
        TOTAL_ROTATE_ANGLE = 2 * Math.PI * (3 + 5 * Math.random());
        //计算奖品
        getPrize();
        //禁止点击
        CLICK_SWITCH = false;
        //开启动画
        ANIMATION_SWITCH = true;
        animation();
    }
}