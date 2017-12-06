let handlers = {
    'ajaxHandler': function (i, hold, resolve, currentSum, text) {
        return function (data) {
            if ($(".red-" + i).css("display") === "none") return;
            $(".red-" + i).text(data);
            for (let ind of hold)
                $("#butt-" + ind).removeClass("disabled").addClass("enabled");
            $("#butt-" + i).removeClass("enabled").addClass("disabled");
            if (hold.length === 0) $("#info-bar").removeClass("disabled").addClass("enabled");
            if (!!text) $("#msg").append($("<li></li>").text(text));
            currentSum += parseInt(data);
            if (!!resolve) resolve(currentSum);
        }
    },
    'isFail': function () {
        return Math.random() < 0.1;
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
        if (!!reject && this.isFail()) {
            reject([rejectText, currentSum]);
            return;
        }
        $.ajax("/" + id).done(this.ajaxHandler(id, hold, resolve, currentSum, resolveText));
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
            reject(["楼主异步调用战斗力强无敌，目测超过", sum]);
            return;
        }
        if (!sum) {
            sum = 0;
            for (let i = 1; i <= 5; i++) {
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
    $(".apb").click(async function () {
        if ($(".button").hasClass("disabled")) return;
        $("#msg").empty();
        $(".redot").hide().text("");
        let sequence = generateSequence();
        showSequence(sequence);
        let run = new Promise(function (resolve, reject) {
            handlers[getAlpha(sequence[0]).toLowerCase() + "Handler"](0, resolve, reject);
        }).then(function (sum) {
            return new Promise(function (resolve, reject) {
                handlers[getAlpha(sequence[1]).toLowerCase() + "Handler"](sum, resolve, reject);
            });
        }).then(function (sum) {
            return new Promise(function (resolve, reject) {
                handlers[getAlpha(sequence[2]).toLowerCase() + "Handler"](sum, resolve, reject);
            });
        }).then(function (sum) {
            return new Promise(function (resolve, reject) {
                handlers[getAlpha(sequence[3]).toLowerCase() + "Handler"](sum, resolve, reject);
            });
        }).then(function (sum) {
            return new Promise(function (resolve, reject) {
                handlers[getAlpha(sequence[4]).toLowerCase() + "Handler"](sum, resolve, reject);
            });
        });
     /*   for (let i = 1; i < sequence.length; i++) {
            run.then(function (ind) {
                return function (sum) {
                    return new Promise(function (resolve, reject) {
                        handlers[getAlpha(sequence[ind]).toLowerCase() + "Handler"](sum, resolve, reject);
                    });
                }
            }(i));
        }*/
        run.then(function (sum) {
            return new Promise(function (resolve, reject) {
                handlers.bubbleHandler(sum, resolve, reject)
            })
        }).catch(function (errorPair) {
            $("#msg").append($("<li></li>").text(errorPair[0] + " " + errorPair[1]));
        })
    });
};