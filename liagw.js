
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
var vary = 0;
var varx = 0;
function mouseMove(e){
    dx = (e.pageX-varx);
    dy = (e.pageY-vary);
    if(state=="normal"){
        //things[0][0]+=dx;
        //things[0][1]+=dy;
        things[0][0]=e.pageX;
        things[0][1]=e.pageY;
    }else if(state=="scaling"){
        things[0][2]-=dy;
        if(things[0][2]<1){
            things[0][2]=1;
        }
    }else if(state=="grabbing"){
        things[0][0]+=dx;
        things[0][1]+=dy;
        for (i=1;i<things.length;i++){
            if(things[i][3]){
                things[i][0]+=dx;
                things[i][1]+=dy;
            }
        }
    }else if(state=="looking"){
        things[0][0]=e.pageX;
        things[0][1]=e.pageY;
        splode.offset += e.pageY*dx*0.001;
        if(splode.offset>splode.list.length){
            splode.offset-=splode.list.length;
        }else if(splode.offset<0){
            splode.offset+=splode.list.length;
        }
    }
    varx = e.pageX;
    vary = e.pageY;
}

// Keyboard stuff

keycodes={
    "KeyS":function(){state="scaling"},
    "KeyF":function(){state="grabbing"},
    "KeyD":function(){state="looking";propSplode(getClosestThing());},
    "KeyW":function(){state="normal"}
}
var splode = {};
function propSplode(thing){
    //ob = getSingleSelection();
    splode = {};
    splode.x = thing[0];
    splode.y = thing[1];
    splode.rad = 60;
    splode.list = window[thing[4]];
    console.log(thing);
    console.log(splode.list);
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
        for (let i = splode.offset; i<splode.list.length+splode.offset; i++){
            item = splode.list[Math.floor(i%splode.list.length)];
            let x = Math.cos(pos)*splode.rad+splode.x;
            let y = Math.sin(pos)*splode.rad+splode.y;
            if(pos>splode.readStart && pos<splode.readEnd){//in the read zone
                pos += splode.readTic;
                // print textual information
                ctx.strokeText(item.toString(),x,y);
                r = 3;
            }else{
                pos += splode.scrollTic;
                r = 0.4;
            }
            coords=[x,y,r];
            drawCircle(coords);
            if(pos>Math.PI){
                pos-=2*Math.PI;
            }
        }
    };
}
function keydown(e){
    keycodes[e.code]();
}
function keyup(e){
    //ad hoc bullony out!!!
    if(state!="looking"){
        state="normal";
    }
}


// cursor behavior

function getClosestThing(){
    let closest = 1;
    let closestDist = getDist(things[0],things[1]);
    for (i=2;i<things.length;i++){
        let dist = getDist(things[0],things[i]);
        if(dist < closestDist){
            closest = i;
            closestDist = dist;
        }
        return(things[closest]);
    }
}
function hlProximalThing(){
    for (i=1;i<things.length;i++){
            if(close(things[0],things[i])){
                things[i][3]=true;
            }else{
                things[i][3]=false;
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

// these should be objects with attributes.
var things = [];
things.push([canvas.width/2,canvas.height/2,13,false]);//cursor
things.push([canvas.width/3,canvas.height/3,4,false,"window"]);//window
things.push([2*canvas.width/3,canvas.height/3,4,false,"list_of_fruit"]);//window,

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
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0077aa';
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();
    }else{
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();
    }
}

// This should be based on activity, rather than constant, but... yeah.
function tic(){
    clear();
    if(state=="normal"){
        hlProximalThing();
    }
    else if(state=="looking"){
        splode.draw();
        //console.log(splode);
        //let x
        //let y
        //let r
        //let s
        //let n
        //drawCircle([x,y,r,s,n]);
    }
    for(i=0;i<things.length;i++){
        drawCircle(things[i]);
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
