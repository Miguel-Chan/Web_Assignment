/**
 * Created by Miguel on 2017/9/27.
 */
function calculate()
{
    var formula = document.getElementsByName("formula").item(0);
    if (formula.value.length === 0) {
        alert("未输入表达式！");
        return;
    }
    for(var ele of formula.value) {
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
function add_number(num)
{
    var formula = document.getElementsByName("formula").item(0);
    formula.value += num;
}
function add_sign(sign)
{
    var formula = document.getElementsByName("formula").item(0);
    formula.value += sign;
}
function clearall()
{
    var formula = document.getElementsByName("formula").item(0);
    formula.value = "";
}
function backspace()
{
    var formula = document.getElementsByName("formula").item(0);
    if (formula.value.length === 0) alert("The expression is already empty.");
    else {
        formula.value = formula.value.substr(0, formula.value.length - 1);
    }
}