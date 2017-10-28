/**
 * Created by Miguel on 2017/10/22.
 */
'use strict';

var drawing;
var context;
var finish = false;
var hasFailed = true;
var isIn = false;



function initialize() {
    if (drawing.getContext) {
        context = drawing.getContext("2d");
        drawing.width = 510;
        drawing.height = 370;
        printUp("#EDEDED");
        printDown("#EDEDED");
        context.beginPath();
        context.fillStyle = "#83FF79";
        context.rect(5, 245, 40, 40);
        context.closePath();
        context.fill();
        context.stroke();
        context.beginPath();
        context.fillStyle = "#807BFC";
        context.rect(465, 245, 40, 40);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = "#000000";
        context.font = "bolder 38px Arial";
        context.textAlign = "center";
        context.fillText("S", 25, 278);
        context.fillText("E", 485, 278)
    }
    else alert("Your browser does not support canvas! Please use another browser and try again!");
}

function printUp(color) {
    context.fillStyle = color;
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo(5, 60);
    context.lineTo(505, 60);
    context.lineTo(505, 240);
    context.lineTo(400, 240);
    context.lineTo(400, 120);
    context.lineTo(110, 120);
    context.lineTo(110, 240);
    context.lineTo(5, 240);
    context.closePath();
    context.fill();
    context.stroke();
}
function printDown(color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(5, 290);
    context.lineTo(160, 290);
    context.lineTo(160, 170);
    context.lineTo(350, 170);
    context.lineTo(350, 290);
    context.lineTo(505, 290);
    context.lineTo(505, 360);
    context.lineTo(5, 360);
    context.closePath();
    context.fill();
    context.stroke();
}

function isInUpArea(x, y) {
    return ((y >= 60 && y <= 120) ||
        ((y > 120 && y <= 240) &&
        ((x >= 5 && x <= 110) ||
        (x >= 400 && x < 505))));
}

function isInDownArea(x, y) {
    return ((y >= 290 && y <= 360) ||
        ((y < 290 && y >= 170) &&
        (x >= 160 && x <= 350)));
}

function showMessage(text) {
    clearMessage();
    context.font = "bold 20px Arial";
    context.fillStyle = "#000000";
    context.fillText(text, 255, 20);
}

function isOnStartPoint(x, y) {
    return x >= 5 && x <= 45 && y >= 245 && y <= 285;
}

function isOnEndPoint(x, y) {
    return x >= 465 && y >= 245 && y <= 285;
}

function clearMessage() {
    context.clearRect(5, 0, 500, 30);
}

function mouseHandler(e) {
    e = e || window.event;
    let x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
    let y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
    x -= drawing.getBoundingClientRect().x || drawing.getBoundingClientRect().left;
    y -= drawing.getBoundingClientRect().y || drawing.getBoundingClientRect().top;
    finish = false;
    if(isInUpArea(x, y)) {
        if (isIn) {
            if (!hasFailed) {
                printUp("#ED2063");
                showMessage("Oops! You touched the wall! Try again!");
                hasFailed = true;
            }
        }
        else showMessage("Now go to the start point and start playing!")
    }
    else if(isInDownArea(x, y)) {
        if (isIn) {
            if(!hasFailed) {
                printDown("#ED2063");
                showMessage("Oops! You touched the wall! Try again!");
                hasFailed = true;
            }
        }
        else showMessage("Now go to the start point and start playing!")
    }
    else {
        printUp("#EDEDED");
        printDown("#EDEDED");
        if (hasFailed) clearMessage();
        if (isOnStartPoint(x, y)) {
            showMessage("You are off to go!");
            hasFailed = false;
            isIn = true;
        }
        else if (isOnEndPoint(x, y)) {
            finish = true;
            if (hasFailed) {
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
        hasFailed = true;
        isIn = false;
        printUp("#EDEDED");
        printDown("#EDEDED");
    })
};