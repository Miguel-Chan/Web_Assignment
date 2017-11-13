

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

window.onload = function () {
    $("#file").change(addImage);
    for (var i = 0; i < 16; i++) {
        $("#playground").append($("<div></div>").attr("class", "pieces"));
    }
};