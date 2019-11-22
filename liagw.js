
//Fuck this shit eh!!!

document.body.style.backgroundColor = "black";

// this may come in handy later
//function mouseMove(e){
//    canvas.setPointerCapture(e.pointerId);
//    canvas.onpointermove = mouseMove2;
//}
//


// Mouse motion

var state = "normal";
var selectionState = "normal";// normal, closest
var lasty = 0;
var lastx = 0;
function mouseMove(e){
    dx = (e.pageX-lastx);
    dy = (e.pageY-lasty);
    if(state=="normal"){
        //drawstacks.cursor.cursor[0]+=dx;
        //drawstacks.cursor.cursor[1]+=dy;
        drawstacks.cursor.cursor[0]=e.pageX;
        drawstacks.cursor.cursor[1]=e.pageY;
    }else if(state=="scaling"){
        drawstacks.cursor.cursor[0]=e.pageX;
        drawstacks.cursor.cursor[1]=e.pageY;
        drawstacks.cursor.cursor[2]-=dy;
        selectionState="normal";
        if(drawstacks.cursor.cursor[2]<1){
            drawstacks.cursor.cursor[2]=1;
            selectionState="closest";
        }
    }else if(state=="grabbing"){
        drawstacks.cursor.cursor[0]+=dx;
        drawstacks.cursor.cursor[1]+=dy;
        for(key in drawstacks.normal){
            if(drawstacks.normal[key][3]){
                drawstacks.normal[key][0]+=dx;
                drawstacks.normal[key][1]+=dy;
            }
        }
    }else if(state=="looking"){
        drawstacks.cursor.cursor[0]=e.pageX;
        drawstacks.cursor.cursor[1]=e.pageY;
        splode.offset += circleInput(splode.x,splode.y);
        if(splode.offset>splode.list.length){
            splode.offset-=splode.list.length;
        }else if(splode.offset<0){
            splode.offset+=splode.list.length;
        }
    }
    lastx = e.pageX;
    lasty = e.pageY;
}
var lastAng = 0;
var wheelInputSpeed = 0.05;
function circleInput(orx,ory){
    let x=lastx-orx;
    let y=lasty-ory;
    //fuck circles
    let dRot = (y>0?dx:-dx) + (x<0?dy:-dy);// screw fancy math
    return(wheelInputSpeed*dRot);
}
// Keyboard stuff

normalKeycodes={
    "KeyS":function(){state="scaling"},
    "KeyF":function(){state="grabbing"},
    "KeyD":function(){
        state="looking";
        keycodes=wheelKeycodes;
        propSplode(getClosestThing());
       // if(state=="looking"){
       //     wheelInputSpeed=0.5;
       // }else{
       //     state="looking";
       //     propSplode(getClosestThing());
       // }
    },
    "KeyW":function(){state="normal"},
    "KeyG":()=>{call(getClosestThing())}
}

wheelKeycodes={
    //exit out
    "KeyW":()=>{state="normal";keycodes=normalKeycodes;},
    //resize wheel
    "KeyS":()=>{splode.rad += -5*circleInput(splode.x,splode.y);},
    //speed up scroll
    "KeyD":()=>{wheelInputSpeed=0.5;},
    //move circle
    "KeyF":()=>{splode.x+=dx;splode.y+=dy;},// buggy as heck. Make a target abstraction so you can do the mousemove function nice!
    //call
    "KeyG":()=>{call(splode.highlighted)},
    //breakout
    //if no selection, current highlight, otherwise selected only
    "KeyC":()=>{mkThing(splode.highlighted);},
    //select
    "KeyV":()=>{}
}

keycodes=normalKeycodes;
function keydown(e){
    keycodes[e.code]();
}
function keyup(e){
    //ad hoc bullony out!!!
    if(state!="looking"){
        state="normal";
    }
    wheelInputSpeed=0.05;
}



// make it work on not window!!! REEE
function mkThing(thingable){
    drawstacks.normal[thingable]=[lastx,lasty,3,false];
}
function call(callable){
    window[callable]();
}

//wheel functionality

