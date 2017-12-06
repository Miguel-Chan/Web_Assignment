let handlers = {
    'ajaxHandler': function (i, hold, resolve, reject, currentSum, text, rejectText) {
        let isFail = this.isFail;
        return function (data) {
            if ($(".red-" + i).css("display") === "none" || !isNaN(parseInt($(".red-" + i).text()))) return;
            $(".red-" + i).text(data);
            for (let ind of hold)
                $("#butt-" + ind).removeClass("disabled").addClass("enabled");
            $("#butt-" + i).removeClass("enabled").addClass("disabled");
            if (hold.length === 0) $("#info-bar").removeClass("disabled").addClass("enabled");
            currentSum += parseInt(data);
            if (!!reject && isFail()) {
                reject([rejectText, currentSum]);
                $(".red-" + i).text("X");
                return;
            }
            if (!!text) $("#msg").append($("<li></li>").text(text));
            if (!!resolve) resolve(currentSum);
        }
    },
    'isFail': function () {
        return Math.random() < 0.15;
    },
    'generalHandler': function (id, currentSum, resolve, reject, resolveText, rejectText) {
        let hold = [];
        $("#sum").text("");
        for (let i = 1; i <= 5; i++) {
            if (i !== id && $("#butt-" + i).hasClass("enabled")) {
                hold.push(i);
                $("#butt-" + i).removeClass("enabled").addClass("disabled");
            }
        }
        $("#butt-" + id).removeClass("enabled").addClass("disabled");
        $(".red-" + id).show().text("...");
        $.ajax("/" + id).done(this.ajaxHandler(id, hold, resolve, reject, currentSum, resolveText, rejectText));
    },
    'aHandler': function (currentSum, resolve, reject) {
        this.generalHandler(1, currentSum, resolve, reject, "这是个天大的秘密", "这不是个天大的秘密");
    },
    'bHandler': function (currentSum, resolve, reject) {
        this.generalHandler(2, currentSum, resolve, reject, "我不知道", "我知道");
    },
    'cHandler': function (currentSum, resolve, reject) {
        this.generalHandler(3, currentSum, resolve, reject, "你不知道", "你知道");
    },
    'dHandler': function (currentSum, resolve, reject) {
        this.generalHandler(4, currentSum, resolve, reject, "他不知道", "他知道");
    },
    'eHandler': function (currentSum, resolve, reject) {
        this.generalHandler(5, currentSum, resolve, reject, "才怪", "嗯嗯");
    },
    'bubbleHandler': function (sum, resolve, reject) {
        if (!!reject && this.isFail()) {
            $("#sum").text("X");
            reject(["楼主异步调用战斗力强无敌，目测超过", sum, 1]);
            return;
        }
        if (!sum) {
            sum = 0;
            for (let i = 1; i <= 5; i++) {
                if ($(".red-" + i).text() === "X") continue;
                let num = parseInt($(".red-" + i).text());
                if (isNaN(num)) return;
                sum += num;
            }
        }
        setTimeout(function () {
            $("#sum").text(sum.toString());
            $("#info-bar").removeClass("enabled").addClass("disabled");
            $("#msg").append($("<li></li>").text("楼主异步调用战斗力感人，目测不超过" + sum));
        }, 450);
        resolve();
    }
};

async function robot(event, sequence, initSum) {
    if (!sequence) {
        $("#msg").empty();
        $(".redot").hide().text("");
        sequence = generateSequence();
        showSequence(sequence);
    }
    if (typeof initSum === "undefined") initSum = 0;
    try {
        while (sequence.length !== 0) {
            initSum = await function() {
                return new Promise(function(resolve, reject) {
                    handlers[getAlpha(sequence.shift()).toLowerCase() + "Handler"](initSum, resolve, reject);
                })
            }();
        }
        await new Promise(function (resolve, reject) {
            handlers.bubbleHandler(initSum, resolve, reject);
        })
    }
    catch (e) {
        $("#msg").append($("<li></li>").text(e[0] + " " + e[1]));
        initSum = e[1];
        if (!e[2]) robot(event, sequence, initSum);
    }
}

async function buttonHandler(id, resolve) {
    if (!resolve) {
        if ($(this).hasClass("disabled")) return;
        id = $(this).attr("id")[$(this).attr("id").length - 1];
    }
    else if ($("#butt-" + id).hasClass("disabled")) return;
    $("#sum").text("");
    handlers[getAlpha(parseInt(id)).toLowerCase() + "Handler"](0);
}

function getAlpha(num) {
    return (num + 9).toString(36).toUpperCase();
}

function generateSequence() {
    let res = [];
    while (res.length !== 5) {
        let temp = Math.floor(Math.random() * 5 + 1);
        if (res.indexOf(temp) !== -1) continue;
        res.push(temp);
    }
    return res;
}

function showSequence(seq) {
    let seqStr = "";
    for (let ele of seq) {
        seqStr = seqStr + getAlpha(ele) + " ";
    }
    $("#seq").show().text(seqStr);
}

window.onload = function () {
    $(".redot").hide();
    $("#seq").hide().text("");
    $(".button").click(buttonHandler);
    $("#info-bar").click(function () {
        if ($(this).hasClass("disabled")) return;
        handlers.bubbleHandler();
        $(".button").removeClass("disabled").addClass("enabled");
    });
    $("#button").hover(function () {
        $("#sum").text("");
        $("#info-bar").removeClass("enabled").addClass("disabled");
        $(".redot").hide().text("");
        $("#seq").hide().text("");
        $("#msg").empty();
        $(".button").removeClass("disabled").addClass("enabled");
    });
    $(".apb").click(function (event) {
        if ($(".button").hasClass("disabled")) return;
        robot(event);
    });
};