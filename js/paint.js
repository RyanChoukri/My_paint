"use strict";
/*Initilalisation des variables*/
/*Calque*/
var current = 1;
var count = 2;
var bool = true;
var hidden = Object.create(null);
var arrayJson = Object.create(null);
/*Multi*/
var multi = false;
var modeIo;
var allErase = false;

/*Canvas*/
var f_rec;
var f_cer;
var f_line;
var pos_rec;
var pos_cer;
var pos_line;
var erase = false;
var symetric = false;
var cur_sym;
var fill = false;
var state = "brush";
var mouse = {x: 0, y: 0};
var zone = $("#zone")[0];
var canvas = Object.create(null);
canvas[current] = $("#canvas_1")[0];
var ctx = Object.create(null);
ctx[current] = canvas[current].getContext("2d");
var zone_style = getComputedStyle(zone);
var disableDeaw = true;

/*symetrie*/
var canvas_sym;
var zone_sym;
var ctx_sym;

/*Recuperation des taille du canvas et ajout dans le canvas*/
canvas[current].width = parseInt(zone_style.getPropertyValue("width"));
canvas[current].height = parseInt(zone_style.getPropertyValue("height"));
$(".calque_li").css("background-color", "rgba(" + Math.round(Math.random() * 256) + "," + Math.round(Math.random() * 256) + "," + Math.round(Math.random() * 256) + ",0.4)");

/*Paramètre pour dessiner*/
ctx[current].lineWidth = 4.18;
ctx[current].lineCap = "round";
ctx[current].lineJoin = "round";
ctx[current].strokeStyle = "#353535";
ctx[current].fillStyle = "#353535";

/*Selecteur*/
$(".select").on("click", function () {
    state = $(this).data("type");
    var li = $(this).parent("li");
    $("li").removeClass("active");
    li.addClass("active");
});

$(".draw_type").on("click", function () {
    fill = ($(this)[0].id === "fill") ? true : false;
    $(".draw_type").prop("checked", false);
    this.checked = true;
});

$("#fuckingshit").on("change", function () {
    ctx[current].strokeStyle = $(this).val();
    ctx[current].fillStyle = $(this).val();
});

$("#range").on("change", function () {
    var size = $(this).val() / 20 * 10.4;
    ctx[current].lineWidth = size > 0 ? size : 1;
});


$("#eraser").on("click", function () {
    var li = $(this).parent("li");
    if (!erase) {
        $("li").removeClass("active");
        li.addClass("active_erase");
        erase = true;
        $("[data-type='brush']").parent("li").addClass("active");
        state = "brush";
    } else {
        erase = false;
        state = "brush";
        $("li").removeClass("active");
        li.removeClass("active_erase");
    }
});

function addTmpCanvas(li, sym) {
    cur_sym = sym;
    if (sym === "hor") {
        $("#zone").removeClass("style_p");
        $("#zone").addClass("hor_in");
    }
    li.addClass("active_sym");
    symetric = true;
    if ($("#zone_sym").length === 0) {
        $("#zone").after("<div class=" + sym + " id='zone_sym'><canvas id='canvas_sym'></canvas></div>");
    } else {
        $("#zone_sym").removeClass("hor");
        $("#zone_sym").removeClass("ver");
        $("#zone_sym").addClass(sym);
    }

    canvas_sym = $("#canvas_sym")[0];
    zone_sym = $("#zone_sym")[0];
    ctx_sym = canvas_sym.getContext("2d");
    canvas_sym.width = parseInt(zone_style.getPropertyValue("width"));
    canvas_sym.height = parseInt(zone_style.getPropertyValue("height"));
    var buffer = ctx[current].getImageData(0, 0, 800, 420);
    ctx_sym.putImageData(buffer, 0, 0);
}