var splode = {};
function propSplode(thing){
    //ob = getSingleSelection();
    splode = {};
    splode.x = drawstacks.normal[thing][0];
    splode.y = drawstacks.normal[thing][1];
    splode.rad = 60;
    thingob = window[thing];
    if(thingob instanceof Array){
        splode.list = thingob;
    }else{
        splode.list = Object.keys(thingob);
    }
    splode.offset = 0;
    splode.readStart = -Math.PI/3;
    splode.readEnd = Math.PI/3;
    splode.readSpan = splode.readEnd - splode.readStart;
    splode.scrollSpan = 2*Math.PI - splode.readSpan;
    splode.nRead=8;
    splode.readTic= splode.readSpan / splode.nRead;
    splode.scrollTic= splode.scrollSpan / (splode.list.length - splode.nRead);
    splode.draw = function(){
        let pos = splode.readStart;//splode.offset;
        let r = 3;
        //for (item in splode.list){
        let j = 0;
        for (let i = splode.offset; i<splode.list.length+splode.offset; i++){
            index = Math.floor(i%splode.list.length);
            item = splode.list[index];
            j++;
            highlight=false;
            if(j==6){
               //set item to be highlighted
               highlight = true;
               splode.highlighted = item;
            }
            let x = Math.cos(pos)*splode.rad+splode.x;
            let y = Math.sin(pos)*splode.rad+splode.y;
            if(index==0){
                ctx.beginPath();
                ctx.moveTo(splode.x,splode.y);
                ctx.lineTo(x,y);
                ctx.stroke();
            }
            if(pos>splode.readStart && pos<splode.readEnd){//in the read zone
                pos += splode.readTic;
                // print textual information
                ctx.strokeText(item.toString(),x+7,y+3);
                r = 2;
            }else{
                pos += splode.scrollTic;
                r = 0.4;
            }
            coords=[x,y,r,highlight];
            drawCircle(coords);
            if(pos>Math.PI){
                pos-=2*Math.PI;
            }
        }
    };
}



// cursor behavior

function getClosestThing(){
    let first = true;
    let closest;
    let closestDist;
    for (key in drawstacks.normal){
        if (first){
            closest = key;
            closestDist = getDist(
                drawstacks.cursor.cursor,drawstacks.normal[key]
            );
            first = false;
        }
        let dist = getDist(
            drawstacks.cursor.cursor,drawstacks.normal[key]
        );
        if(dist < closestDist){
            closest = key;
            closestDist = dist;
        }
    }
    console.log(closest);
    console.log(closestDist);
    return(closest);
}
function hlClosestThing(){
    let first = true;
    let closestDist;
    let closest;
    for (key in drawstacks.normal){
        drawstacks.normal[key][3]=false;//not drawing
        if (first){
            closest = key;
            closestDist = getDist(
                drawstacks.cursor.cursor,drawstacks.normal[key]
            );
            first = false;
        }
        let dist = getDist(
            drawstacks.cursor.cursor,drawstacks.normal[key]
        );
        if(dist < closestDist){
            closest = key;
            closestDist = dist;
        }
    }
    drawstacks.normal[closest][3]=true;
}
function hlProximalThing(){
    for (key in drawstacks.normal){
        if(close(drawstacks.cursor.cursor,drawstacks.normal[key])){
            drawstacks.normal[key][3]=true;
        }else{
            drawstacks.normal[key][3]=false;
        }
    }
}

function close(thing1,thing2){
    return(getDist(thing1,thing2) < (r1+r2)**2);
}
function getDist(thing1,thing2){
    x1=thing1[0];
    y1=thing1[1];
    x2=thing2[0];
    y2=thing2[1];
    r1=thing1[2];
    r2=thing2[2];
    return(Math.abs(x1-x2)**2+Math.abs(y1-y2)**2);
}


// canvas hubbub

var w = window.innerWidth;
var h = window.innerHeight;
var canvas = document.getElementById('canvas');

fuck_you=20;
canvas.width=window.innerWidth-fuck_you;
canvas.height=window.innerHeight-fuck_you;


// things
drawstacks = {
    "cursor":{"cursor":[canvas.width/2,canvas.height/2,13,false]},
    "normal":{"window":[canvas.width/3,canvas.height/3,4,false],
        "list_of_fruit":[2*canvas.width/3,canvas.height/3,4,false]
    }
}

