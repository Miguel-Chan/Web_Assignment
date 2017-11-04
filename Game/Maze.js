/**
 * Created by Miguel on 2017/10/22.
 */
'use strict';

var drawing;
var context;
var finish = false;
var hasFailed = true;
var isIn = false;
var hasWin = false;



function initialize() {
    if (drawing.getContext) {
        context = drawing.getContext("2d");
        drawing.width = 510;
        drawing.height = 320;
        printUp("#EDEDED");
        printDown("#EDEDED");
        context.beginPath();
        context.fillStyle = "#83FF79";
        context.rect(5, 195, 40, 40);
        context.closePath();
        context.fill();
        context.stroke();
        context.beginPath();
        context.fillStyle = "#807BFC";
        context.rect(465, 195, 40, 40);
        context.closePath();
        context.fill();
        context.stroke();
        context.fillStyle = "#000000";
        context.font = "bolder 38px Arial";
        context.textAlign = "center";
        context.fillText("S", 25, 228);
        context.fillText("E", 485, 228)
    }
    else alert("Your browser does not support canvas! Please use another browser and try again!");
}

function printUp(color) {
    context.fillStyle = color;
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo(5, 10);
    context.lineTo(505, 10);
    context.lineTo(505, 190);
    context.lineTo(400, 190);
    context.lineTo(400, 70);
    context.lineTo(110, 70);
    context.lineTo(110, 190);
    context.lineTo(5, 190);
    context.closePath();
    context.fill();
    context.stroke();
}
function printDown(color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(5, 240);
    context.lineTo(160, 240);
    context.lineTo(160, 120);
    context.lineTo(350, 120);
    context.lineTo(350, 240);
    context.lineTo(505, 240);
    context.lineTo(505, 310);
    context.lineTo(5, 310);
    context.closePath();
    context.fill();
    context.stroke();
}

function isInUpArea(x, y) {
    return ((y >= 10 && y <= 70) ||
        ((y > 70 && y <= 190) &&
        ((x >= 5 && x <= 110) ||
        (x >= 400 && x < 505))));
}

function isInDownArea(x, y) {
    return ((y >= 240 && y <= 310) ||
        ((y < 240 && y >= 120) &&
        (x >= 160 && x <= 350)));
}

function showMessage(text) {
    let msg = document.getElementById("message");
    if (msg.innerText !== text) {
        if (msg.className === "showing") {
            clearMessage();
            setTimeout(function () {
                msg.className = "showing";
                msg.innerText = text;
            }, 500);
        }
        else {
            msg.className = "showing";
            msg.innerText = text;
        }
    }
    else if (msg.className === "hiding") {
        msg.className = "showing";
    }
}

function isOnStartPoint(x, y) {
    return x >= 5 && x <= 45 && y >= 195 && y <= 235;
}

function isOnEndPoint(x, y) {
    return x >= 465 && y >= 195 && y <= 235;
}

function clearMessage() {
    document.getElementById("message").className = "hiding";
}

function mouseHandler(e) {
    e = e || window.event;
    let x = e.pageX || (e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
    let y = e.pageY || (e.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
    x -= drawing.getBoundingClientRect().x || drawing.getBoundingClientRect().left;
    y -= drawing.getBoundingClientRect().y || drawing.getBoundingClientRect().top;
    finish = false;
    if (!hasWin) {
        if (isInUpArea(x, y)) {
            if (isIn) {
                if (!hasFailed && !hasWin) {
                    printUp("#ED2063");
                    showMessage("Oops! You touched the wall! Try again!");
                    hasFailed = true;
                }
            }
            else showMessage("Now go to the start point and start playing!")
        }
        else if (isInDownArea(x, y)) {
            if (isIn) {
                if (!hasFailed && !hasWin) {
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
            if (isOnEndPoint(x, y)) {
                finish = true;
                if (hasFailed) {
                    showMessage("Don't cheat, you should start from 'S' and move to 'E' inside the maze!");
                }
                else {
                    showMessage("Congrats! You have finished the maze!");
                    hasWin = true;
                }
            }
            else clearMessage();
        }
    }
    if (isOnStartPoint(x, y)) {
        showMessage("You are off to go!");
        hasFailed = false;
        hasWin = false;
        isIn = true;
    }
}

window.onload = function () {
    drawing = document.getElementById("maze");
    initialize();
    drawing.addEventListener("mousemove", mouseHandler);
    drawing.addEventListener("mouseout", function () {
        if(!finish && !hasWin) clearMessage();
        hasFailed = true;
        isIn = false;
        printUp("#EDEDED");
        printDown("#EDEDED");
    });
    document.getElementById("message").className = "hiding";
};