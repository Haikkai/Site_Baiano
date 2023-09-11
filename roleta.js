var options = ["SIM", "NÃO", "SIM", "NÃO", "SIM", "NÃO"];
var colors = ["#f62a66", "#374955", "#ffd933", "#203541", "#2196f3", "#8bc34a"];
var startAngle = 14.875;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;
document.getElementById("spin").addEventListener("click", spin);
function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F, 1)) + nybHexString.substr(n & 0x0F, 1);
}
function RGB2Color(r, g, b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}
function getColor(item, maxitem) {
    var phase = 0;
    var center = 91;
    var width = 60;
    var frequency = Math.PI * 2 / maxitem;
    red = Math.sin(frequency * item + 2 + phase) * width + center;
    green = Math.sin(frequency * item + 0 + phase) * width + center;
    blue = Math.sin(frequency * item + 4 + phase) * width + center;
    return RGB2Color(red, green, blue);
}
function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var outsideRadius = 120;
        var textRadius = 33;
        var insideRadius = 0;
        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 140, 140);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = 'bold 17px Montserrat, Helvetica, Arial';
        for (var i = 0; i < options.length; i++) {
            var angle = startAngle + i * arc;
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.arc(125, 125, outsideRadius, angle, angle + arc, false);
            ctx.arc(125, 125, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur = 0;
            ctx.shadowColor = "rgb(220,220,220)";
            ctx.fillStyle = "black";
            if (i == 1 || i == 3 || i == 5) {
                ctx.fillStyle = "white";
            }
            ctx.translate(125 + Math.cos(angle + arc / 2) * textRadius, 125 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = options[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, -30);
            ctx.restore();
        }
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(3, 105);
        ctx.lineTo(13, 115);
        ctx.lineTo(3, 125);
        ctx.fill();
    }
}
function spin() {
    document.getElementById("layout").classList.toggle("show", false);
    document.getElementById("spinresult").innerHTML = "";
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
}
function rotateWheel() {
    spinTime += 10;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 10);
}
function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    degrees = degrees - 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    var text;
    if (index == 0) {
        text = options[index + 1];
    } else {
        text = options[index - 1];
    }
    console.log(index);
    document.getElementById("spinresult").innerHTML = text;
    document.getElementById("layout").classList.toggle("show", true);
    ctx.restore();
}
function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}
drawRouletteWheel();