$(".sym").on("click", function () {
    var sym = $(this).data("sym");
    var li = $(this).parent("li");

    if (symetric) {
        if (sym === cur_sym) {
            symetric = false;
            $("#zone_sym").remove();
            $("#zone").removeClass("hor_in");
            $("#zone").addClass("style_p");
            $("li").removeClass("active_sym");
        } else {
            $("#zone").removeClass("hor_in");
            $("#zone").addClass("style_p");
            $("li").removeClass("active_sym");
            addTmpCanvas(li, sym);
        }
    } else {
        addTmpCanvas(li, sym);
    }
});

$("#rgb").on("change", function () {

    ctx[current].strokeStyle = $(this).val();
    ctx[current].fillStyle = $(this).val();
});

$(".color_td").on("click", function () {
    ctx[current].strokeStyle = $(this).data("color");
    ctx[current].fillStyle = $(this).data("color");
});

/*Dessin Sur le canvas*/
var draw_sym = function () {
    var canv = document.createElement("canvas");
    canv.width = parseInt(zone_style.getPropertyValue("width"));
    canv.height = parseInt(zone_style.getPropertyValue("height"));
    var context = canv.getContext("2d");

    $.each(canvas, function (key, value) {
        context.drawImage(canvas[key], 0, 0, 800, 420);
    });
    var buffering = context.getImageData(0, 0, 800, 420);
    ctx_sym.putImageData(buffering, 0, 0);
};

/*Option*/
var select_and_draw = function () {
    ctx[current].globalCompositeOperation = "source-over";
    if (erase) {
        ctx[current].globalCompositeOperation = "destination-out";
    }
    ctx[current].closePath();
    if (fill) {
        ctx[current].fill();
    } else {
        ctx[current].stroke();
    }
    if (symetric) {
       window.draw_sym();
    }
};

var draw = function () {
    ctx[current].globalCompositeOperation = "source-over";
    if (erase) {
        ctx[current].globalCompositeOperation = "destination-out";
    }
    ctx[current].lineTo(mouse.x, mouse.y);
    ctx[current].stroke();
    if (symetric) {
       window.draw_sym();
    }
};

var draw_line = function () {
    if (f_line) {
        ctx[current].beginPath();
        ctx[current].moveTo(pos_line[0], pos_line[1]);
        ctx[current].lineTo(mouse.x, mouse.y);
        ctx[current].closePath();
        ctx[current].stroke();
        f_line = false;
        if (symetric) {
            window.draw_sym();
        }
    } else {
        pos_line = [mouse.x, mouse.y];
        f_line = true;
    }
};

var draw_rec = function () {
    if (f_rec) {
        ctx[current].beginPath();
        var cur = [pos_rec[0] - mouse.x, pos_rec[1] - mouse.y];
        ctx[current].rect(mouse.x, mouse.y, cur[0], cur[1]);
        select_and_draw();
        f_rec = false;
    } else {
        pos_rec = [mouse.x, mouse.y];
        f_rec = true;
    }
};

var draw_cer = function () {
    if (f_cer) {
        /*CIMER PYTHAGORE !!!*/
        var diago = Math.pow(pos_cer[0] - mouse.x, 2) + Math.pow(pos_cer[1] - mouse.y, 2);
        diago = Math.sqrt(diago);
        ctx[current].beginPath();
        ctx[current].arc(pos_cer[0], pos_cer[1], diago, 0, 2 * Math.PI);
        select_and_draw();
        f_cer = false;
    } else {
        pos_cer = [mouse.x, mouse.y];
        f_cer = true;
    }
};



$("#zone").on("mousemove", function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
});

$("#zone").on("mousedown", canvas[current], function () {
    if (state === "brush" && disableDeaw) {
        ctx[current].beginPath();
        ctx[current].moveTo(mouse.x, mouse.y);
        $("#zone").on("mousemove", canvas[current], draw);
    }
});

$("#zone").on("click", canvas[current], function () {
    switch (state) {
    case "line":
        draw_line();
        break;
    case "rec":
        draw_rec();
        break;
    case "cer":
        draw_cer();
        break;
    }
});

$("#zone").on("mouseup", canvas[current], function () {
    if (state === "brush") {
        $("#zone").unbind("mousemove", draw);
    }
});

