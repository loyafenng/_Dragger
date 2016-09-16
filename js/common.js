$(function() {
    $(document).on("click", ".panel[module-autocollapse] .panel-heading", function() {
        //$(this).parent().parent().toggleClass("collapsed");
        $(this).parent().toggleClass("collapsed");
    });

    //window.module || container.
    //$(document).on("skin.reset", function (e,skin) {
    //    console.log(skin);
    //});
    if (!window.module) {
        window.module = {};
    }
    window.module.setSkin = function(skin) {
        //$(".container").removeClass(function() {
        //    return $(this).prev().attr('class');
        //});
        $("body").removeClass("skin-default skin-blue").addClass("skin-" + skin);
    };

    window.module.initControls = function() {
        //$(".checkbox").each(function () {
        //    var obj = $(this).find("input");
        //    obj.css({ opacity: 0 });
        //    obj.after('<i class="icon"></ins>');          
        //});      
        //$(".checkbox label").click(function (e) {
        //    if (e.target.tagName != "INPUT")
        //        return;          
        //    if ($(this).hasClass("checked")) {
        //        $(this).removeClass("checked");
        //    }
        //    else {
        //        $(this).addClass("checked");
        //    }
        //});
        $(".radio>label").each(function() {
            var checked = $(this).find("input").prop("checked");
            if (checked) {
                $(this).addClass("checked");
            }
        });
        $(".checkbox>label").each(function() {
            var checked = $(this).find("input").prop("checked");
            if (checked) {
                $(this).addClass("checked");
            }
        });
        //$(".radio.allownone>label").each(function () {
        //    var checked = $(this).find("input").prop("checked");
        //    if (checked) {
        //        $(this).find("input").prop("checked")
        //    }
        //});

        $(document).on("click", ".radio>label", function(e) {
            var ev = e || window.event;
            var elm = ev.target || ev.srcElement;
            if (elm.tagName === 'LABEL') {
                $(this).addClass("checked");
                $(this).siblings().removeClass("checked");
                return;
            }
        });
        $(document).on("click", ".checkbox>label", function(e) {
            var ev = e || window.event;
            var elm = ev.target || ev.srcElement;
            if (elm.tagName === 'LABEL') {
                $(this).toggleClass("checked");
                return;
            }
        });

        //自定义复选框
        $(document).on("click", "checkbox:not([disable])", function(e) {
            //console.log($(this).attr("checked"));      
            var obj = $(this);
            if (obj.attr("status") == "checked") {
                obj.attr("status", "false");
            } else {
                obj.attr("status", "checked")
            }
            obj.trigger("change");

        });
    }
    window.module.initControls();

    window.module.require = function(modules) {
        require(modules);
    }

});