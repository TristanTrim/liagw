
//Fuck this shit eh!!!

document.body.style.backgroundColor = "black";

//function mouseMove(e){
//    canvas.setPointerCapture(e.pointerId);
//    canvas.onpointermove = mouseMove2;
//}

function mouseMove(e){
    x = e.pageX;
    y = e.pageY;
    things[0][0]=x;
    things[0][1]=y;
}

function hlProximalThing(){
    let closest = 0;
    for (i=1;i<things.length;i++){
        //if(closest==0){
            if(close(things[0],things[i])){
                things[i][3]=true;
            }else{
                things[i][3]=false;
            }
        //}
    }
}

function close(thing1,thing2){
    x1=thing1[0];
    y1=thing1[1];
    x2=thing2[0];
    y2=thing2[1];
    r1=thing1[2];
    r2=thing2[2];
    return(Math.abs(x1-x2)**2+Math.abs(y1-y2)**2 < (r1+r2)**2);
}
var w = window.innerWidth;
var h = window.innerHeight;
var canvas = document.getElementById('canvas');

var things = [];
things.push([canvas.width/2,canvas.height/2,13],false);
things.push([10,20,4,false]);
things.push([20,20,4,false]);
things.push([30,20,4,false]);

fuck_you=20;
canvas.width=window.innerWidth-fuck_you;
canvas.height=window.innerHeight-fuck_you;

if (canvas.getContext)
{
    var ctx = canvas.getContext('2d');
}
function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawCircle(coords){
    x=coords[0];
    y=coords[1];
    r=coords[2];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    if(coords[3]){
        ctx.strokeStyle = '#DDFFFF';
    }else{
        ctx.strokeStyle = '#00FF00';
    }
    ctx.stroke();
}

// This should be based on activity, rather than constant, but... yeah.
function tic(){
    hlProximalThing();
    clear();
    for(i=0;i<things.length;i++){
        drawCircle(things[i]);
    }
    setTimeout(tic,39);
}
tic();

