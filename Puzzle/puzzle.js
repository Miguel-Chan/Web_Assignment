
var current_blank;
var pieces = [];
var currentPictureFile = "panda.jpg";

function addImage() {
    if (document.getElementById("file").files.length === 0) return;
    var reader = new FileReader();
    var file = document.getElementById("file").files[0];
    var nameFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    if (!nameFilter.test(file.type)) {
        alert("请选择图片文件！");
        return;
    }
    reader.readAsDataURL(file);
    reader.onload = function(eve) {
        currentPictureFile = eve.target.result;
        $(".pieces").css("backgroundImage", "url(\""+ currentPictureFile + "\")");
        showPicture();
    }
}

function changeClass(element, old_class, new_class) {
    element.removeClass(old_class);
    element.addClass(new_class);
    return element;
}

Array.prototype.swapElement = function (indexA, indexB) {
    let temp = this[indexA];
    this[indexA] = this[indexB];
    this[indexB] = temp;
};

function move(element, direction, pos) {
    var value = element.css("left");
    if (value.slice(0, value.length - 2) % 125 !== 0) return false;
    value = element.css("top");
    if (value.slice(0, value.length - 2) % 125 !== 0) return false;
    if (direction === "left") {
        element.animate({left: '-=125px'}, 400);
        $("#blank").animate({left: '+=125px'}, 0);
    }
    else if (direction === "right") {
        element.animate({left: '+=125px'}, 400);
        $("#blank").animate({left: '-=125px'}, 0);
    }
    else if (direction === "up") {
        element.animate({top: '-=125px'}, 400);
        $("#blank").animate({top: '+=125px'}, 0);
    }
    else if (direction === "down") {
        element.animate({top: '+=125px'}, 400);
        $("#blank").animate({top: '-=125px'}, 0);
    }
    if (pos) pieces.swapElement(pos, current_blank);
    setTimeout(function () {
        if(check()) {
            $("#message").text("恭喜！你完成了拼图！");
        }
        else {
            $("#message").text("");
        }
    }, 400);
    return true;
}

function setPosition(element, pos) {
    element.css("left", (125 * (pos % 4)).toString() + "px");
    element.css("top", (125 * Math.floor(pos / 4)).toString() + "px");
}

function check() {
    for (var i = 0; i < 16; i++) {
        var className = pieces[i].attr("class");
        if (Math.abs(className.slice(className.length-2)) !== i) {
            return false
        }
    }
    return true;
}

function generateSequence() {
    var seq = [];
    for (var i = 0; i < 16; i++) {
        var temp = Math.floor(Math.random() * 16);
        while (seq.indexOf(temp) !== -1)
            temp = Math.floor(Math.random() * 16);
        seq[i] = temp;
    }
    current_blank = Math.floor(Math.random() * 16);
    return seq;
}

function getInversion(seq) {
    var result = 0
    for (var i = 0; i < seq.length; i++) {
        for (var k = i+1; k < seq.length; k++) {
            if (seq[i] > seq[k]) result++;
        }
    }
    return result;
}

function getParity(inversion, blankSpot) {
    var val = inversion + Math.floor((blankSpot)/4+1) + Math.floor((blankSpot)%4+1);
    return val % 2;
}

function checkSequence(seq) {
    var originZeroEle = seq[current_blank];
    var sequence = seq.slice();
    var originSequence = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    originSequence[originZeroEle] = 0;
    for (var i = 0; i < sequence.length; i++) {
        if (i === current_blank) sequence[i] = 0;
        else if (sequence[i] < originZeroEle) sequence[i]++;
        if (originSequence[i] < originZeroEle) originSequence[i]++;
    }
    var inversion = getInversion(sequence), originInversion = getInversion(originSequence);
    return getParity(inversion, current_blank) === getParity(originInversion, originZeroEle);
}

function startGame() {
    $("#switch").text("重新开始");
    $("#message").text("");
    var sequence = generateSequence();
    while(!checkSequence(sequence))
        sequence = generateSequence();
    $('#playground').empty();
    for (var i = 0; i < sequence.length; i++) {
        var new_piece = $("<div></div>").addClass("pieces").addClass("piece-" + sequence[i]);
        if (i === current_blank) new_piece.attr("id", "blank").removeClass("pieces");
        else new_piece.click(getPieceClickFunc(i, sequence[i]));
        $("#playground").append(new_piece);
        pieces[i] = new_piece;
    }
    $(".pieces").css("backgroundImage", "url(\""+ currentPictureFile + "\")");
    $("#blank").animate({opacity: "1"}, 1500).animate({opacity: "0"}, 1500);
}

function getPieceClickFunc(ini, cls) {
    var pos = ini;
    return function () {
        if (Math.abs(pos - current_blank) === 1) {
            if (pos - current_blank > 0 && pos % 4 !== 0) {
                if (move($(".piece-" + cls), "left", pos)) {
                    current_blank += 1;
                    pos -= 1;
                }
            }
            else if (pos % 4 !== 3) {
                if (move($(".piece-" + cls), "right", pos)) {
                    current_blank -= 1;
                    pos += 1;
                }
            }
        }
        else if (Math.abs(pos - current_blank) === 4) {
            if (pos - current_blank > 0 && pos > 3) {
                if (move($(".piece-" + cls), "up", pos)) {
                    current_blank += 4;
                    pos -= 4;
                }
            }
            else if (pos < 12) {
                if (move($(".piece-" + cls), "down", pos)) {
                    current_blank -= 4;
                    pos += 4;
                }
            }
        }
    }
}

function showPicture() {
    current_blank = 100;
    $('#playground').empty();
    for (var i = 0; i < 16; i++) {
        var new_piece = $("<div></div>").addClass("pieces").addClass("piece-" + i);
        new_piece.click(getPieceClickFunc(i, i));
        $("#playground").append(new_piece);
        pieces[i] = new_piece;
    }
    $(".pieces").css("backgroundImage", "url(\""+ currentPictureFile + "\")");
    $("#switch").text("开始");
    $("#message").text("请点击开始按钮以开始游戏");
}

window.onload = function () {
    $("#file").change(addImage);
    showPicture();
    current_blank = 15;
    $("#switch").click(startGame);
};