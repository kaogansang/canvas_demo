let OPTIONS = {
    limit: true,
    level: 4,
    init() {
        this.container = document.getElementById('container');
        this.cvs = this.container.appendChild(document.createElement('canvas'));
        this.ctx = this.cvs.getContext('2d');
        this.cvs.width = document.documentElement.clientWidth;
        this.cvs.height = document.documentElement.clientHeight;
        this.UNIT_WIDTH = (this.cvs.width / 40) >> 0;
        this.UNIT_HEIGHT = (this.cvs.width / 40) >> 0;
        //设置画布大小
    }
}

//蛇头
class Head {
    constructor(x = 0, y = 0, color = 'black') {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        OPTIONS.ctx.save();
        OPTIONS.ctx.beginPath();
        OPTIONS.ctx.fillStyle = this.color;
        OPTIONS.ctx.arc(this.x + OPTIONS.UNIT_WIDTH / 2, this.y + OPTIONS.UNIT_WIDTH / 2, OPTIONS.UNIT_WIDTH, 0, 2 * Math.PI);
        OPTIONS.ctx.fill();
        OPTIONS.ctx.restore();
    }
}

//方块
class Rect {
    constructor(x = 0, y = 0, color = 'black') {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    draw() {
        OPTIONS.ctx.save();
        OPTIONS.ctx.fillStyle = this.color;
        OPTIONS.ctx.fillRect(this.x, this.y, OPTIONS.UNIT_WIDTH, OPTIONS.UNIT_HEIGHT);
        OPTIONS.ctx.restore();
    }
}

//蛇 🐍
class Snake {
    constructor() {
        this.head = new Head(0, 0, 'red');
        this.length = 0;
        this.body = [];
        this.direction = 0;
        this.listenChangeDirection()
    }

    move() {
        let oldHead = this.head;
        let body = this.body;

        //根据方向移动
        let arr = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        let x = oldHead.x + arr[this.direction][0] * OPTIONS.UNIT_WIDTH;
        let y = oldHead.y + arr[this.direction][1] * OPTIONS.UNIT_HEIGHT;
        this.head = new Head(x, y, 'red');


        if (this.length) {
            //计算身子位置
            for (let i = this.length - 1; i > 0; i--) {
                body[i].x = body[i - 1].x;
                body[i].y = body[i - 1].y;
            }
            body[0].x = oldHead.x;
            body[0].y = oldHead.y;
        }
    }

    eat(food) {
        this.length++;
        let oldHead = this.head;

        //根据方向移动
        let arr = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        let x = oldHead.x + arr[this.direction][0] * OPTIONS.UNIT_WIDTH;
        let y = oldHead.y + arr[this.direction][1] * OPTIONS.UNIT_HEIGHT;
        this.head = new Head(x, y, 'red');

        this.body.unshift(new Rect(oldHead.x, oldHead.y, food.color));
    }

    draw() {
        OPTIONS.ctx.clearRect(0, 0, OPTIONS.cvs.width, OPTIONS.cvs.height);
        this.head.draw();
        this.body.forEach(item => {
            item.draw();
        })
    }

    listenChangeDirection() {
        document.addEventListener('keydown', e => {
            let keyCode = e.key;
            let map = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
            let curIdx = map.indexOf(keyCode);
            let oldIdx = this.direction;
            if (curIdx >= 0 && (curIdx + 2) % 4 !== oldIdx) {
                this.direction = curIdx;
            }
        })
    }
}

//食物
class Food {
    constructor(position) {
        this.x = position.x;
        this.y = position.y;
        this.color = '#' + (16 ** 3 * Math.random() >> 0).toString(16);
    }

    draw() {
        OPTIONS.ctx.save();
        OPTIONS.ctx.fillStyle = this.color;
        OPTIONS.ctx.fillRect(this.x, this.y, OPTIONS.UNIT_WIDTH, OPTIONS.UNIT_HEIGHT);
        OPTIONS.ctx.restore();
    }
}

//控制器
class Controller {
    constructor() {
        OPTIONS.init();
        //构造蛇
        this.snake = new Snake();
        //构造食物
        this.food = new Food(this.getRandomPosition());
        //动画开关
        this.animationSwitch = true;
        //开启动画
        this.animation();
    }

    //检测是否迟到食物
    testEat() {
        let head = this.snake.head;
        if (this.food.x === head.x && this.food.y === head.y) {
            this.snake.eat(this.food);
            this.food = new Food(this.getRandomPosition());
        }
    }

    //检测吃到自己
    testSelf() {
        let x = this.snake.head.x;
        let y = this.snake.head.y;
        let body = this.snake.body;

        for (let i = 0; i < body.length; i++) {
            let item = body[i];
            if (x === item.x && y === item.y) this.gameOver();
        }
    }

    //边缘检测
    testLimit() {
        let x = this.snake.head.x;
        let y = this.snake.head.y;
        let maxX = OPTIONS.cvs.width;
        let maxY = OPTIONS.cvs.height;

        x += x < 0 ? maxX : x > maxX ? -maxX : 0;
        y += y < 0 ? maxY : y > maxY ? -maxY : 0;

        x = x - x % OPTIONS.UNIT_WIDTH;
        y = y - y % OPTIONS.UNIT_HEIGHT;

        this.snake.head.x = x;
        this.snake.head.y = y;
    }

    //动画
    animation() {
        if(!this.animationSwitch) return;
        this.snake.draw();
        this.food.draw();
        this.testEat();
        this.testLimit();
        this.testSelf();
        this.snake.move();
        setTimeout(this.animation.bind(this), 50 * (5 - OPTIONS.level))
    }

    //获得一个随机位置
    getRandomPosition() {
        let x, y;
        do {
            y = (Math.random() * OPTIONS.cvs.height / OPTIONS.UNIT_HEIGHT >> 0) * OPTIONS.UNIT_WIDTH;
            x = (Math.random() * OPTIONS.cvs.width / OPTIONS.UNIT_WIDTH >> 0) * OPTIONS.UNIT_WIDTH;
        } while (this.snake.body.find(item => {
            return item.x === x && item.y === y;
        }))
        return {x, y};
    }

    gameOver() {
        alert(`得分：${this.snake.length}`);

        //构造蛇
        this.snake = new Snake();
        //构造食物
        this.food = new Food(this.getRandomPosition());
        //动画开关
        this.animationSwitch = true;
        //开启动画
        this.animation();
    }
}

new Controller();
