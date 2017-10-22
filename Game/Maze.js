/**
 * Created by Miguel on 2017/10/22.
 */
'use strict';

let drawing;
let context;
let finish = false;
let hasFail = true;


function initialize() {
    if (drawing.getContext) {
        context = drawing.getContext("2d");
        drawing.width = 500;
        drawing.height = 370;
        printUp("#EDEDED");
        printDown("#EDEDED");
        context.beginPath();
        context.fillStyle = "#83FF79";
        context.rect(0, 245, 40, 40);
        context.closePath();
        context.fill();
        context.stroke();
        context.beginPath();
        context.fillStyle = "#807BFC";
        context.rect(460, 245, 40, 40);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = "#000000";
        context.font = "bolder 38px Arial";
        context.textAlign = "center";
        context.fillText("S", 20, 278);
        context.fillText("E", 480, 278)
    }
    else alert("Your browser does not support canvas! Please use another browser and try again!");
}

function printUp(color) {
    context.fillStyle = color;
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo(0, 60);
    context.lineTo(500, 60);
    context.lineTo(500, 240);
    context.lineTo(395, 240);
    context.lineTo(395, 120);
    context.lineTo(105, 120);
    context.lineTo(105, 240);
    context.lineTo(0, 240);
    context.closePath();
    context.fill();
    context.stroke();
}
function printDown(color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(0, 290);
    context.lineTo(155, 290);
    context.lineTo(155, 170);
    context.lineTo(345, 170);
    context.lineTo(345, 290);
    context.lineTo(500, 290);
    context.lineTo(500, 360);
    context.lineTo(0, 360);
    context.closePath();
    context.fill();
    context.stroke();
}

function isInUpArea(x, y) {
    return ((y >= 60 && y <= 120) ||
        ((y > 120 && y <= 240) &&
        ((x >= 0 && x <= 105) ||
        (x >= 395 && x < 500))));
}

function isInDownArea(x, y) {
    return ((y >= 290 && y <= 360) ||
        ((y < 290 && y >= 170) &&
        (x >= 155 && x <= 345)));
}

function showMessage(text) {
    clearMessage();
    context.font = "bold 20px Arial";
    context.fillStyle = "#000000";
    context.fillText(text, 250, 20);
}

function isOnStartPoint(x, y) {
    return x >= 0 && x <= 40 && y >= 245 && y <= 285;
}

function isOnEndPoint(x, y) {
    return x >= 460 && y >= 245 && y <= 285;
}

function clearMessage() {
    context.clearRect(0, 0, 500, 30);
}

function mouseHandler(e) {
    e = e || window.event;
    let x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
    let y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
    x -= drawing.getBoundingClientRect().x;
    y -= drawing.getBoundingClientRect().y;
    finish = false;
    if(isInUpArea(x, y)) {
        if (!hasFail) {
            printUp("#ED2063");
            showMessage("Oops! You touched the wall! Try again!");
            hasFail = true;
        }
        else showMessage("Now go to the start point and start playing!")
    }
    else if(isInDownArea(x, y)) {
        if (!hasFail) {
            printDown("#ED2063");
            showMessage("Oops! You touched the wall! Try again!");
            hasFail = true;
        }
        else showMessage("Now go to the start point and start playing!")
    }
    else {
        printUp("#EDEDED");
        printDown("#EDEDED");
        if (hasFail) clearMessage();
        if (isOnStartPoint(x, y)) {
            showMessage("You are off to go!");
            hasFail = false;
        }
        else if (isOnEndPoint(x, y)) {
            finish = true;
            if (hasFail) {
                showMessage("Please don't cheat. Go back and restart! ");
            }
            else {
                showMessage("Congrats! You have finished the maze! ");
            }
        }
    }
}

window.onload = function () {
    drawing = document.getElementById("maze");
    initialize();
    drawing.addEventListener("mousemove", mouseHandler);
    drawing.addEventListener("mouseout", function () {
        if(!finish) clearMessage();
        hasFail = true;
        printUp("#EDEDED");
        printDown("#EDEDED");
    })
};