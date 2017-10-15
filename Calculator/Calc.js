/**
 * Created by Miguel on 2017/9/27.
 */

function addClickAction(target, action) {
    try {
        target.addEventListener("click", action);
    }
    catch(e) {
        target.onclick = action;
    }
}

const numbers = document.getElementsByClassName("number");
const signs = document.getElementsByClassName("sign");

for(let number of numbers) {
    addClickAction(number, addCharacter)
}
for(let sign of signs) {
    addClickAction(sign, addCharacter);
}
addClickAction(document.getElementById("calculate"), calculate);
addClickAction(document.getElementById("clear"), clearAll);
addClickAction(document.getElementById("backspace"), backspace);


function calculate()
{
    let formula = document.getElementsByName("formula").item(0);
    if (formula.value.length === 0) {
        alert("未输入表达式！");
        return;
    }
    for(let ele of formula.value) {
        if(!((ele >= '0' && ele <= '9') || ele === '*' || ele === '/' ||
            ele === '(' || ele === ')' || ele === '+' || ele === '-' || ele === '.')) {
            alert("表达式输入有误，请输入正确格式的表达式！");
            return;
        }
    }
    try {
        alert("运算结果：" + eval(formula.value));
    }
    catch (error) {
        alert("表达式有误，" + error.message)
    }
}
function addCharacter()
{
    let formula = document.getElementsByName("formula").item(0);
    formula.value += this.value;
}
function clearAll()
{
    let formula = document.getElementsByName("formula").item(0);
    formula.value = "";
}
function backspace()
{
    let formula = document.getElementsByName("formula").item(0);
    if (formula.value.length === 0) alert("The expression is already empty.");
    else {
        formula.value = formula.value.substr(0, formula.value.length - 1);
    }
}