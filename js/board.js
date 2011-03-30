// target frames per second
const FPS = 30;

var canvas = null;
var context2D = null;

// the state
var state;

// the images
var images;

$(document).ready(function(){
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
    images = new Array(2);
    images[0] = {};
    images[1] = {};

    // blank squares
    images[0].F = new Image();
    images[0].F.src = "img/b.gif";
    images[1].F = new Image();
    images[1].F.src = "img/w.gif";

    // black queens
    images[0].B = new Image();
    images[0].B.src = "img/bkb.gif";
    images[1].B = new Image();
    images[1].B.src = "img/bkw.gif";

    // white queens
    images[0].W = new Image();
    images[0].W.src = "img/wkb.gif";
    images[1].W = new Image();
    images[1].W.src = "img/wkw.gif";

    // arrows
    images[0].A = new Image();
    images[0].A.src = "img/akb.gif";
    images[1].A = new Image();
    images[1].A.src = "img/akw.gif";
};

var initCanvas = function() {
    // get a handle on the canvas and the context
    canvas = document.getElementById('amazons');
    context2D = canvas.getContext('2d');

    // set the refresh interval
    setInterval(drawBoard, FPS / 1000);

    // add mouse event handlers to the canvas
    //canvas.addEventListener("click", , false);
};

var drawBoard = function() {
    for (var x = 0; x < 10; x++) {
        for (var y = 0; y < 10; y++) {
            if (x % 2 == y % 2) {
                // both odd or both even, it's a a white square
                context2D.drawImage(images[0][state[x][y]], x*50, y*50);
            }
            else {
                // otherwise it's a black square
                context2D.drawImage(images[1][state[x][y]], x*50, y*50);
            }
        }
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
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);

    var cell = [x,y];
    return cell;
};
