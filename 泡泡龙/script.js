document.onload = init();

function init() {
    drawDragon();
    addEventDelegation();
}

function drawDragon() {
    let cvs = document.getElementsByTagName("canvas")[0];
    let ctx = cvs.getContext("2d");

    let img = new Image();
    img.src = "./hd.jpg";

    img.onload = function () {
        // 设置画布大小
        cvs.width = img.width;
        cvs.height = img.height;

        // 画图获取imgData后清除canvas
        ctx.drawImage(img, 0, 0);
        let imgData = ctx.getImageData(0, 0, img.width, img.height).data;
        cvs.style.display = "none";

        // 将多大的像素块视为一个气泡
        let unit = 10; //单位

        // 循环判断是否添加气泡
        for (let h = 0; h < img.height; h += unit) {
            for (let w = 0; w < img.width; w += unit) {
                let position = (img.width * h + w) * 4;
                let r = imgData[position],
                    g = imgData[position + 1],
                    b = imgData[position + 2];
                if (r + g + b == 0) {
                    drawBubble(h, w);
                }
            }
        }

        // 添加气泡
        function drawBubble(h, w) {
            let bubble = document.createElement("img");
            bubble.src = "./bubble.png";
            bubble.setAttribute("class", "bubble");
            bubble.style.left = w * 2 - 12 + "px";
            bubble.style.top = h * 2 - 12 + "px";
            bubble.style.animationDuration = Math.random() * 6 + 4 + "s";

            // 挂载节点
            let container = document.getElementById("container");
            container.appendChild(bubble);
        }
    };
}

function addEventDelegation() {
    let container = document.getElementById("container");
    container.addEventListener("click", clickHandle);

    function clickHandle(e) {
        e.target.style.opacity = "0";
    }
}