if (canvas.getContext)
{
    var ctx = canvas.getContext('2d');
}
function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawCircle(coords){
    let x=coords[0];
    let y=coords[1];
    let r=coords[2];
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.lineWidth = 1;
    if(coords[3]){
        //highlighted
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#0077aa';
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();
    }else{
        //non highlighted
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();
    }
}

// This should be based on activity, rather than constant, but... yeah.
function tic(){
    clear();
    if(state=="normal"){
        if(selectionState=="normal"){
            hlProximalThing();
        }else if(selectionState=="closest"){
            hlClosestThing();
        }
        drawCircle(drawstacks.cursor.cursor);
    }
    else if(state=="scaling"){
        drawCircle(drawstacks.cursor.cursor);
        //drawCircle([lastx,lasty,drawstacks.cursor.cursor[2]]);
    }
    else if(state=="looking"){
        let cx = drawstacks.cursor.cursor[0];
        let cy = drawstacks.cursor.cursor[1];
        ctx.beginPath();
        ctx.moveTo(cx+3,cy+3);
        ctx.lineTo(cx-3,cy-3);
        ctx.moveTo(cx-3,cy+3);
        ctx.lineTo(cx+3,cy-3);
        ctx.stroke();
        splode.draw();
        //console.log(splode);
        //let x
        //let y
        //let r
        //let s
        //let n
        //drawCircle([x,y,r,s,n]);
    }
    for(key in drawstacks.normal){
        drawCircle(drawstacks.normal[key]);
    }
    setTimeout(tic,39);
}
tic();


// always keep a list of fruit around
// (thanks wikipedia)
list_of_fruit = [
    "Açaí",
    "Akee",
    "Apple",
    "Apricot",
    "Avocado",
    "Banana",
    "Bilberry",
    "Blackberry",
    "Blackcurrant",
    "Black sapote",
    "Blueberry",
    "Boysenberry",
    "Buddha's hand (fingered citron)",
    "Crab apples",
    "Currant",
    "Cherry",
    "Cherimoya (Custard Apple)",
    "Chico fruit",
    "Cloudberry",
    "Coconut",
    "Cranberry",
    "Cucumber",
    "Damson",
    "Date",
    "Dragonfruit (or Pitaya)",
    "Durian",
    "Elderberry",
    "Feijoa",
    "Fig",
    "Goji berry",
    "Gooseberry",
    "Grape",
    "Grapefruit",
    "Guava",
    "Honeyberry",
    "Huckleberry",
    "Jabuticaba",
    "Jackfruit",
    "Jambul",
    "Japanese plum",
    "Jostaberry",
    "Jujube",
    "Juniper berry",
    "Kiwano (horned melon)",
    "Kiwifruit",
    "Kumquat",
    "Lemon",
    "Lime",
    "Loganberry",
    "Loquat",
    "Longan",
    "Lychee",
    "Mango",
    "Mangosteen",
    "Marionberry",
    "Melon",
    "Miracle fruit",
    "Mulberry",
    "Nectarine",
    "Nance",
    "Orange",
    "Papaya",
    "Passionfruit",
    "Peach",
    "Pear",
    "Persimmon",
    "Plantain",
    "Plum",
    "Pineapple",
    "Pineberry",
    "Plumcot (or Pluot)",
    "Pomegranate",
    "Pomelo",
    "Purple mangosteen",
    "Quince",
    "Raspberry",
    "Rambutan (or Mamin Chino)",
    "Redcurrant",
    "Salal berry",
    "Salak",
    "Satsuma",
    "Soursop",
    "Star apple",
    "Star fruit",
    "Strawberry",
    "Surinam cherry",
    "Tamarillo",
    "Tamarind",
    "Tayberry",
    "Ugli fruit",
    "White currant",
    "White sapote",
    "Yuzu",
    "Avocado",
    "Bell pepper",
    "Chile pepper",
    "Corn kernel",
    "Cucumber",
    "Eggplant",
    "Jalapeño",
    "Olive",
    "Pea",
    "Pumpkin",
    "Squash",
    "Tomato",
    "Zucchini"
]
click_events = [
    "It's ok. You don't need to click anymore. You're free!",
    "Stop clicking!",
    "You can remap clicking to something useful in the input stream.",
    "Do you really want to be clicking? Really?",
    "The graphics are running on the CPU. Go shame the author!"
]

