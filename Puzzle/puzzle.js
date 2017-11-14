
var current_blank;

function addImage() {
    if (document.getElementById("file").files.length === 0) return;
    var reader = new FileReader();
    var file = document.getElementById("file").files[0];
    var nameFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    if (!nameFilter.test(file.type)) {
        alert("请选择图片文件！");
    }
    reader.readAsDataURL(file);
    reader.onload = function(eve) {
        $(".pieces").css("backgroundImage", "url(\""+ eve.target.result + "\")");
    }
}

function changeClass(element, old_class, new_class) {
    element.removeClass(old_class);
    element.addClass(new_class);
    return element;
}

function switchClass(first, fClass, second, sClass) {
    first.removeClass(fClass);
    second.removeClass(sClass);
    first.addClass(sClass);
    second.addClass(fClass);
}

function move(element, direction) {
    if (direction === "left")
        element.animate({left: '-=125px'}, 350);
    else if (direction === "right")
        element.animate({left: '+=125px'}, 350);
    else if (direction === "up")
        element.animate({top: '-=125px'}, 350);
    else if (direction === "down")
        element.animate({top: '+=125px'}, 350);
}

window.onload = function () {
    $("#file").change(addImage);
    for (var i = 0; i < 15; i++) {
        var new_piece = $("<div></div>").addClass("pieces").addClass("piece-" + i);
        new_piece.click(function (ini) {
            var pos = ini;
            return function () {
                if (Math.abs(pos - current_blank) === 1) {
                    if (pos - current_blank > 0 && pos % 4 !== 0) {
                        move($(".piece-" + ini), "left");
                        current_blank += 1;
                        pos -= 1;
                    }
                    else if (pos % 4 !== 3) {
                        move($(".piece-" + ini), "right");
                        current_blank -= 1;
                        pos += 1;
                    }
                }
                else if (Math.abs(pos - current_blank) === 4) {
                    if (pos - current_blank > 0 && pos > 3) {
                        move($(".piece-" + ini), "up");
                        current_blank += 4;
                        pos -= 4;
                    }
                    else if (pos < 12) {
                        move($(".piece-" + ini), "down");
                        current_blank -= 4;
                        pos += 4;
                    }
                }
            }
        }(i));
        new_piece.number = i;
        $("#playground").append(new_piece);
    }
    current_blank = 15;
};