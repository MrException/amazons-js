// target frames per second
const FPS = 20;

var canvas = null;
var ctx = null;

var cellDim = 50;
var offset = 50;
var width = 600;
var height = 600;

// mouse positions
var mx = -1;
var my = -1;
var absx = -1;
var absy = -1;

// some vars for the move
var move = [];
var moveCounter = 0;

// is it our turn?
var ourTurn = 1;

// what colour are we?
var ourSide = 'W';

// the state
var state;

// the images
var images;

$(document).ready(function(){
    var socket = new io.Socket();
    socket.connect();

    initState();
    initCanvas();
});

var initState = function(){
    state = new Array(10);

    for (var x = 0; x < 10; x++) {
        state[x] = new Array(10);
        for (var y = 0; y < 10; y++) {
            state[x][y] = 'F';
        }
    }

    state[3][0] = 'B';
    state[6][0] = 'B';
    state[0][3] = 'B';
    state[9][3] = 'B';

    state[0][6] = 'W';
    state[9][6] = 'W';
    state[3][9] = 'W';
    state[6][9] = 'W';

    // images
    images = {};
    images.W = new Image();
    images.W.src = "img/white.png";
    images.B = new Image();
    images.B.src = "img/black.png";

    // TODO: maybe get an image for arrow instead of just black square?
    //images.A = new Image();
    //images.A.src = "";
};

var initCanvas = function() {
    // get a handle on the canvas and the context
    canvas = document.getElementById('amazons');

    canvas.addEventListener("mousemove", getCursorPosition, false);
    canvas.addEventListener("click", mouseClick, false);
    ctx = canvas.getContext('2d');

    // set the refresh interval
    setInterval(drawBoard, FPS / 1000);

    // add mouse event handlers to the canvas
    //canvas.addEventListener("click", , false);
};

var drawBoard = function() {
    // clear the screen
    ctx.clearRect(0,0,width,height);

    // draw the grid using a path
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    for (var x = 0; x < 10; x++) {
        ctx.moveTo(x*cellDim+offset,offset);
        ctx.lineTo(x*cellDim+offset,height-offset);
        for (var y = 0; y < 10; y++) {
            ctx.moveTo(offset,y*cellDim+offset);
            ctx.lineTo(width-offset,y*cellDim+offset);

            // also place images for queens
            if (state[x][y] === 'B' || state[x][y] === 'W') {
                ctx.drawImage(images[state[x][y]], x*cellDim+offset, y*cellDim+offset);
            }
            // and a black square for the arrows
            else if (state[x][y] === 'A') {
                ctx.fillRect(x*cellDim+offset,y*cellDim+offset,cellDim,cellDim);
            }
        }
    }

    // need to draw the last two lines, the bottom and the rightmost
    ctx.moveTo(10*cellDim+offset,offset);
    ctx.lineTo(10*cellDim+offset,height-offset);
    ctx.moveTo(offset,10*cellDim+offset);
    ctx.lineTo(width-offset,10*cellDim+offset);
    ctx.stroke();

    // draw a nice red square wherever the mouse is
    if (mx > -1 && my > -1) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FF0000";
        ctx.strokeRect(mx*cellDim+offset,my*cellDim+offset,cellDim,cellDim);
        ctx.lineWidth = 1;
    }
};

var getCursorPosition = function(e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    // figure out if it is in a square or not
    if (x > offset && x < width-offset && y > offset && y < height-offset) {
        mx = Math.floor((x - offset) / cellDim);
        my = Math.floor((y - offset) / cellDim);
    }
    else {
        mx = -1;
        my = -1;
    }

    $("#debug").html("<p>Mouse Pos: (" + mx + "," + my + ")</p>");
};

var mouseClick = function() {
    if (ourTurn === 1) {
        if (moveCounter === 0) {
            if (state[mx][my] === ourSide) {
                moveCounter = 1;
                move[0] = mx;
                move[1] = my;
                state[mx][my] = 'F';
            }
            else {
                resetMove();
            }
        }
        else if (moveCounter === 1) {
            if (state[mx][my] === 'F') {
                moveCounter = 2;
                move[2] = mx;
                move[3] = my;
                state[mx][my] = ourSide;
            } 
            else {
                // can't move there!
                // make sure to reset where the queen was
                state[move[0]][move[1]] = ourSide;
                resetMove();
            }
        }
        else if (moveCounter === 2) {
            if (state[mx][my] === 'F') {
                move[4] = mx;
                move[5] = my;
                state[mx][my] = 'A';
                moveCounter = 0;
                sendMove();
            }
            else {
                resetMove();
            }
        }
        else {
            // shouldn't get here
            resetMove();
        }
    }
};

var resetMove = function() {
    move = [];
    moveCounter = 0;
};

var sendMove = function() {
    $("#move").html("<p>Move complete: from: (" + move[0] + "," + move[1] + ") to: (" + move[2] + "," + move[3] + ") arrow: (" + move[4] + "," + move[5] + ")</p>");
};

var getMove = function() {

};
