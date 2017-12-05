let redotSetter = new function () {
    let filled = [];
    this.setText =  function (id, val) {
        $(".red-" + id).text(val);
        if (filled.indexOf(id) === -1) filled.push(id);
        if (filled.length === 5) setTimeout(function() {
            $("#info-bar").trigger("click");
            }, 500);
    };
    this.clearRecord = function () {
        filled = [];
    };
}();

async function buttonHandler(id, resolve) {
    if (!resolve) {
        if ($(this).hasClass("disabled")) return;
        id = $(this).attr("id")[$(this).attr("id").length - 1];
    }
    else if ($("#butt-" + id).hasClass("disabled")) return;
    $("#sum").text("");
    let hold = [];
    if (!resolve) {
        for (let i = 1; i <= 5; i++) {
            if (i !== parseInt(id) && $("#butt-" + i).hasClass("enabled")) {
                hold.push(i);
                $("#butt-" + i).removeClass("enabled").addClass("disabled");
            }
        }
    }
    $(".red-" + id).show().text("...");
    $.ajax("/").done(function (data) {
        if ($(".red-" + id).css("display") === "none") return;
        if (!resolve)
            $(".red-" + id).text(data);
        else redotSetter.setText(id, data);
        for (let ind of hold)
            $("#butt-" + ind).removeClass("disabled").addClass("enabled");
        $("#butt-" + id).removeClass("enabled").addClass("disabled");
        for (let i = 1; i <= 5; i++) {
            if (isNaN(parseInt($(".red-" + i).text())) || $(".red-" + i).text().length === 0) return;
        }
        $("#info-bar").removeClass("disabled").addClass("enabled");
        // if (!!resolve && id === 5) resolve();
    });
    // if (id !== 5) resolve();
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
        redotSetter.clearRecord();
    });
    $(".apb").click(function () {
        for (let i = 1; i <= 5; i++) {
            buttonHandler(i, true);
        }
    });
};