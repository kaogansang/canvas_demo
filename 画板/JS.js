//获取DOM节点函数，element为节点标志
var e = function(element){
    return document.querySelector(element);
}

var lineWidth;
var lineColor;
e('#line-width').oninput = ()=>{
    lineWidth = e('#line-width').value;
    console.log(lineWidth);
}
e('#line-color').oninput = ()=>{
    lineColor = e('#line-color').value;
    console.log(lineColor);
}

//画标记，值为true时可以画
//画函数
var draw = function(startX,startY,context,element){
    context.beginPath();
    context.moveTo(startX,startY);
    function moveDraw(event){
        context.lineTo(event.offsetX,event.offsetY);
        // console.log(event.offsetX)
        context.lineWidth = lineWidth;
        context.strokeStyle = lineColor;
        context.stroke();
    }
    element.addEventListener('mousemove',moveDraw)
    element.addEventListener('mouseup',(event) => {
        element.removeEventListener('mousemove',moveDraw);
        // context.closePath();
    })
}
// watchMove(e('#work_space'));
//当鼠标按下时，开始画图
e('#canvas').addEventListener('mousedown',function(event){
    let context = this.getContext("2d");
    draw(event.offsetX,event.offsetY,context,this);
})

var saveToPng = function () {
    // console.log(e('#canvas').toDataURL("img/png"))
    return e('#canvas').toDataURL("img/png");
}
function downLoad(url){
    console.log('调用下载')
	var oA = document.createElement("a");
	oA.download = '';// 设置下载的文件名，默认是'下载'
    oA.href = url;
    document.body.appendChild(oA);
    oA.click();
    oA.remove(); // 下载之后把创建的元素删除
}
e('#save-btn').onclick = () => {downLoad(saveToPng())}