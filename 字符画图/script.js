let cvs = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
cvs.width = 800;
cvs.height = 400;

animation();

function animation() {
    //初始化图片
    let img = new Image();
    img.src = 'img.png';

    //一定要在图片加载后渲染
    img.onload = function () {
        //渲染图片
        ctx.drawImage(img, 0, 0);
        //获取图片像素矩阵
        let imgData = ctx.getImageData(0, 0, 800, 400).data;

        // var arr=["M","N","H","Q","$","O","C","?","7",">","!",":","–",";","."];
        let arr = ["M","N","H","Q","$","O","C","？","7","》","！","：","、","；","。"];
        let text = [];
        for (let i = 0; i < imgData.length; i += 8) {
            let r = imgData[i];
            let g = imgData[i + 1];
            let b = imgData[i + 2];
            let val = Math.floor((r + g + b) / 3 / 18);
            text.push(arr[val])
            if (i % 3200 === 0 && i !== 0) {
                text.push('<br>')
            }
        }

        let textNode = document.getElementById('text-area');
        textNode.innerHTML = text.join(',,,');
        document.body.append(textNode);
    }
}