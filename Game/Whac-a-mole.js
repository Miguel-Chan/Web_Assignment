'use strict';

var playground;
var holes = [];
var isPlaying = false;
var pausing = false;
var current_index = 0;
var point = 0;
var time_interval;

function clockStart(time = 30) {
    let timer = document.getElementById("timer");
    timer.innerText = time;
    timer.className = "ease";
    let clockGo = function () {
        if (timer.innerText <= 10) timer.className = "alarm";
        if(timer.innerText === "0") {
            timer.className = "ease";
            timeOut();
        }
        else {
            timer.innerText -= 1;
        }
    };
    time_interval = setInterval(clockGo, 1000)
}


function gameSwitch() {
    let stage = document.getElementById("game-stage");
    if(isPlaying) {
        if(!pausing) {
            holes[current_index].checked = false;
            clearInterval(time_interval);
            stage.innerText = "Pausing...";
            stage.className = "ease";
            pausing = true;
        }
        else {
            holes[current_index].checked = true;
            clockStart(document.getElementById("timer").innerText);
            stage.innerText = "Playing";
            stage.className = "ease";
            pausing = false;
        }
    }
    else {
        point = 0;
        setPoint();
        setIndex(getRandomIndex());
        stage.innerText = "Playing";
        stage.className = "ease";
        isPlaying = true;
        clockStart();
    }
}

function getRandomIndex() {
    let r = Math.floor(Math.random() * 60);
    while (r === current_index) r = Math.floor(Math.random() * 60);
    return r;
}

function setIndex(i) {
    holes[current_index].checked = false;
    current_index = i;
    holes[current_index].checked = true;
}

function setPoint() {
    document.getElementById("point").innerText = point.toString();
}

function timeOut() {
    isPlaying = false;
    holes[current_index].checked = false;
    clearInterval(time_interval);
    let stage = document.getElementById("game-stage");
    stage.innerText = "Time's up!";
    stage.className = "alarm";
    alert("Time's up!\nYour Score: " + point);
}

function gameOver() {
    let stage = document.getElementById("game-stage");
    holes[current_index].checked = false;
    clearInterval(time_interval);
    stage.innerText = "Game Over!";
    stage.className = "alarm";
    alert("Sad! You have missed too many moles!");
    isPlaying = false;
}

function missHit() {
    if (point === 0) gameOver();
    else point--;
    setPoint();
}

function correctHit() {
    point++;
    setPoint();
    setIndex(getRandomIndex());
}

window.onload = function () {
    playground = document.getElementById("playground");
    document.getElementById("switch").addEventListener("click", gameSwitch);
    for (let i = 0; i < 60; i++) {
        let new_hole = document.createElement("input");
        new_hole.className = "holes";
        new_hole.type = "radio";
        new_hole.addEventListener("click", function (x) {
            return function () {
                if(!isPlaying) {
                    alert("Please click to start the game first!");
                    this.checked = false;
                }
                else {
                    if(!pausing) {
                        if (x !== current_index) {
                            missHit();
                            this.checked = false;
                        }
                        else correctHit();
                    }
                    else this.checked = false;
                }
            }
        }(i));
        playground.appendChild(new_hole);
        holes[i] = new_hole;
    }
};