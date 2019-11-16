

//Fuck this shit eh!!!

document.body.style.backgroundColor = "black";

//function mouseMove(e){
//    canvas.setPointerCapture(e.pointerId);
//    canvas.onpointermove = mouseMove2;
//}

function mouseMove(e){
    x = e.pageX;
    y = e.pageY;
    moveCircle(x,y);
}

var w = window.innerWidth;
var h = window.innerHeight;

var canvas = document.getElementById('canvas');

fuck_you=20;
canvas.width=window.innerWidth-fuck_you;
canvas.height=window.innerHeight-fuck_you;

if (canvas.getContext)
{
    var ctx = canvas.getContext('2d');
    var X = canvas.width / 2;
    var Y = canvas.height / 2;
    var R = 13;
    ctx.beginPath();
    ctx.arc(X, Y, R, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#00FF00';
    ctx.stroke();
}

function moveCircle(x,y){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, R, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#00FF00';
    ctx.stroke();
}

