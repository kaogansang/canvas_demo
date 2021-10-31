var CANVAS_WIDTH = window.innerWidth//获取网页可视区域宽度
var CANVAS_HEIGHT = window.innerHeight * 0.97
var RADIUS = Math.floor(CANVAS_WIDTH * 0.8 / 130);
// var MG_LT = CANVAS_WIDTH * 0.2//左边框
var MG_LT = Math.floor(CANVAS_WIDTH * 0.1)//左边框
var MG_T = 30//顶边框
var balls = []//动态小球数组
var lastDate = new Date //旧时间
var frame = 15 //帧：毫秒

window.onload = function () {
  let canvas = document.getElementById('canvas')
  let context = canvas.getContext('2d')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  //刷新动画帧
  setInterval(() => {
    let nowDate = new Date
    update(nowDate, context)
    drawTime(nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds(), context)
    lastDate = nowDate
  }, 20)
}

var update = function (nowDate, context) {
  console.log(nowDate)
  console.log(lastDate)
  if (nowDate.getHours() !== lastDate.getHours()) {
    addBalls(MG_LT, MG_T, Math.floor(nowDate.getHours() / 10))
    addBalls(MG_LT + (RADIUS + 1) * 2 * 8, MG_T, nowDate.getHours() % 10)
  }
  if (nowDate.getMinutes() !== lastDate.getMinutes()) {
    addBalls(MG_LT + (RADIUS + 1) * 2 * 21, MG_T, Math.floor(nowDate.getMinutes() / 10))
    addBalls(MG_LT + (RADIUS + 1) * 2 * 29, MG_T, nowDate.getMinutes() % 10)
  }
  if (nowDate.getSeconds() !== lastDate.getSeconds()) {
    addBalls(MG_LT + (RADIUS + 1) * 2 * 42, MG_T, Math.floor(nowDate.getSeconds() / 10))
    addBalls(MG_LT + (RADIUS + 1) * 2 * 50, MG_T, nowDate.getSeconds() % 10)
  }
  // 更新小球位置
  for (let i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].vx * frame * 0.02
    balls[i].y += balls[i].vy * frame * 0.02
    balls[i].vy += balls[i].g * frame * 0.02
    // 碰撞检测
    if (balls[i].y + RADIUS + 1 >= CANVAS_HEIGHT) {
      balls[i].y = CANVAS_HEIGHT - (RADIUS + 1)
      balls[i].vy *= -0.6
    }
  }
  drawBall(context)
}
//添加小球对象
var addBalls = function (x, y, number) {
  console.log('addBalls')
  for (let c = 0; c < 10; c++) {
    for (let r = 0; r < 7; r++) {
      if (digit[number][c][r]) {
        let length = balls.length
        balls[length] = {
          x: x + r * 2 * (RADIUS + 1),
          y: y + c * 2 * (RADIUS + 1),
          vx: Math.pow(-1, Math.ceil(Math.random() * 2)) * 4,
          vy: -10,
          g: 1.5 + Math.random(),
          c: `#${Math.floor(Math.pow(16, 3) * Math.random()).toString(16)}`
        }
      }
    }
  }
}
//画时间
var drawTime = function (hour, minute, second, context) {
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  drawNum(MG_LT, MG_T, Math.floor(hour / 10), context)
  drawNum(MG_LT + (RADIUS + 1) * 2 * 8, MG_T, hour % 10, context)
  drawNum(MG_LT + (RADIUS + 1) * 2 * 16, MG_T, 10, context)
  drawNum(MG_LT + (RADIUS + 1) * 2 * 21, MG_T, Math.floor(minute / 10), context)
  drawNum(MG_LT + (RADIUS + 1) * 2 * 29, MG_T, minute % 10, context)
  drawNum(MG_LT + (RADIUS + 1) * 2 * 37, MG_T, 10, context)
  drawNum(MG_LT + (RADIUS + 1) * 2 * 42, MG_T, Math.floor(second / 10), context)
  drawNum(MG_LT + (RADIUS + 1) * 2 * 50, MG_T, second % 10, context)
  drawBall(context)
}
//画数字
var drawNum = function (x, y, number, context) {
  context.fillStyle = `#${Math.floor(Math.pow(16, 3) * Math.random()).toString(16)}`
  for (let c = 0; c < 10; c++) {
    for (let r = 0; r < digit[number][c].length; r++) {
      if (digit[number][c][r]) {
        context.beginPath()
        context.arc(x + r * 2 * (RADIUS + 1), y + c * 2 * (RADIUS + 1), RADIUS, 0, 2 * Math.PI)
        context.fill()
      }
    }
  }
}
var drawBall = function (context) {
  for (let i = 0; i < balls.length; i++) {
    context.fillStyle = balls[i].c
    context.beginPath()
    context.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI)
    context.fill()
  }
}