$("#zone").on("mouseenter", canvas[current], function () {
    if (state === "brush") {
        $("#zone").unbind("mousemove", draw);
    }
});


$("#dl").on("click", function () {
    var canv = document.createElement("canvas");
    canv.width = parseInt(zone_style.getPropertyValue("width"));
    canv.height = parseInt(zone_style.getPropertyValue("height"));
    var context = canv.getContext("2d");
    $.each(canvas, function (key, value) {
        context.drawImage(canvas[key], 0, 0, 800, 420);
    });

    var dt = canv.toDataURL("image/png");
    this.href = dt.replace(/^data:image\/[^;]/, "data:application/octet-stream");
});


var getAll = function () {
    $.each(canvas, function (key, value) {
        var canv = document.createElement("canvas");
        canv.width = parseInt(zone_style.getPropertyValue("width"));
        canv.height = parseInt(zone_style.getPropertyValue("height"));
        var context = canv.getContext("2d");
        context.drawImage(canvas[key], 0, 0, 800, 420);
        arrayJson[key] = canv.toDataURL("image/png");
    });
};


$("#jsonDl").on("click", function () {
    getAll();
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrayJson));
    this.href = dataStr;
});

var algo_crop = function (img) {
    var perW = (100 * 800) / img.width;
    var perH = (100 * 420) / img.height;
    if (img.height > 420) {
        img.width = (perH * img.width) / 100;
        img.height = (perH * img.height) / 100;
    }
    if (img.width > 800) {
        img.width = (perW * img.width) / 100;
        img.height = (perW * img.height) / 100;
    }
    ctx[current].drawImage(img, 0, 0, img.width, img.height);
};

$("#imgupload").on("change", function () {
    if (this.files && this.files[0]) {
        var read_file = new FileReader();
        read_file.onload = function (e) {
          var img = new Image();
          img.onload = function () {
                algo_crop(img);
                if (symetric) {
                    draw_sym();
                }
            };
            img.src = e.target.result;
        };
    }
    read_file.readAsDataURL(this.files[0]);
});

var addCanvas = function () {
    if (count >= 11) {
        bool = false;
    }
    if (bool) {
        var model = "<li class='calque_li' data-nb=" + count + "><span>calque " + count + " " +
                "</span><i class='material-icons icon_vi'>visibility_off</i>" +
                "<i class='fa fa-arrow-left undo' aria-hidden='true'></i><i class='fa fa-arrow-right redo' aria-hidden='true'></i>";
        $("#calque").append($(model).css("background-color", "rgba(" + Math.round(Math.random() * 256) + "," +
        Math.round(Math.random() * 256) + "," + Math.round(Math.random() * 256) + ",0.4)"));

        /*canvasDom*/
        var newCanvas = document.createElement("canvas");
        $(newCanvas).attr("id", "canvas_" + count);
        $("#zone").append(newCanvas);
        $(newCanvas).data("pos", count);
        newCanvas.width = canvas[current].width;
        newCanvas.height = canvas[current].height;
        ctx[count] = newCanvas.getContext("2d");

        ctx[count].lineWidth = ctx[current].lineWidth;
        ctx[count].lineCap = ctx[current].lineCap;
        ctx[count].lineJoin = ctx[current].lineJoin;
        ctx[count].strokeStyle = ctx[current].strokeStyle;
        ctx[count].fillStyle = ctx[current].fillStyle;

        canvas[count] = $("#canvas_" + count)[0];
        hidden[count] = false;
        count = count + 1;
    }
};

$("#more").on("click", function () {
    addCanvas();
});


$("#calque").on("click", ".calque_li", function () {
    current = parseInt($(this).data("nb"));
    $(".calque_li").removeClass("cur_calque");
    $("*[data-nb=" + current + "]").addClass("cur_calque");
});

