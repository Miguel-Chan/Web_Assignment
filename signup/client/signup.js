function usernameCheck(name) {
    if (name.length > 18 || name.length < 6) return false;
    let pat = /^[a-zA-Z][0-9a-zA-Z]\w{4,16}/;
    return pat.test(name);
}

function numberCheck(num) {
    if (num.length !== 8) return false;
    let pat = /^[1-9]\d{7}/;
    return pat.test(num);
}

function phoneCheck(phone) {
    if (phone.length !== 11) return false;
    let pat = /^[1-9]\d{10}/;
    return pat.test(phone);
}

function emailCheck(addr) {
    let pat = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return pat.test(addr);
}
window.onload = function () {
    $("#reset").click(function () {
        $("[type=text]").val("");
    });
    $("#submit").click(function () {
        let name = $("[name=username]").val();
        let telephone = $("[name=phone]").val();
        let number = $("[name=number]").val();
        let mail = $("[name=mail]").val();
        if (!(usernameCheck(name) && phoneCheck(telephone) && numberCheck(number) && emailCheck(mail))) {
            $("#msg").text("注册信息有误，请检查后重试");
            return;
        }
        $.post("/", {'username': name, "number": number, "phone": telephone, "mail": mail}).done(function (data) {
            window.location.href = `?username=${name}`;
        }).fail(function (xhr, data) {
            let responseVal = parseInt(xhr.responseText);
            if (responseVal % 3 === 0) {
                $("#msg").text("注册用户名重复，请检查后重试");
            }
            else if (responseVal % 4 === 0) {
                $("#msg").text("注册学号重复，请检查后重试");
            }
            else if (responseVal % 7 === 0) {
                $("#msg").text("注册电话重复，请检查后重试");
            }
            else if (responseVal % 11 === 0) {
                $("#msg").text("注册邮箱重复，请检查后重试");
            }
        })
    });
    $("#username-checker").text("6~18位英文字母、数字或下划线，必须以英文字母开头");
    $("#phone-checker").text("11位数字，不能以0开头");
    $("#number-checker").text("8位数字，不能以0开头");
    $("[name=username]").focus(function () {
        $("#username-checker").text("");
    }).blur(function () {
        let text = $("[name=username]").val();
        if (usernameCheck(text)) {
            $.post("/", {'username': text}).done(function (data) {
                $("#username-checker").text("√").removeClass("invalid").addClass("valid");
            }).fail(function (xhr, data) {
                $("#username-checker").text("用户名存在重复，请修改后重试").removeClass("valid").addClass("invalid");
            })
        }
        else {
            $("#username-checker").text("用户名格式错误，要求：6~18位英文字母、数字或下划线，必须以英文字母开头").removeClass("valid").addClass("invalid");
        }
    });
    $("[name=number]").focus(function () {
        $("#number-checker").text("");
    }).blur(function () {
        let text = $("[name=number]").val();
        if (numberCheck(text)) {
            $.post("/", {'number': text}).done(function (data) {
                $("#number-checker").text("√").removeClass("invalid").addClass("valid");
            }).fail(function (xhr, data) {
                $("#number-checker").text("学号存在重复，请修改后重试").removeClass("valid").addClass("invalid");
            })
        }
        else {
            $("#number-checker").text("学号格式错误，要求：8位数字，不能以0开头").removeClass("valid").addClass("invalid");
        }
    });
    $("[name=phone]").focus(function () {
        $("#phone-checker").text("");
    }).blur(function () {
        let text = $("[name=phone]").val();
        if (phoneCheck(text)) {
            $.post("/", {'phone': text}).done(function (data) {
                $("#phone-checker").text("√").removeClass("invalid").addClass("valid");
            }).fail(function (xhr, data) {
                $("#phone-checker").text("电话存在重复，请修改后重试").removeClass("valid").addClass("invalid");
            })
        }
        else {
            $("#phone-checker").text("电话格式错误，要求：11位数字，不能以0开头").removeClass("valid").addClass("invalid");
        }
    });

    $("[name=mail]").focus(function () {
        $("#email-checker").text("");
    }).blur(function () {
        let text = $("[name=mail]").val();
        if (emailCheck(text)) {
            $.post("/", {'mail': text}).done(function (data) {
                $("#email-checker").text("√").removeClass("invalid").addClass("valid");
            }).fail(function (xhr, data) {
                $("#email-checker").text("邮箱存在重复，请修改后重试").removeClass("valid").addClass("invalid");
            })
        }
        else {
            $("#email-checker").text("邮箱格式错误").removeClass("valid").addClass("invalid");
        }
    })
};
