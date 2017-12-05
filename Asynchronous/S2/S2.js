async function buttonHandler(id, resolve) {
    if (!resolve) {
        if ($(this).hasClass("disabled")) return;
        id = $(this).attr("id")[$(this).attr("id").length - 1];
    }
    else if ($("#butt-" + id).hasClass("disabled")) return;
    $("#sum").text("");
    let hold = [];
    for (let i = 1; i <= 5; i++) {
        if (i !== parseInt(id) && $("#butt-" + i).hasClass("enabled")) {
            hold.push(i);
            $("#butt-" + i).removeClass("enabled").addClass("disabled");
        }
    }
    $(".red-" + id).show().text("...");
    $.ajax("/").done(function (data) {
        if ($(".red-" + id).css("display") === "none") return;
        $(".red-" + id).text(data);
        for (let ind of hold)
            $("#butt-" + ind).removeClass("disabled").addClass("enabled");
        $("#butt-" + id).removeClass("enabled").addClass("disabled");
        if (hold.length === 0) $("#info-bar").removeClass("disabled").addClass("enabled");
        if (!!resolve) resolve();
    });
}

window.onload = function () {
    $(".redot").hide();
    $(".button").click(buttonHandler);
    $("#info-bar").click(function () {
        if ($(this).hasClass("disabled")) return;
        let sum = 0;
        for (let i = 1; i <= 5; i++) {
            let num = parseInt($(".red-" + i).text());
            if (isNaN(num)) return;
            sum += num;
        }
        $("#sum").text(sum.toString());
        $(this).removeClass("enabled").addClass("disabled");
        // $(".redot").hide().text("");
        // $(".button").removeClass("disabled").addClass("enabled");
    });
    $("#button").hover(function () {
        $("#sum").text("");
        $("#info-bar").removeClass("enabled").addClass("disabled");
        $(".redot").hide().text("");
        $(".button").removeClass("disabled").addClass("enabled");
    });
    $(".apb").click(async function () {
        for (let i = 1; i <= 5; i++) {
            await function (index) {
                return new Promise(resolve => {
                    buttonHandler(index, resolve);
                });
            }(i)
        }
        await function () {
            return new Promise(resolve => {
                setTimeout(function() {$("#info-bar").trigger("click");}, 500);
                resolve();
            });
        }();
    });
};