$("#calque").on("click", ".icon_vi", function () {
    var cur = $(this).parent("li").data("nb");
    if (hidden[cur]) {
        $("#canvas_" + cur).show("400");
        $(this).removeClass("hidenn");
        hidden[cur] = false;
    } else {
        $(this).addClass("hidenn");
        $("#canvas_" + cur).hide("400");
        hidden[cur] = true;
    }
});

$("#calque").on("click", ".undo", function () {
    var cur_li = $(this).parent("li");
    var nb = cur_li.data("nb");
    if (cur_li[0].previousElementSibling) {
        cur_li[0].parentNode.insertBefore(cur_li[0], cur_li[0].previousElementSibling);
    }
    if (canvas[nb].previousElementSibling) {
        canvas[nb].parentNode.insertBefore(canvas[nb], canvas[nb].previousElementSibling);
    }
});

$("#calque").on("click", ".redo", function () {
    var cur_li = $(this).parent("li");
    var nb = cur_li.data("nb");
    if (cur_li[0].nextElementSibling) {
        cur_li[0].parentNode.insertBefore(cur_li[0].nextElementSibling, cur_li[0]);
    }
    if (canvas[nb].nextElementSibling) {
        canvas[nb].parentNode.insertBefore(canvas[nb].nextElementSibling, canvas[nb]);
    }
});

$(document).on("dragenter", canvas[current], function () {
    return false;
});

$(document).on("dragover", canvas[current], function (e) {
    e.preventDefault();
    e.stopPropagation();
});

$(document).on("dragleave", canvas[current], function (e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
});

$(document).on("drop", canvas[current], function (e) {
    if (e.originalEvent.dataTransfer.files.length) {
        e.preventDefault();
        e.stopPropagation();
        readfile(e.originalEvent.dataTransfer.files);
    }
    return false;
});

var addToCanvas = function (files) {
    var DomImg = document.createElement("img");
    DomImg.setAttribute("src", files);
    algo_crop(DomImg);
    if (symetric) {
        draw_sym();
    }
};

var switchCanvas = function (data) {
    $.each(JSON.parse(data), function (index, val) {
        if (canvas[index] === undefined) {
            addCanvas();
        }
        current = index;
        addToCanvas(val);
    });
};

var readjson = function (files) {
    var read_file = new FileReader();
    read_file.onload = function (e) {
        var exeption = e.target.result.replace(/^data:text\/(png|json);base64,/, "");
        exeption = exeption.replace(/^data:;base64,/, "");
        var decodedString = atob(exeption);
        switchCanvas(decodedString);

    };
    read_file.readAsDataURL(files[0]);
};

var readfile = function (files) {
    var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(files[0].type, ValidImageTypes) === -1) {
        readjson(files);
        return;
    }
    var read_file = new FileReader();
    read_file.onload = function (e) {
        var img = new Image();
        img.onload = function () {
            algo_crop(img);
            if (symetric) {
                draw_sym();
            }
        };
        img.src = e.target.result;
    };
    read_file.readAsDataURL(files[0]);
};

var sendCanvas = function () {
    getAll();
    if (allErase) {
        arrayJson = {};
    }
    $.ajax({
        type: "POST",
        url: "http://localhost/JavaScript_Avance_my_paint/io/send.php",
        data: {myData: JSON.stringify(arrayJson)}
    });
};

var refreshLive = function () {
    if (allErase) {
        arrayJson = {};
        allErase = false;
    }
    $.ajax({
        type: "POST",
        url: "http://localhost/JavaScript_Avance_my_paint/io/get.php",
        data: {myData: JSON.stringify(arrayJson)},
        success: function (data) {
            switchCanvas(data);
            setTimeout(sendCanvas, 180);
        }
    });
};

$(".brand-logo").on("click", function () {
    if (multi) {
        clearInterval(modeIo);
        multi = !multi;
        $(this).removeClass("onlive");
    } else {
        modeIo = setInterval(refreshLive, 200);
        multi = !multi;
        $(this).addClass("onlive");
    }
});

$("#clear").on("click", function () {
    allErase = true;
    $.each(ctx, function (key, value) {
        ctx[key].clearRect(0, 0, 800, 420);
    });
});