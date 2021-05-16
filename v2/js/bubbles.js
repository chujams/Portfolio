let updateCircles = function(canvasElement) {
    let element = this;
    element.parentNode = canvasElement, element.getCanvasSize(),

    window.addEventListener("resize", function() {
        element.getCanvasSize()
    }),

    element.mouseX = 0, element.mouseY = 0,

    window.addEventListener("mousemove", function(canvasElement) {
        element.mouseX = canvasElement.clientX, element.mouseY = canvasElement.clientY
    }),

    element.randomize()
};

updateCircles.prototype.getCanvasSize = function() {
    this.canvasWidth = this.parentNode.clientWidth;
    this.canvasHeight = this.parentNode.clientHeight;
};

updateCircles.prototype.generateDecimalBetween = function(max, min) {
    return (Math.random() * (max - min) + min).toFixed(2)
};


updateCircles.prototype.update = function() {

    let circle = this;

    circle.translateX = circle.translateX - circle.movementX,
    circle.translateY = circle.translateY - circle.movementY,
    circle.posX += (circle.mouseX / (circle.staticity / circle.magnetism) - circle.posX) / circle.smoothing,
    circle.posY += (circle.mouseY / (circle.staticity / circle.magnetism) - circle.posY) / circle.smoothing,
    (circle.translateY + circle.posY < 0 || circle.translateX + circle.posX < 0 || circle.translateX + circle.posX > circle.canvasWidth) && (circle.randomize(), circle.translateY = circle.canvasHeight);
};

updateCircles.prototype.randomize = function() {

    let circle = this;

    circle.colors = ["255,198,81", "38,141,247", "66,52,248", "255,108,80", "243, 244, 255", "96, 100, 131"],
    circle.velocity = 30,
    circle.smoothing = 50,
    circle.staticity = 30,
    circle.magnetism = .1 + 4 * Math.random(),
    circle.color = circle.colors[Math.floor(Math.random() * circle.colors.length)],
    circle.alpha = circle.generateDecimalBetween(5, 10) / 10,
    circle.size = circle.generateDecimalBetween(1, 4),
    circle.posX = 0, circle.posY = 0,
    circle.movementX = circle.generateDecimalBetween(-4, 4) / circle.velocity,
    circle.movementY = circle.generateDecimalBetween(5, 30) / circle.velocity,
    circle.translateX = circle.generateDecimalBetween(0, circle.canvasWidth),
    circle.translateY = circle.generateDecimalBetween(0, circle.canvasHeight);
};

let renderCircles = function(canvasElement) {

    let circle = this;

    circle.canvas = document.getElementById(canvasElement),
    circle.ctx = circle.canvas.getContext("2d"),
    circle.dpr = window.devicePixelRatio
};

renderCircles.prototype.start = function() {

    let circle = this;

    circle.canvasSize(), window.addEventListener("resize", function() {
        circle.canvasSize()
    }),

    circle.bubblesList = [],
    circle.generateBubbles(),
    circle.animate()
};

renderCircles.prototype.canvasSize = function() {

    let circle = this;

    circle.container = circle.canvas.parentNode,
    circle.w = circle.container.offsetWidth,
    circle.h = circle.container.offsetHeight,
    circle.wdpi = circle.w * circle.dpr,
    circle.hdpi = circle.h * circle.dpr,
    circle.canvas.width = circle.wdpi,
    circle.canvas.height = circle.hdpi,
    circle.canvas.style.width = circle.w + "px", circle.canvas.style.height = circle.h + "px",
    circle.ctx.scale(circle.dpr, circle.dpr)
};

renderCircles.prototype.animate = function() {

    let circle = this;

    circle.ctx.clearRect(0, 0, circle.canvas.clientWidth, circle.canvas.clientHeight)

    circle.bubblesList.forEach(function(element) {
        element.update(),
        circle.ctx.translate(element.translateX, element.translateY),
        circle.ctx.beginPath(),
        circle.ctx.arc(element.posX, element.posY, element.size, 0, 2 * Math.PI),
        circle.ctx.fillStyle = "rgba(" + element.color + "," + element.alpha + ")",
        circle.ctx.fill(),
        circle.ctx.setTransform(circle.dpr, 0, 0, circle.dpr, 0, 0)
    }),requestAnimationFrame(circle.animate.bind(circle))
};

renderCircles.prototype.addBubble = function(circle) {
    return this.bubblesList.push(circle)
};

renderCircles.prototype.generateBubbles = function() {
    let circle = this;
    let amount = 35; // total circles allowed on screen
    for (let i = 0; i < amount; i++) {
        circle.addBubble(new updateCircles(circle.canvas.parentNode))
    }
};

window.addEventListener("load", function() {
    const circles = new renderCircles("canvas");
    circles.start()
});

window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t) {
    window.setTimeout(circles, 1000 / 60)
}
