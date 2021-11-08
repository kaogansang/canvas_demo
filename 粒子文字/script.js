//创建并初始化canvas，获取2d上下文对象
let container = document.getElementById('container');
let canvas = container.appendChild(document.createElement('canvas'));
let context = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let width = canvas.width;
let height = canvas.height


//文本列表
let textList = ['你好', '我是', '胡艺'];
//保存文字像素位置
let textPosition = [];
//当前渲染的文字的下标
let textIndex = 0;
//粒子数组
let particles;
//记录当前是第几帧
let frameCount = 0;

//计算文字像素位置
function getTextPosition() {
    for (let i = 0; i < textList.length; i++) {
        //绘制文字
        context.save()
        context.translate(width / 2, height / 2);
        context.fillStyle = '#000';
        context.font = '200px Arial';
        let text = textList[i];
        let fontMsg = context.measureText(text);
        context.fillText(text, -fontMsg.width / 2, 50);
        context.restore();

        //获取黑像素点位置数组
        let blackPxArr = [];
        let imgData = context.getImageData(0, 0, width, height).data;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let index = (y * width + x) * 4;
                if (imgData[index] !== 0) console.log('---')
                if (imgData[index + 3] !== 0) blackPxArr.push({x, y});
            }
        }
        textPosition.push(blackPxArr);

        //清除文本
        context.clearRect(0, 0, width, height);
    }
}

//粒子类
class Particle {
    //弹性
    spring = 0.01;
    //摩擦力
    friction = 0.9;
    //半径
    radius = 1;

    constructor() {
        this.x = width / 2;
        this.y = height / 2;
        this.vx = 0;
        this.vy = 0;
        this.color = `hsl(${Math.random() * 2 * 30}, 100%, 70%)`;
    }

    //设置粒子目标坐标
    setAxis(axis) {
        this.nextX = axis.x;
        this.nextY = axis.y;
    }

    //获取每一帧粒子的坐标
    getAxis() {
        this.vx += (this.nextX - this.x) * this.spring;
        this.vy += (this.nextY - this.y) * this.spring;

        this.vx *= this.friction
        this.vy *= this.friction

        this.x += this.vx;
        this.y += this.vy;

        return {x: this.x, y: this.y};
    }
}

//创建粒子数组
function createParticles() {
    particles = [];
    for (let i = 0; i < 1500; i++) {
        particles.push(new Particle());
    }
}

//设置粒子的下一个位置
function setParticlesAxis() {
    particles.forEach(particle => {
        let index = Math.random() * textPosition[textIndex].length >> 0;
        let axis = textPosition[textIndex][index];
        particle.setAxis(axis);
    })
    textIndex = ++textIndex % textList.length;
}

//渲染
function draw() {
    if (frameCount === 200) {
        frameCount = 0;
        setParticlesAxis();
    }
    frameCount++;
    context.clearRect(0, 0, width, height);
    particles.forEach(particle => {
        let axis = particle.getAxis();
        context.beginPath();
        context.arc(axis.x, axis.y, particle.radius, 0, 2 * Math.PI);
        context.fillStyle = particle.color;
        context.fill();
    })
    requestAnimationFrame(draw);
}


window.onload = () => {
    getTextPosition();
    createParticles();
    setParticlesAxis();
    draw();
}
