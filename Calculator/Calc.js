/**
 * Created by Miguel on 2017/9/27.
 */
'use strict';

function addClickAction(target, action)
{
    try {
        target.addEventListener("click", action);
    }
    catch(e) {
        target.onclick = action;
    }
}

function calculate()
{
    let formula = document.getElementsByName("formula").item(0);
    if (formula.value.length === 0) {
        msg.innerText = "未输入表达式！";
        showing = true;
        return;
    }

    try {
        for(let i = 0; i < formula.value.length; i++) {
            if(!(formula.value[i] >= '(' && formula.value[i] <= '9') ||
                formula.value[i] === ',' ||
                (i < formula.value.length-1 && formula.value[i] === '/' && formula.value[i+1] === '/')) {
                throw new Error();
            }
        }
        let calculate_result = eval(formula.value);
        if(calculate_result === Infinity || calculate_result === -Infinity || isNaN(calculate_result)) {
            alert("表达式存在数值错误，请检查后重试");
            msg.innerText = "表达式存在数值错误，请检查后重试";
        }
        else
            msg.innerText = "运算结果：" + calculate_result;
        showing = true;
    }
    catch (error) {
        alert("表达式出错，请检查后重试");
        msg.innerText = "表达式出错，请检查后重试";
        showing = true;
    }
}
function addCharacter()
{
    if (showing === true) {
        showing = false;
        msg.innerText = "";
    }
    let formula = document.getElementsByName("formula").item(0);
    formula.value += this.value;
}
function clearAll()
{
    if (showing === true) {
        showing = false;
        msg.innerText = "";
    }
    let formula = document.getElementsByName("formula").item(0);
    formula.value = "";
}
function backspace()
{
    if (showing === true) {
        showing = false;
        msg.innerText = "";
    }
    let formula = document.getElementsByName("formula").item(0);
    if (formula.value.length === 0) {
        msg.innerText = "表达式已清空！";
        showing = true;
    }
    else {
        formula.value = formula.value.substr(0, formula.value.length - 1);
    }
}

var msg;
var showing;

window.onload = function ()
{
    let numbers = document.getElementsByClassName("number");
    let signs = document.getElementsByClassName("sign");
    msg = document.getElementById("result");
    showing = false;
    for (let number of numbers) {
        addClickAction(number, addCharacter)
    }
    for (let sign of signs) {
        addClickAction(sign, addCharacter);
    }
    addClickAction(document.getElementById("calculate"), calculate);
    addClickAction(document.getElementById("clear"), clearAll);
    addClickAction(document.getElementById("backspace"), backspace);
}


