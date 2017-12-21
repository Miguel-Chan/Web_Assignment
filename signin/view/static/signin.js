function usernameCheck(name) {
    if (name.length > 18 || name.length < 6) return false;
    let pat = /^[a-zA-Z][0-9a-zA-Z]\w{4,16}/;
    return pat.test(name);
}

function passwordCheck(pass) {
    if (pass.length > 12 || pass.length < 6) return false;
    let pat = /^[1-9a-zA-Z-_]{6,12}/;
    return pat.test(pass);
}

window.onload = function () {
    $("#reset").click(function () {
        $("[type=text]").val("");
        $("[type=password]").val("");
        $(".checker").text("");
        $("#msg").text("");
    });
    $("#submit").click(function () {
        let name = $("[name=username]").val();
        let pass = $("[name=password]").val();
        if (!usernameCheck(name) || !passwordCheck(pass)) {
            $("#msg").text("用户信息输入有误, 请检查后重试");
            return;
        }
        $.post("/signin", {username: name, password: pass}).done(function (data) {
            window.location.href = "/?username=" + name;
        }).fail(function (xhr, data) {
            if (xhr.responseText === "1") {
                $("#msg").text("密码错误！");
            }
            else if (xhr.responseText === "2") {
                $("#msg").text("用户名不存在！");
            }
        })
    });
    $("[name=username]").focus(function () {
        $("#username-checker").text("");
    }).blur(function () {
        let text = $("[name=username]").val();
        if (!usernameCheck(text)) {
            $("#username-checker").text("用户名输入有误").removeClass("valid").addClass("invalid");
        }
    });
    $("[name=password]").focus(function () {
        $("#password-checker").text("");
    }).blur(function () {
        let text = $("[name=password]").val();
        if (!passwordCheck(text)) {
            $("#password-checker").text("密码输入有误").removeClass("valid").addClass("invalid");
        }
    });
    $("#signup").click(function () {
        window.location.href = '/regist';
    })
};
