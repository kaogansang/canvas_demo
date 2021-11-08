// 渲染器
var RENDERER = {
    // 粒子数量
    PARTICLE_COUNT : 1500,
    // 粒子半径
    PARTICLE_RADIUS : 1,
    // 最大倾斜角度
    MAX_ROTATION_ANGLE : Math.PI / 60,
    // 每个图形显示的时间
    TRANSLATION_COUNT : 500,

    // 初始化
    init : function(strategy){
        this.setParameters(strategy);
        this.createParticles();
        this.setupFigure();
        this.reconstructMethod();
        this.bindEvent();
        this.drawFigure();
    },
    // 设置渲染器对象参数
    setParameters : function(strategy){
        this.$window = $(window);

        this.$container = $('#jsi-particle-container');
        this.width = this.$container.width();
        this.height = this.$container.height();

        this.$canvas = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container);
        this.context = this.$canvas.get(0).getContext('2d');

        this.center = {x : this.width / 2, y : this.height / 2};

        this.rotationX = this.MAX_ROTATION_ANGLE;
        this.rotationY = this.MAX_ROTATION_ANGLE;
        this.strategyIndex = 0;
        this.translationCount = 0;
        this.theta = 0;

        this.strategies = strategy.getStrategies();
        this.particles = [];
    },
    // 创建粒子对象数组
    createParticles : function(){
        for(var i = 0; i < this.PARTICLE_COUNT; i ++){
            this.particles.push(new PARTICLE(this.center));
        }
    },
    // 将一些方法bind绑定到当前对象
    reconstructMethod : function(){
        // 因为这些方法等等要
        this.setupFigure = this.setupFigure.bind(this);
        this.drawFigure = this.drawFigure.bind(this);
        this.changeAngle = this.changeAngle.bind(this);
    },
    // 绑定事件处理函数
    bindEvent : function(){
        // 监听点击事件,切换图形
        this.$container.on('click', this.setupFigure);
        // 监听鼠标移动事件,改变图形偏转角度
        this.$container.on('mousemove', this.changeAngle);
    },
    // 根据鼠标位置修改旋转方向
    changeAngle : function(event){
        // 获取鼠标位置
        var offset = this.$container.offset(),
            x = event.clientX - offset.left + this.$window.scrollLeft(),
            y = event.clientY - offset.top + this.$window.scrollTop();

        this.rotationX = (this.center.y - y) / this.center.y * this.MAX_ROTATION_ANGLE;
        this.rotationY = (this.center.x - x) / this.center.x * this.MAX_ROTATION_ANGLE;
    },
    // 计算每个粒子将要去的位置
    setupFigure : function(){
        // 由策略列表中的对应图形方法得到每个例子要去的位置
        for(var i = 0, length = this.particles.length; i < length; i++){
            this.particles[i].setAxis(this.strategies[this.strategyIndex]());
        }
        // 已经演示了4个形状就重新演示
        if(++this.strategyIndex == this.strategies.length){
            this.strategyIndex = 0;
        }
        this.translationCount = 0;
    },
    // 绘制图形
    drawFigure : function(){
        requestAnimationFrame(this.drawFigure);

        // 这里应该是要实现clearRect的效果,但不知为什么效果比clearRect要好
        this.context.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.context.fillRect(0, 0, this.width, this.height);

        // 遍历粒子数组
        for(var i = 0, length = this.particles.length; i < length; i++){
            var axis = this.particles[i].getAxis2D(this.theta);
            // 绘制粒子
            this.context.beginPath();
            this.context.fillStyle = axis.color;
            this.context.arc(axis.x, axis.y, this.PARTICLE_RADIUS, 0, Math.PI * 2, false);
            this.context.fill();
        }
        // 改变图形角度
        this.theta++;
        this.theta %= 360;

        // 遍历修改下一帧粒子的位置
        for(var i = 0, length = this.particles.length; i < length; i++){
            this.particles[i].rotateX(this.rotationX);
            this.particles[i].rotateY(this.rotationY);
        }
        // 计时
        this.translationCount++;
        this.translationCount %= this.TRANSLATION_COUNT;
        // 计时到点,切换图形
        if(this.translationCount == 0){
            this.setupFigure();
        }
    }
};
var STRATEGY = {
    // 散布半径
    SCATTER_RADIUS :150,
    CONE_ASPECT_RATIO : 1.5,
    RING_COUNT : 5,

    getStrategies : function(){
        var strategies = [];

        for(var i in this){
            if(this[i] == arguments.callee || typeof this[i] != 'function'){
                continue;
            }
            strategies.push(this[i].bind(this));
        }
        return strategies;
    },
    createSphere : function(){
        var cosTheta = Math.random() * 2 - 1,
            sinTheta = Math.sqrt(1 - cosTheta * cosTheta),
            phi = Math.random() * 2 * Math.PI;

        return {
            x : this.SCATTER_RADIUS * sinTheta * Math.cos(phi),
            y : this.SCATTER_RADIUS * sinTheta * Math.sin(phi),
            z : this.SCATTER_RADIUS * cosTheta,
            hue : Math.round(phi / Math.PI * 30)
        };
    },
    createTorus : function(){
        var theta = Math.random() * Math.PI * 2,
            x = this.SCATTER_RADIUS + this.SCATTER_RADIUS / 6 * Math.cos(theta),
            y = this.SCATTER_RADIUS / 6 * Math.sin(theta),
            phi = Math.random() * Math.PI * 2;

        return {
            x : x * Math.cos(phi),
            y : y,
            z : x * Math.sin(phi),
            hue : Math.round(phi / Math.PI * 30)
        };
    },
    createCone : function(){
        var status = Math.random() > 1 / 3,
            x,
            y,
            phi = Math.random() * Math.PI * 2,
            rate = Math.tan(30 / 180 * Math.PI) / this.CONE_ASPECT_RATIO;

        if(status){
            y = this.SCATTER_RADIUS * (1 - Math.random() * 2);
            x = (this.SCATTER_RADIUS - y) * rate;
        }else{
            y = -this.SCATTER_RADIUS;
            x = this.SCATTER_RADIUS * 2 * rate * Math.random();
        }
        return {
            x : x * Math.cos(phi),
            y : y,
            z : x * Math.sin(phi),
            hue : Math.round(phi / Math.PI * 30)
        };
    },
    createVase : function(){
        var theta = Math.random() * Math.PI,
            x = Math.abs(this.SCATTER_RADIUS * Math.cos(theta) / 2) + this.SCATTER_RADIUS / 8,
            y = this.SCATTER_RADIUS * Math.cos(theta) * 1.2,
            phi = Math.random() * Math.PI * 2;

        return {
            x : x * Math.cos(phi),
            y : y,
            z : x * Math.sin(phi),
            hue : Math.round(phi / Math.PI * 30)
        };
    }
};
// 粒子对象
var PARTICLE = function(center){
    this.center = center;
    this.init();
};
// 粒子方法
PARTICLE.prototype = {
    SPRING : 0.01,
    FRICTION : 0.9,
    FOCUS_POSITION : 300,
    COLOR : 'hsl(%hue, 100%, 70%)',

    init : function(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.color;
    },
    setAxis : function(axis){
        this.translating = true;
        this.nextX = axis.x;
        this.nextY = axis.y;
        this.nextZ = axis.z;
        this.hue = axis.hue;
    },
    rotateX : function(angle){
        var sin = Math.sin(angle),
            cos = Math.cos(angle),
            nextY = this.nextY * cos - this.nextZ * sin,
            nextZ = this.nextZ * cos + this.nextY * sin,
            y = this.y * cos - this.z * sin,
            z = this.z * cos + this.y * sin;

        this.nextY = nextY;
        this.nextZ = nextZ;
        this.y = y;
        this.z = z;
    },
    rotateY : function(angle){
        var sin = Math.sin(angle),
            cos = Math.cos(angle),
            nextX = this.nextX * cos - this.nextZ * sin,
            nextZ = this.nextZ * cos + this.nextX * sin,
            x = this.x * cos - this.z * sin,
            z = this.z * cos + this.x * sin;

        this.nextX = nextX;
        this.nextZ = nextZ;
        this.x = x;
        this.z = z;
    },
    rotateZ : function(angle){
        var sin = Math.sin(angle),
            cos = Math.cos(angle),
            nextX = this.nextX * cos - this.nextY * sin,
            nextY = this.nextY * cos + this.nextX * sin,
            x = this.x * cos - this.y * sin,
            y = this.y * cos + this.x * sin;

        this.nextX = nextX;
        this.nextY = nextY;
        this.x = x;
        this.y = y;
    },
    // 计算3d位置
    getAxis3D : function(){
        this.vx += (this.nextX - this.x) * this.SPRING;
        this.vy += (this.nextY - this.y) * this.SPRING;
        this.vz += (this.nextZ - this.z) * this.SPRING;

        this.vx *= this.FRICTION;
        this.vy *= this.FRICTION;
        this.vz *= this.FRICTION;

        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        return {x : this.x, y : this.y, z : this.z};
    },
    // 计算2d位置
    getAxis2D : function(theta){
        // 获取到3d位置
        var axis = this.getAxis3D(),
            scale = this.FOCUS_POSITION / (this.FOCUS_POSITION + axis.z);

        // 通过计算,将3d位置映射到2d平面上,
        return {x : this.center.x + axis.x * scale, y : this.center.y - axis.y * scale, color : this.COLOR.replace('%hue', this.hue + theta)};
    }
};
$(function(){
    RENDERER.init(STRATEGY);
});